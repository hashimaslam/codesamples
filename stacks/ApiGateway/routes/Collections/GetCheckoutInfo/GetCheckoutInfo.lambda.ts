import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import {
  getCollectionById,
  getCascadeBranding,
} from "../../Collections/utils/Collections";
import {
  CheckoutConditions,
  Collection,
} from "../../Collections/utils/Collections.types";
import { getPublicFixedURL } from "../../Storage/utils/Storage";
import { getTokensByCollection } from "../../Tokens/utils/Tokens";
import { Token } from "../../Tokens/utils/Tokens.types";
import { getPriceInUSDC } from "../../../../../shared/utils/PriceProvider/PriceProvider";
import { isAddress } from "ethers/lib/utils";
import {
  getAllowListById,
  getAllowListItemsByAllowListId,
} from "../../AllowLists/utils/AllowLists";
import { AllowListItem } from "../../AllowLists/utils/AllowLists.types";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
import { StripeConfig, getTeamConfig } from "../../Tenants/utils/Tenants";

interface Request extends APIGatewayProxyEvent {}

const getCheckoutInfo = async (event: Request) => {
  const queries = event.pathParameters;
  const address = event.queryStringParameters?.address;

  if (!queries || !queries.id) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "Missing collection id",
      })
    );
  }
  if (address && !isAddress(address)) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "Address provided is not a valid address",
      })
    );
  }

  const collection_id = queries.id;
  const collection: Collection | undefined = await getCollectionById(
    collection_id
  );

  if (!collection || !collection.checkoutConditions) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This collection does not exist or has not checkout conditions",
      })
    );
  }

  const symbol = collection.checkoutConditions?.currency_symbol
    ? collection.checkoutConditions?.currency_symbol
    : defaultChains.find((c: Chain) => c.chainId === collection.chain_id)
        ?.nativeCurrency.symbol;

  const tokens: Token[] = await getTokensByCollection(collection_id);
  let priceInUSD = undefined;

  if (collection.checkoutConditions?.allowListId && address) {
    const allow_list = await getAllowListById(
      collection.checkoutConditions.allowListId
    );
    const allow_list_items = await getAllowListItemsByAllowListId(
      collection.checkoutConditions.allowListId
    );
    const item = allow_list_items.find(
      (a: AllowListItem) => a.address === address
    );
    if (item) {
      const pair = item.currency?.symbol;
      priceInUSD = await getPriceInUSDC(
        Number(collection.chain_id),
        collection.team_id!,
        pair
      );
      const overrided_co: CheckoutConditions = {
        isEnabled: collection.checkoutConditions.isEnabled,
        isStripeEnabled: false, //For wallets address present in allowlist by default we are disabling stripe checkout as discussed earlier (Temp solution), As they have a specific maxClaimable limit on crypto
        isAllowListItem: true,
        cryptoSupply: Number(item.max_claimable),
        currency: item.currency?.address,
        currency_symbol: item.currency?.symbol,
        pricePerToken: item.price,
        stripeReserve: collection.checkoutConditions.stripeReserve,
        branding: await getCascadeBranding(
          collection.id as unknown as string,
          address
        ),
        allowListNotes: allow_list?.notes,
      };
      collection.checkoutConditions = overrided_co;
    } else {
      if (
        collection.checkoutConditions.branding?.logo &&
        collection.checkoutConditions.branding?.logo !== ""
      ) {
        collection.checkoutConditions.branding.logo = await getPublicFixedURL(
          collection.checkoutConditions.branding.logo as unknown as string
        );
      }
    }
  } else {
    collection.checkoutConditions.branding = await getCascadeBranding(
      collection.id as unknown as string
    );
  }
  if (
    collection.checkoutConditions?.tokenPreviewImage &&
    collection.checkoutConditions?.tokenPreviewImage !== ""
  ) {
    collection.checkoutConditions.tokenPreviewImage = await getPublicFixedURL(
      collection.checkoutConditions.tokenPreviewImage as unknown as string
    );
  }

  const stripeConfig: StripeConfig = await getTeamConfig(
    collection.team_id!,
    "stripe"
  );

  if (
    !stripeConfig ||
    !stripeConfig.publishableKey ||
    !stripeConfig.secretKey ||
    stripeConfig.publishableKey === "" ||
    stripeConfig.secretKey === ""
  ) {
    collection.checkoutConditions.isStripeEnabled = false;
  }

  if (priceInUSD === undefined) {
    priceInUSD = await getPriceInUSDC(
      Number(collection.chain_id),
      collection.team_id!
    );
  }

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].image !== "") {
      tokens[i].image = await getPublicFixedURL(tokens[i].image as string);
    }
    if (tokens[i].animation_url !== "") {
      tokens[i].animation_url = await getPublicFixedURL(
        tokens[i].animation_url as string
      );
    }
    delete tokens[i].team_id;
    delete tokens[i].minted_date;
    delete tokens[i].collection_id;
    delete tokens[i].chain_id;
    delete tokens[i].mint_tx;
    delete tokens[i].endTokenID;
    if (
      collection.checkoutConditions?.tokenPreviewImage &&
      collection.checkoutConditions?.tokenPreviewImage !== ""
    ) {
      //Hide original image for unrevealed reasons
      delete tokens[i].image;
    }
  }

  //Hide not needed info for security reasons
  delete collection.avatar;
  delete collection.metadata;
  delete collection.primary_sale_recipient;
  delete collection.team_id;
  delete collection.deploy_date;
  delete collection.contract_type;
  delete collection.owner;
  delete collection.tags;

  return apiResponse(
    200,
    JSON.stringify({
      tokens: tokens,
      collection: collection,
      priceFeed: {
        symbol: symbol,
        priceInUSD: priceInUSD,
      },
    })
  );
};

export const handler: any = middlewares(getCheckoutInfo);
