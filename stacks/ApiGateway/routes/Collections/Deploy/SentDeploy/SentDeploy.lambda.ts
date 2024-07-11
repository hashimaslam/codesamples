import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../../Users/utils/Users";
import { Collection } from "../../utils/Collections.types";
import { getCollectionById, updateCollection } from "../../utils/Collections";

type RequestData = {
  tx: string;
};

interface Request extends APIGatewayProxyEvent {}

const sentDeployCollection = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot execute this operation",
      })
    );
  }

  const queries = event.pathParameters;
  const collection_id = queries?.id;

  if (!collection_id) {
    return apiResponse(400, JSON.stringify({ error: "Missing collection id" }));
  }

  const collection: Collection | undefined = await getCollectionById(
    collection_id
  );

  if (!collection) {
    return apiResponse(
      400,
      JSON.stringify({ error: "This collection does not exist in your team" })
    );
  }

  if (collection.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This collection is not managed by your team",
      })
    );
  }

  if (collection.deploy_tx && collection.deploy_tx !== "") {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "This collection already has a deploy transaction settled, so it is already deployed",
      })
    );
  }

  const { tx } = JSON.parse(JSON.stringify(event.body) ?? "{}") as RequestData;

  const upd_collection = {
    id: collection.id,
    deploy_tx: tx,
  };
  const updated_collection = await updateCollection(upd_collection);
  return apiResponse(200, JSON.stringify(updated_collection));
};

export const handler: any = middlewares(sentDeployCollection);
