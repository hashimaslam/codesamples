import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../../shared/utils/middlewares";
import { getPublicFixedURL } from "../../../Storage/utils/Storage";
import { getTokenById } from "../../utils/Tokens";
import { ceilFormat, isUUID } from "../../../../../../shared/utils/Common";
import Stripe from "stripe";
import { isAddress } from "ethers/lib/utils";
import {
  getCollectionById,
  updateCollection,
} from "../../../Collections/utils/Collections";
import { Collection } from "../../../Collections/utils/Collections.types";
import { getTokenPrice } from "../../../../../../shared/utils/Web3";
import { getPriceInUSDC } from "../../../../../../shared/utils/PriceProvider/PriceProvider";
import { MINIMUN_USD_STRIPE_CHARGE } from "../../../../../../shared/utils/Constants";
import {
  StripeConfig,
  getTeamConfig,
  storeTeamConfig,
} from "../../../Tenants/utils/Tenants";

interface Request extends APIGatewayProxyEvent {}

const buyToken = async (event: Request) => {
  const queries = event.pathParameters;
  const token_id = queries?.id;

  const buyer = JSON.parse(JSON.stringify(event.body) ?? "{}") as {
    wallet: string;
    amount: number;
    callbackdomain: string;
  };

  if (!token_id || !isUUID(token_id)) {
    return apiResponse(400, JSON.stringify({ error: "Missing token id" }));
  }

  if (!buyer.wallet || !isAddress(buyer.wallet)) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Invalid wallet address provided" })
    );
  }

  if (!buyer.amount || buyer.amount < 1) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "You must specify the amount of tokens to purchase",
      })
    );
  }

  const token_in = await getTokenById(token_id);
  if (!token_in) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This token does not exist",
      })
    );
  }

  const collection_in: Collection | undefined = await getCollectionById(
    token_in.collection_id!
  );
  if (!collection_in) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This token does not belong to any collection",
      })
    );
  }
  if (!collection_in.address) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This collection is still not deployed to network",
      })
    );
  }
  if (
    !collection_in.checkoutConditions ||
    !collection_in.checkoutConditions.stripeReserve ||
    collection_in.checkoutConditions.stripeReserve < buyer.amount
  ) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "This collection has not Stripe reserve assigned or requested amount is higher than available to buy by Stripe",
      })
    );
  }

  const stripeConfig: StripeConfig = await getTeamConfig(
    token_in.team_id!,
    "stripe"
  );

  if (
    !stripeConfig ||
    !stripeConfig.publishableKey ||
    !stripeConfig.secretKey ||
    stripeConfig.publishableKey === "" ||
    stripeConfig.secretKey === ""
  ) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "There is not Stripe as payment method configured, talk with the collection owner.",
      })
    );
  }

  const stripe: Stripe = new Stripe(stripeConfig.secretKey, {
    apiVersion: "2022-11-15",
  });

  //Check if Stripe webhook exists and it is pointing to the current AWS domain, and delete/create properly
  if (
    stripeConfig.webhook &&
    !stripeConfig.webhook.url.startsWith(`https://${event.headers.Host}`)
  ) {
    // https://stripe.com/docs/api/webhook_endpoints/delete
    await stripe.webhookEndpoints.del(stripeConfig.webhook.id!);
    delete stripeConfig.webhook;
  }

  //Check if webhook exists https://stripe.com/docs/api/webhook_endpoints/retrieve
  if (!stripeConfig.webhook || stripeConfig.webhook.url === "") {
    // https://stripe.com/docs/api/webhook_endpoints/create
    stripeConfig.webhook = await stripe.webhookEndpoints.create({
      url: `https://${event.headers.Host}/prod/buytokenwh`,
      enabled_events: [
        "charge.failed",
        "charge.succeeded",
        "checkout.session.expired",
      ],
    });
    console.log(stripeConfig.webhook, "from webhook");

    await storeTeamConfig(token_in.team_id!, "stripe", stripeConfig);
  }

  const [unit_price_eth, buy_token_symbol, error_getting_price] =
    await getTokenPrice(
      collection_in.address!,
      collection_in.chain_id!,
      collection_in.contract_type!,
      collection_in.team_id!
    );

  if (error_getting_price) {
    return apiResponse(
      400,
      JSON.stringify({
        error: error_getting_price,
      })
    );
  }

  const priceInUSD = await getPriceInUSDC(
    collection_in.chain_id!,
    collection_in.team_id!
  );

  if (priceInUSD === 0) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "Could not recover price from network",
      })
    );
  }

  const unit_price_usd = ceilFormat(Number(unit_price_eth * priceInUSD));
  const output_image = await getPublicFixedURL(token_in.image!);

  let product_data = {
    name: token_in.name as unknown as string,
    description: token_in?.description,
    images: [output_image],
  };

  if (!token_in.description || token_in.description === "")
    delete product_data.description;

  const final_charge = buyer.amount * unit_price_usd;
  if (final_charge < MINIMUN_USD_STRIPE_CHARGE) {
    return apiResponse(
      400,
      JSON.stringify({
        error: `Stripe charge is below ${MINIMUN_USD_STRIPE_CHARGE}$USD, you need to request more amount of tokens to allow Stripe payment`,
      })
    );
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: "USD",
        unit_amount: unit_price_usd * 100,
        product_data: product_data,
      },
      quantity: buyer.amount,
    },
  ];

  const baseUrl = event.headers.origin || `https://${event.headers.Host}`;

  try {
    const params: Stripe.Checkout.SessionCreateParams = {
      submit_type: "pay",
      expires_at: Math.floor(Date.now() / 1000 + 60 * 30),
      payment_method_types: ["card"],
      line_items,
      success_url: `${
        buyer.callbackdomain || baseUrl
      }/collections/checkout/success/${collection_in.id}`,
      cancel_url: `${buyer.callbackdomain || baseUrl}/collections/checkout/${
        collection_in.id
      }?failed=1`,
      mode: "payment",
      payment_intent_data: {
        metadata: {
          token_id: token_in.id as unknown as string,
          buyer_wallet: buyer.wallet,
          token_quantity: buyer.amount,
          unit_price: unit_price_eth,
        },
      },
    };

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(params);

    const newCheckoutConditions = collection_in.checkoutConditions;
    newCheckoutConditions.stripeReserve =
      collection_in.checkoutConditions.stripeReserve - buyer.amount;

    const upd_collection: Collection = {
      id: collection_in.id,
      checkoutConditions: newCheckoutConditions,
    };
    await updateCollection(upd_collection);

    return apiResponse(
      200,
      JSON.stringify({
        url: checkoutSession.url,
        session_id: checkoutSession.id,
        buyToken: buy_token_symbol,
        priceInUSD: priceInUSD,
      })
    );
  } catch (stripeErr) {
    return apiResponse(
      400,
      JSON.stringify({
        error: `Stripe error: ${stripeErr}`,
      })
    );
  }
};

export const handler: any = middlewares(buyToken);
