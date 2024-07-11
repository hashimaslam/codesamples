import {
  getWalletClaimStatus,
  getWalletClaimerProofs,
} from "../../../../../shared/utils/Web3";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getCollectionById } from "../../Collections/utils/Collections";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import {
  getAllowListById,
  getAllowListItemsByAllowListId,
} from "../utils/AllowLists";
import { AllowListItem, AllowListItemStatus } from "../utils/AllowLists.types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Collection } from "../../Collections/utils/Collections.types";

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

  const allowListItems = await getAllowListItemsByAllowListId(id);
  const allowList = await getAllowListById(id);
  const reconciledAllowlistItems: AllowListItem[] = [];

  if (allowList?.collection_id) {
    const collection: Collection | undefined = await getCollectionById(
      allowList.collection_id
    );
    if (collection && collection.address) {
      await Promise.all(
        allowListItems.map(async (row: AllowListItem) => {
          const claimerProofs = await getWalletClaimerProofs(
            row["address"],
            Number(collection.chain_id),
            team.teamId,
            collection.address as unknown as string
          );
          const tokensOwned = await getWalletClaimStatus(
            row["address"],
            Number(collection.chain_id),
            team.teamId,
            collection.address as unknown as string
          );
          if (claimerProofs === null) {
            console.error(`Get Allowlist error claimerProofs is null`);
          } else if (claimerProofs.error) {
            console.error(
              `Get Allowlist error claimerProofs: ${claimerProofs.error}`
            );
          } else if (tokensOwned.error) {
            console.error(
              `Get Allowlist error tokensOwned: ${tokensOwned.error}`
            );
          } else {
            const allowListItem: AllowListItem = {
              address: row["address"],
              currency: row["currency"],
              max_claimable: claimerProofs.maxClaimable,
              email: row["email"],
              price: claimerProofs.price,
              status:
                tokensOwned.length > 0
                  ? AllowListItemStatus.CLAIMED
                  : AllowListItemStatus.NOT_CLAIMED,
              tokens_owned: tokensOwned.length,
            };
            reconciledAllowlistItems.push(allowListItem);
          }
        })
      );
    }
  }

  return apiResponse(
    200,
    JSON.stringify(
      reconciledAllowlistItems.length > 0
        ? {
            ...allowList,
            items: reconciledAllowlistItems,
          }
        : {
            ...allowList,
            items: allowListItems,
          }
    )
  );
};

export const handler: any = middlewares(ivplementation);
