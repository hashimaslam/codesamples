import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { apiResponse } from "../../../../../../shared/utils/middlewares";
import { v4 as uuid } from "uuid";
import {
  createTokenOrder,
  getTokenById,
  sendStripeEmail,
} from "../../utils/Tokens";
import Stripe from "stripe";
import {
  Team,
  UserRole,
  getTeamData,
  getUser,
  getUsersByTeam,
} from "../../../Users/utils/Users";
import { SENDGRID_OWNER_TOKEN_PURCHASED_BY_STRIPE } from "../../../../../../shared/utils/Constants";
import {
  getCollectionById,
  updateCollection,
} from "../../../Collections/utils/Collections";
import { Collection } from "../../../Collections/utils/Collections.types";
import {
  TokenOrder,
  TokenOrderStatus,
  TokenOrderType,
} from "../../utils/Tokens.types";
import { StripeConfig, getTeamConfig } from "../../../Tenants/utils/Tenants";

interface Request extends APIGatewayProxyEvent {}

const webhook = async (event: {
  body: string;
  headers: { [X: string]: string | Buffer | string[] };
}) => {
  const sig = (event.headers["Stripe-Signature"] ??
    event.headers["Stripe-Signature"]) as string;

  const body_in = JSON.parse(event.body);

  const token_in = await getTokenById(body_in.data.object.metadata.token_id);

  if (!token_in) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This token does not exist",
      })
    );
  }

  const team: Team = await getTeamData(token_in.team_id!);
  const stripeConfig: StripeConfig = await getTeamConfig(
    token_in.team_id!,
    "stripe"
  );

  const collection_in: Collection | undefined = await getCollectionById(
    token_in.collection_id!
  );

  const stripe: Stripe = new Stripe(stripeConfig.secretKey!, {
    apiVersion: "2022-11-15",
  });

  const webhookEndpoint: Stripe.WebhookEndpoint = stripeConfig.webhook!;

  try {
    const stripeEvent: Stripe.Event = stripe.webhooks.constructEvent(
      event.body,
      sig!,
      webhookEndpoint.secret!
    );
    const eventType = stripeEvent.type ? stripeEvent.type : "";
    // https://stripe.com/docs/api#event_object

    switch (eventType) {
      case "charge.succeeded":
        const tokenOrder: TokenOrder = {
          id: uuid(),
          wallet: body_in.data.object.metadata.buyer_wallet,
          date: new Date().getTime(),
          type: TokenOrderType.Stripe,
          status: TokenOrderStatus.Purchased,
          amount: body_in.data.object.amount / 100,
          quantity: Number(body_in.data.object.metadata.token_quantity),
          unit_price: Number(body_in.data.object.metadata.unit_price),
          collection_id: token_in.collection_id,
          token_id: token_in.id,
          currency: "USD",
          stripe_event: stripeEvent,
          email: body_in.data.object.billing_details.email,
          receipt_url: body_in.data.object.receipt_url,
        };
        await createTokenOrder(tokenOrder);

        const adminUsers = (await getUsersByTeam(team.id)).filter(
          (u) => u.role === UserRole.ADMIN
        );

        for (var i = 0, len = adminUsers.length; i < len; i++) {
          const adminUser = await getUser(adminUsers[i].member_id);
          console.log(
            "Sending email to admin user: ",
            adminUsers[i].member_id,
            adminUser.email
          );
          await sendStripeEmail({
            receiverEmail: adminUser.email,
            tevplateId: SENDGRID_OWNER_TOKEN_PURCHASED_BY_STRIPE,
            tevplateData: {
              collection_name: token_in.collection_name,
              token_name: token_in.name,
              recipient_address: body_in.data.object.metadata.buyer_wallet,
              purchase_date: new Date().toDateString(),
              payment_amount: `${body_in.data.object.amount / 100} USD`,
              stripe_receipt_id: body_in.data.object.receipt_url,
            },
          });
        }
        break;
      case "charge.failed":
      case "checkout.session.expired":
        const newCheckoutConditions = collection_in?.checkoutConditions!;
        newCheckoutConditions.stripeReserve =
          collection_in?.checkoutConditions!.stripeReserve +
          body_in.data.object.unit_amount;
        const upd_collection: Collection = {
          id: collection_in?.id,
          checkoutConditions: newCheckoutConditions,
        };
        await updateCollection(upd_collection);
      default:
        console.log(
          "Unhandled Stripe event type received:",
          stripeEvent.data.object
        );
        break;
    }
  } catch (err) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: `Unknown origin signature fails: ${err}`,
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      received: true,
    }),
  };
};

//export const handler:any = middlewares(webhook);
export const handler = webhook;
