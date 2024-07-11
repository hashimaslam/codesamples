import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../../shared/utils/middlewares";
import {
  getTokenById,
  getTokenOrderById,
  sendStripeEmail,
  updateTokenOrder,
} from "../../utils/Tokens";
import {
  TransferRequest,
  TokenOrder,
  TokenOrderStatus,
} from "../../utils/Tokens.types";
import {
  TokensTransferredType,
  getTokensTransferredTransaction,
} from "../../../../../../shared/utils/TxParser";
import { getCollectionById } from "../../../Collections/utils/Collections";
import { UserRole, getTeamOfUser } from "../../../Users/utils/Users";
import { Collection } from "../../../Collections/utils/Collections.types";
import { SENDGRID_BUYER_TOKEN_PURCHASED_BY_STRIPE } from "../../../../../../shared/utils/Constants";

interface Request extends APIGatewayProxyEvent {}

const transferredTokens = async (event: Request) => {
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

  const collection: Collection | undefined = await getCollectionById(
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

  const contract_chain_id = collection.chain_id!;

  const transferResponse: TokensTransferredType =
    await getTokensTransferredTransaction(
      contract_chain_id,
      request_in.tx_hash,
      orders,
      team.teamId
    );

  if (transferResponse.error) {
    return apiResponse(
      400,
      JSON.stringify({
        error: transferResponse.error,
      })
    );
  }

  //const uniqueOrders = transferResponse.transferred?.map(item => item.order_id)
  //  .filter((value, index, self) => self.indexOf(value) === index);

  let ret = [];

  for (let o = 0, lo = request_in.order_id.length; o < lo; o++) {
    const totalQuantity = transferResponse.transferred
      ?.filter((ord) => ord.order_id === request_in.order_id[o])
      .reduce((n, { quantity }) => n + quantity, 0);
    const targetWallet = transferResponse.transferred?.filter(
      (ord) => ord.order_id === request_in.order_id[o]
    )[0].receiver;

    const tOrder: TokenOrder | undefined = await getTokenOrderById(
      request_in.order_id[o]!
    );

    if (!tOrder) {
      const msg = `Can not find this order ${request_in.order_id[o]}`;
      console.error(msg);
      ret.push({
        id: request_in.order_id[o],
        error: msg,
      });
    } else if (tOrder.status === TokenOrderStatus.Transferred) {
      const msg = `Order ${request_in.order_id[o]} is already transferred`;
      console.error(msg);
      ret.push({
        id: tOrder.id,
        error: msg,
      });
    } else {
      await sendStripeEmail({
        receiverEmail: tOrder.email!,
        tevplateId: SENDGRID_BUYER_TOKEN_PURCHASED_BY_STRIPE,
        tevplateData: {
          collection_name: collection.name,
          token_name: token_in.name,
          quantity: totalQuantity,
          wallet_address: targetWallet,
          transfer_date: new Date().toDateString(),
          purchase_amount: `${tOrder.amount} USD`,
          stripe_receipt_url: tOrder.receipt_url,
        },
      });

      const tokenOrder: TokenOrder = {
        id: tOrder.id,
        status: TokenOrderStatus.Transferred,
        tx_hash: request_in.tx_hash,
        transfer_date: new Date().getTime(),
      };
      const pret = await updateTokenOrder(tokenOrder);
      ret.push(pret);
    }
  }
  return apiResponse(200, JSON.stringify({ orders: ret }));
};

export const handler: any = middlewares(transferredTokens);
