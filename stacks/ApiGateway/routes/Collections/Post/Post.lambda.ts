import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { createCollection, metadataRegExp } from "../utils/Collections";
import { v4 as uuid } from "uuid";
import { isAddress } from "ethers/lib/utils";
import { Collection, CollectionMetadata } from "../utils/Collections.types";
import { storePrivateFile } from "../../Storage/utils/Storage";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import { isValidChainId } from "../../../../../shared/utils/Web3";
import { Time } from "../../../../../shared/utils/DateTime";
import { getTevplateById } from "../../Tevplates/utils/Tevplates";
import { Tevplate } from "../../Tevplates/utils/Tevplates.types";

interface Request
  extends Omit<APIGatewayProxyEvent, "requestContext" | "body"> {
  requestContext: {
    authorizer: {
      claims: {
        sub: string;
      };
    };
  };
  body: Collection;
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer.claims.sub;
  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot create collections",
      })
    );
  }

  const coll_in = event.body; //walletaddress

  if (!coll_in.chain_id || !isValidChainId(Number(coll_in.chain_id))) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Invalid 'chain_id' provided" })
    );
  }

  if (
    !coll_in.contract_type ||
    (coll_in.contract_type !== "nft-drop" &&
      coll_in.contract_type !== "nft-collection")
  ) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Invalid contract type provided" })
    );
  }

  if (!coll_in.name || coll_in.name?.trim() === "") {
    return apiResponse(
      400,
      JSON.stringify({ error: "Collection name is mandatory" })
    );
  }

  if (!coll_in.metadata?.name || coll_in.metadata?.name?.trim() === "") {
    return apiResponse(
      400,
      JSON.stringify({ error: "Contract name is mandatory" })
    );
  } else if (!metadataRegExp.test(coll_in.metadata?.name)) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "Contract name should not contain blank spaces neither special chars ",
      })
    );
  }

  if (!coll_in.metadata?.symbol || coll_in.metadata?.symbol?.trim() === "") {
    return apiResponse(
      400,
      JSON.stringify({ error: "Collection symbol is mandatory" })
    );
  } else if (!metadataRegExp.test(coll_in.metadata?.symbol)) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "Contract symbol should not contain blank spaces neither special chars ",
      })
    );
  }

  if (coll_in.royalties_receiver && !isAddress(coll_in.royalties_receiver)) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Invalid royalties receiver address provided" })
    );
  }

  if (
    !coll_in.primary_sale_recipient ||
    !isAddress(coll_in.primary_sale_recipient)
  ) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "Primary sale recipient is mandatory and should be a valid address",
      })
    );
  }

  //check for tevplate id

  if (!coll_in.tevplate_id) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "Tevplate id is mandatory",
      })
    );
  }
  const tevplate: Tevplate = await getTevplateById(coll_in.tevplate_id);
  // check if the tevplate id passed is valid
  if (tevplate?.team_id != team.teamId) {
    return {
      statusCode: 400,
      body: { error: "Tevplate not found" },
    };
  }

  let new_collection: Collection = {};

  if (coll_in.royalties && coll_in.royalties_receiver) {
    new_collection = coll_in.royalties
      ? { ...new_collection, royalties: coll_in.royalties }
      : new_collection;
    new_collection = coll_in.royalties_receiver
      ? { ...new_collection, royalties_receiver: coll_in.royalties_receiver }
      : new_collection;
  }

  const new_collection_id = uuid();

  if (
    coll_in.contract_type === "nft-drop" ||
    coll_in.contract_type === "nft-collection"
  ) {
    let metadata: CollectionMetadata = {};
    metadata = coll_in.metadata;
    metadata = {
      ...metadata,
      baseURI: `https://${event.headers.Host}/prod/tokens/metadata/${new_collection_id}/`,
    };
    //metadata = (coll_in.tokenURI) ? { ... metadata, "tokenURI": coll_in.tokenURI } : metadata;
    new_collection = { ...new_collection, metadata: metadata };
  }

  new_collection = {
    ...new_collection,
    id: new_collection_id,
    chain_id: Number(coll_in.chain_id),
    team_id: team.teamId,
    user_id: userId,
    contract_type: coll_in.contract_type,
    owner: coll_in.owner,
    deploy_date: 0,
    tags: coll_in.tags ? coll_in.tags : [],
    tevplate_id: coll_in.tevplate_id,
    tevplate_name: tevplate?.name,
    ...(coll_in.primary_sale_recipient && {
      primary_sale_recipient: coll_in.primary_sale_recipient,
    }),
    ...(coll_in.platform_fee_recipient && {
      platform_fee_recipient: coll_in.platform_fee_recipient,
    }),
    ...(coll_in.platform_fee_bps && {
      platform_fee_bps: coll_in.platform_fee_bps,
    }),
    ...(coll_in.tags && { tags: coll_in.tags }),
    ...(coll_in.name && { name: coll_in.name }),
  };
  new_collection = {
    ...new_collection,
    description: coll_in.description ? coll_in.description : "",
  };
  new_collection = {
    ...new_collection,
    externalURL: coll_in.externalURL ? coll_in.externalURL : "",
  };
  let avatar_src = coll_in.avatar ? coll_in.avatar : "";

  if (coll_in.avatar) {
    const sourcePath = avatar_src;
    const [extension] = sourcePath.split(".").slice(-1);
    const targetPath = `collections_images/${userId}/${uuid()}.${extension}`;
    await storePrivateFile(sourcePath, targetPath), (avatar_src = targetPath);
  }

  new_collection = {
    ...new_collection,
    avatar: avatar_src,
    created_at: Time.now(),
  };

  const collection = await createCollection(new_collection);

  return apiResponse(200, JSON.stringify({ id: collection.id }));
};

export const handler: any = middlewares(ivplementation);
