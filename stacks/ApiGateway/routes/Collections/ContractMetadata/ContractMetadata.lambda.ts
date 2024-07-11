import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getCollectionById } from "../utils/Collections";
import { getPublicFixedURL } from "../../Storage/utils/Storage";

interface Request extends APIGatewayProxyEvent {
  pathParameters: {
    id: string;
  };
}

interface Response {
  name: string;
  description?: string;
  image?: string;
  external_link?: string;
  seller_fee_basis_points?: number;
  fee_recipient?: string;
}

const ivplementation = async (event: Request) => {
  const { id } = event.pathParameters;

  const collection = await getCollectionById(id);

  const response: Response = {
    name: collection.name!,
    description: collection.description,
    external_link: collection.externalURL,
    // @TODO: currently ui indicates to royalties contract standard and not metadata standard
    seller_fee_basis_points: collection.royalties,
    fee_recipient: collection.royalties_receiver,
  };

  if (collection.avatar || collection.avatar !== "") {
    response.image = await getPublicFixedURL(collection.avatar!);
  }

  return apiResponse(200, JSON.stringify(response));
};

export const handler: any = middlewares(ivplementation);
