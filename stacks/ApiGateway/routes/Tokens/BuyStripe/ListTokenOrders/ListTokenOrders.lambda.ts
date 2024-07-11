import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../../Users/utils/Users";
import { TokenOrder } from "../../utils/Tokens.types";
import { getTokenOrdersByCollection } from "../../utils/Tokens";

interface Request extends APIGatewayProxyEvent {}

const getListTokenOrders = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you are not an admin. You cannot get this info",
      })
    );
  }

  const orders: TokenOrder[] = await getTokenOrdersByCollection(team.teamId);

  return apiResponse(
    200,
    JSON.stringify({
      orders: orders,
    })
  );
};

export const handler: any = middlewares(getListTokenOrders);
