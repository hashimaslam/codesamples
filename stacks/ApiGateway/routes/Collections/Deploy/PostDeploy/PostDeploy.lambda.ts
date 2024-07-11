import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../../shared/utils/middlewares";
import { getTeamOfUser, UserRole } from "../../../Users/utils/Users";
import { Collection } from "../../../Collections/utils/Collections.types";
import {
  getCollectionById,
  updateCollection,
} from "../../../Collections/utils/Collections";

type RequestData = {
  address: string;
};

interface Request extends APIGatewayProxyEvent {}

const postDeployCollection = async (event: Request) => {
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

  if (collection.deploy_tx && collection.deploy_tx === "") {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This collection has not a pending deploy transaction",
      })
    );
  }

  const { address } = JSON.parse(
    JSON.stringify(event.body) ?? "{}"
  ) as RequestData;

  const upd_collection: Collection = {
    id: collection.id,
    address: address,
    deploy_date: new Date().getTime(),
  };
  const updated_collection = await updateCollection(upd_collection);

  return apiResponse(200, JSON.stringify(updated_collection));
};

export const handler: any = middlewares(postDeployCollection);
