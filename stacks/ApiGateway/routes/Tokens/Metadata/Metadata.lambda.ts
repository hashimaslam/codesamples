import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import {
  generateMetadata,
  getTokenById,
  getTokenBySmartContractTokenId,
} from "../utils/Tokens";
import { getPublicFixedURL } from "../../Storage/utils/Storage";
import { Token } from "../utils/Tokens.types";
import { Collection } from "../../Collections/utils/Collections.types";
import { getCollectionById } from "../../Collections/utils/Collections";
import { SupportedContractTypes } from "../../../../../shared/utils/Constants";

interface Request extends APIGatewayProxyEvent {}

const getTokenMetadata = async (event: Request) => {
  const queries = event.pathParameters;
  const collection_id = queries?.collection_id;
  const token_id = queries?.token_id; //tokenID from the smart contract or internal uuid id

  if (!collection_id) {
    return apiResponse(400, JSON.stringify({ error: "Missing collection id" }));
  }

  if (!token_id) {
    return apiResponse(400, JSON.stringify({ error: "Missing token id" }));
  }

  const collection: Collection | undefined = await getCollectionById(
    collection_id
  );
  if (!collection) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This collection does not exists",
      })
    );
  }

  let token: Token | undefined;
  if (isNaN(Number(token_id))) {
    //UUID format
    token = await getTokenById(token_id);
  } else {
    //Smart Contract tokenID format
    token = await getTokenBySmartContractTokenId(
      collection_id,
      collection.contract_type !== "nft-drop" ? Number(token_id) : undefined
    );
  }

  if (!token) {
    return apiResponse(
      400,
      JSON.stringify({ error: "This token does not exist or is not minted" })
    );
  }

  //console.warn("METADATA REQUEST: [IP: ", event.headers["X-Forwarded-For"], "] [Collection:", collection.name , "  ", collection_id, "] [Token: ", token?.name, "  ", token_id, "]");

  let output_image;

  if (token.image !== "") {
    //output_image = await getSigned(token.image as unknown as string);
    output_image = await getPublicFixedURL(token.image!);
  } else {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This collection has not image",
      })
    );
  }

  if (token.animation_url !== "") {
    //output_image = await getSigned(token.image as unknown as string);
    token.animation_url = await getPublicFixedURL(token.animation_url!);
  }

  const metadata = generateMetadata(
    token,
    output_image,
    collection.contract_type as unknown as SupportedContractTypes
  );

  return apiResponse(200, JSON.stringify(metadata));
};

export const handler: any = middlewares(getTokenMetadata);
