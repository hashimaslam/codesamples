import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { v4 as uuid } from "uuid";
import { Airdrop } from "../utils/Airdrop.types";

import {
  storePrivateFile,
  deletePrivateFile,
  storePublicFile,
  deletePublicFile,
} from "../../Storage/utils/Storage";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";

import { Token } from "../../Tokens/utils/Tokens.types";
import { getTokensByCollection, updateToken } from "../../Tokens/utils/Tokens";
import { isUUID } from "../../../../../shared/utils/Common";
import {
  updateAllowList,
  getAllowListById,
} from "../../AllowLists/utils/AllowLists";
import { AllowListStatus } from "../../AllowLists/utils/AllowLists.types";
import { getTevplateById } from "../../Tevplates/utils/Tevplates";
import { getAirdropById, updateAirdropField } from "../utils/Airdrops";
import { Tevplate } from "../../Tevplates/utils/Tevplates.types";
import { Collection } from "../../Collections/utils/Collections.types";
import { getCollectionById } from "../../Collections/utils/Collections";

interface Request
  extends Omit<APIGatewayProxyEvent, "requestContext" | "body"> {
  requestContext: {
    authorizer: {
      claims: {
        sub: string;
      };
    };
  };
  body: Airdrop;
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer.claims.sub;
  const queries = event.pathParameters;
  const airdrop_id = queries?.id;
  const collection_id = queries?.collection_id as string;

  if (!airdrop_id || !isUUID(airdrop_id)) {
    return apiResponse(400, JSON.stringify({ error: "Missing airdrop id" }));
  }
  if (!collection_id || !isUUID(collection_id)) {
    return apiResponse(400, JSON.stringify({ error: "Missing collection id" }));
  }

  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you are not an admin/editor. You cannot update airdrop",
      })
    );
  }

  const airdropReceived = JSON.parse(
    JSON.stringify(event.body) ?? "{}"
  ) as Airdrop;
  const airdropCurrent: Airdrop | undefined = await getAirdropById(airdrop_id);
  const collectionCurrent: Collection | undefined = await getCollectionById(
    collection_id
  );
  //Check if the airdrop user trying to delete is belongs to his team by checkig through collection

  if (!collectionCurrent || collectionCurrent.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "This collection does not exist or it is not managed by your team",
      })
    );
  }

  let upd_airdrop = airdropReceived;

  //Collection ID cannot be changed
  delete upd_airdrop.collection_id;

  const updatedFields: string[] = [];
  const isTxHashPresent = Boolean(
    airdropCurrent?.txHash && airdropCurrent?.txHash?.length > 0
  );
  upd_airdrop.id = airdropCurrent?.id;
  if (upd_airdrop.name) {
    await updateAirdropField(airdrop_id, "name", upd_airdrop.name);
    updatedFields.push("name");
  }
  if (
    upd_airdrop.txHash &&
    !isTxHashPresent &&
    Boolean(upd_airdrop.txHash.length > 0)
  ) {
    await updateAirdropField(airdrop_id, "txHash", upd_airdrop.txHash);
    updatedFields.push("txHash");
  }
  //Can only update totalMembers if txHash is not present (airdop not executed case)
  if (
    !isTxHashPresent &&
    upd_airdrop.totalMembers &&
    upd_airdrop.totalMembers > 0
  ) {
    await updateAirdropField(
      airdrop_id,
      "totalMembers",
      upd_airdrop.totalMembers
    );
    updatedFields.push("totalMembers");
  }

  return apiResponse(200, JSON.stringify({ updated_fields: updatedFields }));
};

export const handler: any = middlewares(ivplementation);
