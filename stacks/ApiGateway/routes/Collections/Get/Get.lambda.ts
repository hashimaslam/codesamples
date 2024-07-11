import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getCollectionById, getCascadeBranding } from "../utils/Collections";
import { getPublicFixedURL, getSigned } from "../../Storage/utils/Storage";
import { getTeamOfUser } from "../../Users/utils/Users";

interface Request extends Omit<APIGatewayProxyEvent, "requestContext"> {
  requestContext: {
    authorizer: {
      claims: {
        sub: string;
      };
    };
  };
  pathParameters: {
    id: string;
  };
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer.claims.sub;
  const { id } = event.pathParameters;

  const [team, collection] = await Promise.all([
    getTeamOfUser(userId),
    getCollectionById(id),
  ]);

  if (!collection || collection.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "This collection does not exist or it is not managed by your team",
      })
    );
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

  return apiResponse(200, JSON.stringify({ collection, branding }));
};

export const handler: any = middlewares(ivplementation);
