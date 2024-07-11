import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import {
  getCollectionById,
  getCascadeBranding,
} from "../../Collections/utils/Collections";
import { Collection } from "../../Collections/utils/Collections.types";
import { getPublicFixedURL, getSigned } from "../../Storage/utils/Storage";
import { getTeamOfUser } from "../../Users/utils/Users";
import { getTokensByCollection, getTokensByTeam } from "../utils/Tokens";
import { Token } from "../utils/Tokens.types";

interface Request extends APIGatewayProxyEvent {}

const getListTokens = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);
  const queries = event.pathParameters;

  let tokens: Token[];
  let collection: Collection | undefined = {};
  if (queries && queries.id) {
    const collection_id = queries?.id;
    collection = await getCollectionById(collection_id);

    if (!collection || collection.team_id !== team.teamId) {
      return apiResponse(
        400,
        JSON.stringify({
          error: "This collection is not managed by your team",
        })
      );
    }

    tokens = await getTokensByCollection(collection.id as unknown as string);
  } else {
    tokens = await getTokensByTeam(team.teamId);
  }

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].image !== "") {
      //tokens[i].image = await getSigned(tokens[i].image as string);
      tokens[i].image = await getPublicFixedURL(tokens[i].image as string);
    }
    if (tokens[i].animation_url !== "") {
      //tokens[i].image = await getSigned(tokens[i].image as string);
      tokens[i].animation_url = await getPublicFixedURL(
        tokens[i].animation_url as string
      );
    }
  }
  if (collection.avatar !== "") {
    collection.avatar = await getSigned(collection.avatar as unknown as string);
  }

  if (collection.checkoutConditions) {
    if (
      collection.checkoutConditions?.tokenPreviewImage &&
      collection.checkoutConditions?.tokenPreviewImage !== ""
    ) {
      collection.checkoutConditions.tokenPreviewImage = await getPublicFixedURL(
        collection.checkoutConditions.tokenPreviewImage as unknown as string
      );
    }
    if (
      collection.checkoutConditions?.branding?.logo &&
      collection.checkoutConditions?.branding?.logo !== ""
    ) {
      collection.checkoutConditions.branding.logo = await getPublicFixedURL(
        collection.checkoutConditions.branding.logo as unknown as string
      );
    }
  }

  const branding = await getCascadeBranding(collection.id as unknown as string);
  tokens.sort((a, b) => {
    const aCreatedAt = a.created_at ?? 0;
    const bCreatedAt = b.created_at ?? 0;
    return bCreatedAt - aCreatedAt;
  });

  if (queries && queries.id) {
    return apiResponse(
      200,
      JSON.stringify({
        tokens: tokens,
        collection: collection,
        branding: branding,
      })
    );
  } else {
    return apiResponse(
      200,
      JSON.stringify({
        tokens: tokens,
      })
    );
  }
};

export const handler: any = middlewares(getListTokens);
