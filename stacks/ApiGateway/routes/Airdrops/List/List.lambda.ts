import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getCollectionById } from "../../Collections/utils/Collections";
import { Collection } from "../../Collections/utils/Collections.types";
import { getTeamOfUser } from "../../Users/utils/Users";

import { Airdrop } from "../utils/Airdrop.types";
import { getAirdropsByCollection, getAirdropsByTeam } from "../utils/Airdrops";

interface Request extends APIGatewayProxyEvent {}

const getListAirdrop = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);
  const queries = event.pathParameters;

  let airdrops: Airdrop[];
  let collection: Collection | undefined = {};
  if (queries && queries.id) {
    const collection_id = queries?.id;
    collection = await getCollectionById(collection_id);

    if (!collection || collection.team_id !== team.teamId) {
      return apiResponse(
        400,
        JSON.stringify({
          error: "This collection is not managed by your team",
        })
      );
    }

    airdrops = await getAirdropsByCollection(
      collection.id as unknown as string
    );
  } else {
    airdrops = await getAirdropsByTeam(team.teamId);
  }

  return apiResponse(
    200,
    JSON.stringify({
      airdrops,
    })
  );
};

export const handler: any = middlewares(getListAirdrop);
