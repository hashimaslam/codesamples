import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getTeamOfUser, UserRole } from "../../Users/utils/Users";
import { deleteAirdropById, getAirdropById } from "../utils/Airdrops";
import { Airdrop } from "../utils/Airdrop.types";
import { isUUID } from "../../../../../shared/utils/Common";
import { Collection } from "../../Collections/utils/Collections.types";
import { getCollectionById } from "../../Collections/utils/Collections";

interface Request extends APIGatewayProxyEvent {}

const deleteAirdrop = async (event: Request) => {
  const queries = event.pathParameters;
  const airdrop_id = queries!.id as string;
  const collection_id = queries?.collection_id as string;
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return {
      statusCode: 401,
      body: {
        error: "Sorry, you are not an admin/editor. You cannot delete airdrop",
      },
    };
  }
  if (!collection_id || !isUUID(collection_id)) {
    return apiResponse(400, JSON.stringify({ error: "Missing collection id" }));
  }
  // Before deleting, lets see if the airdrop exists
  const airdrop = (await getAirdropById(airdrop_id)) as Airdrop;

  const collectionCurrent: Collection | undefined = await getCollectionById(
    collection_id
  );

  //Check if the airdrop user trying to delete is belongs to his team by checkig through collection
  if (!collectionCurrent || collectionCurrent.team_id !== team.teamId) {
    return {
      statusCode: 400,
      body: {
        error:
          "This collection does not exist or it is not managed by your team",
      },
    };
  }
  if (!airdrop) {
    return {
      statusCode: 400,
      body: { error: "This airdrop does not exist in your team" },
    };
  }

  if (airdrop.txHash && Boolean(airdrop.txHash.length > 0)) {
    return {
      statusCode: 400,
      body: { error: "This airdrop is already executed" },
    };
  }

  const deleted = await deleteAirdropById(airdrop_id);

  return { statusCode: 200, body: { id: airdrop_id, deleted: deleted } };
};

export const handler: any = middlewares(deleteAirdrop);
