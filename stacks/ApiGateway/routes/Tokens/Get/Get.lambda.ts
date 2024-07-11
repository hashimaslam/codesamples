import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getTokenById } from "../utils/Tokens";
import { getPublicFixedURL, getSigned } from "../../Storage/utils/Storage";
import { Token } from "../utils/Tokens.types";
import { Collection } from "../../Collections/utils/Collections.types";
import { getCollectionById } from "../../Collections/utils/Collections";
import { getTeamOfUser } from "../../Users/utils/Users";

interface Request extends APIGatewayProxyEvent {}

const getToken = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);
  const queries = event.pathParameters;
  const token_id = queries?.id;

  if (!token_id) {
    return apiResponse(400, JSON.stringify({ error: "Missing token id" }));
  }

  const token: Token | undefined = await getTokenById(token_id);

  if (!token || token.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "This token does not exist or does not belong to a collection managed by your team.",
      })
    );
  }

  const collection: Collection | undefined = await getCollectionById(
    token.collection_id as unknown as string
  );
  if (!collection || collection.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "This token does not exist or does not belong to a collection managed by your team",
      })
    );
  }

  if (token.image !== "") {
    //token.image = await getSigned(token.image as unknown as string);
    token.image = await getPublicFixedURL(token.image!);
  }
  if (token.animation_url !== "") {
    //token.image = await getSigned(token.image as unknown as string);
    token.animation_url = await getPublicFixedURL(token.animation_url!);
  }

  if (
    collection.checkoutConditions?.branding &&
    collection.checkoutConditions?.branding?.logo &&
    collection.checkoutConditions?.branding?.logo !== ""
  ) {
    collection.checkoutConditions.branding.logo = await getPublicFixedURL(
      collection.checkoutConditions.branding.logo as unknown as string
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

  return apiResponse(200, JSON.stringify({ token, collection }));
};

export const handler: any = middlewares(getToken);
