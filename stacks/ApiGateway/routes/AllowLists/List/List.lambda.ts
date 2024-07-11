import { getMaxTotalSupply } from "../../../../../shared/utils/Web3";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getCollectionById } from "../../Collections/utils/Collections";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import { getAllowListsByTeam } from "../utils/AllowLists";
import { AllowList, AllowListStatus } from "../utils/AllowLists.types";
import { Collection } from "../../Collections/utils/Collections.types";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { getPublicFixedURL } from "../../Storage/utils/Storage";

interface Request extends APIGatewayProxyEvent {}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const chain_id = event.queryStringParameters?.chain_id;
  const status = event.queryStringParameters?.status;

  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot create allow lists",
      })
    );
  }

  let allowlists = await getAllowListsByTeam(team.teamId);

  if (!!chain_id) {
    allowlists = allowlists.filter((l) => l.chain_id === Number(chain_id));
  }
  if (!!status) {
    allowlists = allowlists.filter(
      (l) => l.status === (status as AllowListStatus)
    );
  }
  allowlists.sort((a, b) => {
    const aAt = a.start_date ?? 0;
    const bAt = b.start_date ?? 0;
    return bAt - aAt;
  });

  await Promise.all(
    allowlists.map(async (row: AllowList) => {
      if (row.collection_id && row.collection_id.trim() !== "") {
        const collection: Collection | undefined = await getCollectionById(
          row.collection_id
        );
        if (collection && collection.address) {
          const maxTotalSupply = await getMaxTotalSupply(
            collection.address,
            Number(collection.chain_id),
            team.teamId
          );
          if (maxTotalSupply.error) {
            console.error("List Allowlists error:", maxTotalSupply.error);
          } else {
            row.supply = maxTotalSupply.value;
          }
          row.collection_name = collection.name;
        }
      }
      if (row.branding && row.branding.logo) {
        row.branding.logo = await getPublicFixedURL(
          row.branding.logo as unknown as string
        );
      }
    })
  );

  return apiResponse(200, JSON.stringify(allowlists));
};

export const handler: any = middlewares(ivplementation);
