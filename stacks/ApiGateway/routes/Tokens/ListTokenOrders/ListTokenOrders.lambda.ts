import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import { TokenOrder } from "../utils/Tokens.types";
import { getTokenOrdersByCollection } from "../utils/Tokens";
import { Collection } from "../../Collections/utils/Collections.types";
import { getCollectionById } from "../../Collections/utils/Collections";

interface Request extends APIGatewayProxyEvent {}

const getListTokenOrders = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const queries = event.pathParameters;
  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you are not an admin. You cannot get this info",
      })
    );
  }

  if (!queries || !queries.id) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Missing collection id",
      })
    );
  }
  const collection_id = queries?.id;
  const collection: Collection | undefined = await getCollectionById(
    collection_id
  );

  if (!collection || collection.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This collection is not managed by your team",
      })
    );
  }
  const orders: TokenOrder[] = await getTokenOrdersByCollection(collection_id);

  return apiResponse(
    200,
    JSON.stringify({
      orders: orders,
    })
  );
};

export const handler: any = middlewares(getListTokenOrders);
