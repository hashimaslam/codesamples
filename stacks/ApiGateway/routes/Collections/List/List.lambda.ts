import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getPublicFixedURL, getSigned } from "../../Storage/utils/Storage";
import { getTeamOfUser } from "../../Users/utils/Users";
import { getCollectionsByTeam } from "../utils/Collections";
import { getTokensByCollection } from "../../Tokens/utils/Tokens";
import { getTotalClaimedSupply } from "../../../../../shared/utils/Web3";

interface Request extends Omit<APIGatewayProxyEvent, "requestContext"> {
  requestContext: {
    authorizer: {
      claims: {
        sub: string;
      };
    };
  };
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer.claims.sub;

  const team = await getTeamOfUser(userId);
  const collections0 = await getCollectionsByTeam(team.teamId);

  const collections = await Promise.all(
    collections0.map(async (collection) => {
      if (collection.avatar !== "") {
        collection.avatar = await getSigned(collection.avatar as string);
      }
      if (
        collection.checkoutConditions?.branding?.logo &&
        collection.checkoutConditions?.branding?.logo !== ""
      ) {
        collection.checkoutConditions.branding.logo = await getPublicFixedURL(
          collection.checkoutConditions.branding.logo as unknown as string
        );
      }
      return collection;
    })
  );

  collections.sort((a, b) => {
    const aCreatedAt = a.created_at ?? 0;
    const bCreatedAt = b.created_at ?? 0;
    return bCreatedAt - aCreatedAt;
  });

  let totalNfts = 0;
  let totalClaimed = 0;

  await Promise.all(
    collections.map(async (col) => {
      if (col.contract_type && col.contract_type === "nft-collection") {
        const tokens = await getTokensByCollection(col.id!);
        totalNfts += tokens.length;
      } else if (
        col.contract_type &&
        col.contract_type === "nft-drop" &&
        col.totalSupply
      ) {
        totalNfts += Number(col.totalSupply);
        if (col.address && col.address.length > 0) {
          const stripeTotalReserve =
            Number(col.totalSupply) -
            Number(col.checkoutConditions?.cryptoSupply);
          const stripeClaimed =
            stripeTotalReserve - Number(col.checkoutConditions?.stripeReserve);
          const cryptoClaimed =
            (await getTotalClaimedSupply(
              col.chain_id!,
              team.teamId,
              col.address!
            )) - stripeTotalReserve;

          totalClaimed += stripeClaimed + cryptoClaimed;
        }
      }
    })
  );

  return apiResponse(
    200,
    JSON.stringify({
      collections,
      totalCount: collections.length,
      totalNfts,
      totalClaimed,
    })
  );
};

export const handler: any = middlewares(ivplementation);
