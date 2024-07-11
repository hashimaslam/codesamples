import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../../Users/utils/Users";
import { TokenOrder, TransferRequest } from "../../utils/Tokens.types";
import {
  getTokenById,
  getTokenOrderById,
  updateToken,
  updateTokenOrder,
} from "../../utils/Tokens";
import { Collection } from "../../../Collections/utils/Collections.types";
import { getCollectionById } from "../../../Collections/utils/Collections";

type RequestData = {
  tx: string;
};

interface Request extends APIGatewayProxyEvent {}

const sentTransfer = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot execute this operation",
      })
    );
  }

  const request_in = JSON.parse(
    JSON.stringify(event.body) ?? "{}"
  ) as TransferRequest;

  if (!request_in.tx_hash) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Missing transaction hash" })
    );
  }

  if (!request_in.order_id || request_in.order_id.length === 0) {
    return apiResponse(400, JSON.stringify({ error: "Missing order id(s)" }));
  }

  let orders: TokenOrder[] = [];
  for (let o = 0, l = request_in.order_id.length; o < l; o++) {
    const order_read: TokenOrder | undefined = await getTokenOrderById(
      request_in.order_id[o]
    );
    if (!order_read) {
      return apiResponse(
        400,
        JSON.stringify({
          error: `Could not find order ${request_in.order_id[o]}`,
        })
      );
    }
    orders.push(order_read);
  }

  const token_in = await getTokenById(orders[0].token_id!);
  if (!token_in) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "Token internal id for this order does not exist",
      })
    );
  }

  const collection: Collection = await getCollectionById(
    orders[0].collection_id as unknown as string
  );
  if (!collection || collection.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "This collection does not belong to a collection managed by your team",
      })
    );
  }

  let ret = [];

  for (let o = 0, lo = request_in.order_id.length; o < lo; o++) {
    const tokenOrder: TokenOrder = {
      id: request_in.order_id[o],
      tx_hash: request_in.tx_hash,
    };
    const pret = await updateTokenOrder(tokenOrder);
    ret.push(pret);
  }

  return apiResponse(200, JSON.stringify({ orders: ret }));
};

export const handler: any = middlewares(sentTransfer);
