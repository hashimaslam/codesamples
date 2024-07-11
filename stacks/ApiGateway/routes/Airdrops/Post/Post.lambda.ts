import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { v4 as uuid } from "uuid";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import { Airdrop } from "../utils/Airdrop.types";
import { getCollectionById } from "../../Collections/utils/Collections";
import { createAirdrop } from "../utils/Airdrops";

interface Request
  extends Omit<APIGatewayProxyEvent, "requestContext" | "body"> {
  requestContext: {
    authorizer: {
      claims: {
        sub: string;
      };
    };
  };
  body: Airdrop;
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer.claims.sub;
  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you are not an admin/editor. You cannot create airdrop",
      })
    );
  }

  const airdrop_in = event.body;

  if (!airdrop_in.name || airdrop_in.name?.trim() === "") {
    return apiResponse(
      400,
      JSON.stringify({ error: "Airdrop name is mandatory" })
    );
  }

  if (!airdrop_in.collection_id || airdrop_in.collection_id?.trim() === "") {
    return apiResponse(
      400,
      JSON.stringify({ error: "Collection id is mandatory" })
    );
  }
  const collection = await getCollectionById(airdrop_in.collection_id);
  if (!collection || collection.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "This airdrop does not belong to a collection managed by your team",
      })
    );
  }

  const newAirdrop: Airdrop = {
    id: uuid(),
    collection_id: collection.id,
    name: airdrop_in.name,
    txHash: airdrop_in.txHash ?? "",
    totalMembers: airdrop_in.totalMembers ?? 0,
  };

  const airdrop = await createAirdrop(newAirdrop);

  return apiResponse(200, JSON.stringify({ id: airdrop.id }));
};

export const handler: any = middlewares(ivplementation);
