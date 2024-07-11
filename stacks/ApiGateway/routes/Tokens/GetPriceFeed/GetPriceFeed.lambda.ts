import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { getPriceInUSDC } from "../../../../../shared/utils/PriceProvider/PriceProvider";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getTeamOfUser } from "../../Users/utils/Users";

interface Request extends APIGatewayProxyEvent {}

const getPriceFeed = async (event: Request) => {
  const queries = event.pathParameters;
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);

  if (!queries || !queries.token) {
    return apiResponse(400, JSON.stringify({ error: "Missing token symbol" }));
  }
  if (!queries.chain_id) {
    return apiResponse(400, JSON.stringify({ error: "Missing chain id" }));
  }

  const priceInUSD = await getPriceInUSDC(
    Number(queries.chain_id),
    team.teamId
  );

  if (priceInUSD === 0) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "Could not recover price from network",
      })
    );
  }

  return apiResponse(
    200,
    JSON.stringify({
      symbol: queries.token,
      priceInUSD: priceInUSD,
    })
  );
};

export const handler: any = middlewares(getPriceFeed);
