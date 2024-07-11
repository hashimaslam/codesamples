import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { v4 as uuid } from "uuid";
import { Collection, CollectionMetadata } from "../utils/Collections.types";
import {
  storePrivateFile,
  deletePrivateFile,
  storePublicFile,
  deletePublicFile,
} from "../../Storage/utils/Storage";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import {
  getCollectionById,
  updateCollection,
  metadataRegExp,
} from "../utils/Collections";
import { Token } from "../../Tokens/utils/Tokens.types";
import { getTokensByCollection, updateToken } from "../../Tokens/utils/Tokens";
import { isUUID } from "../../../../../shared/utils/Common";
import {
  updateAllowList,
  getAllowListById,
} from "../../AllowLists/utils/AllowLists";
import { AllowListStatus } from "../../AllowLists/utils/AllowLists.types";
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
  const queries = event.pathParameters;
  const collection_id = queries?.id;

  if (!collection_id || !isUUID(collection_id)) {
    return apiResponse(400, JSON.stringify({ error: "Missing collection id" }));
  }

  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot update collections",
      })
    );
  }

  const collectionReceived = JSON.parse(
    JSON.stringify(event.body) ?? "{}"
  ) as Collection;
  const collectionCurrent: Collection | undefined = await getCollectionById(
    collection_id
  );

  if (collectionCurrent?.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({ error: "This collection is not managed by your team" })
    );
  }

  let upd_collection = collectionReceived;

  if (collectionCurrent?.address && collectionCurrent?.address !== "") {
    //Remove fields can not be updated as collection is deployed
    delete upd_collection.chain_id;
    delete upd_collection.address;
    delete upd_collection.metadata;
    delete upd_collection.royalties;
    delete upd_collection.royalties_receiver;
    delete upd_collection.tevplate_id;
  } else {
    let metadata: CollectionMetadata = {};
    if (collectionReceived.metadata) {
      if (
        !collectionReceived.metadata?.name ||
        collectionReceived.metadata?.name?.trim() === ""
      ) {
        return apiResponse(
          400,
          JSON.stringify({
            error: "Contract name is mandatory and can not be an empty string",
          })
        );
      } else if (!metadataRegExp.test(collectionReceived.metadata?.name)) {
        return apiResponse(
          400,
          JSON.stringify({
            error:
              "Contract name should not contain blank spaces neither special chars",
          })
        );
      }
      if (
        !collectionReceived.metadata?.symbol ||
        collectionReceived.metadata?.symbol.trim() === ""
      ) {
        return apiResponse(
          400,
          JSON.stringify({
            error:
              "Contract symbol is mandatory and can not be an empty string",
          })
        );
      } else if (!metadataRegExp.test(collectionReceived.metadata?.symbol)) {
        return apiResponse(
          400,
          JSON.stringify({
            error:
              "Contract symbol should not contain blank spaces neither special chars",
          })
        );
      }
      metadata = collectionReceived.metadata;
      upd_collection = { ...upd_collection, metadata: metadata };
    }

    if (
      event.body.chain_id &&
      event.body.chain_id !== collectionCurrent.chain_id
    ) {
      const tokens: Token[] = await getTokensByCollection(collection_id);
      await Promise.all(
        tokens.map(async (token: Token) => {
          delete token.tokenID;
          token.chain_id = event.body.chain_id;
          await updateToken(token);
        })
      );
      upd_collection.chain_id = Number(collectionReceived.chain_id);
    }
  }

  if (
    event.body.checkoutConditions &&
    !!event.body.checkoutConditions.allowListId
  ) {
    const allowList = await getAllowListById(
      event.body.checkoutConditions.allowListId
    );

    if (
      !allowList ||
      allowList.team_id !== team.teamId ||
      (allowList.collection_id && allowList.collection_id !== collection_id)
    ) {
      return apiResponse(
        400,
        JSON.stringify({
          error:
            "This allowlist does not exist, is not managed by your team, or is assigned to another collection",
        })
      );
    }
    if (allowList.chain_id !== collectionCurrent.chain_id) {
      return apiResponse(
        400,
        JSON.stringify({
          error:
            "This allow list has configured a different network than collection has",
        })
      );
    }
    if (allowList.status !== AllowListStatus.READY) {
      return apiResponse(
        400,
        JSON.stringify({
          error: "This allow list is not ready to be used",
        })
      );
    }
    allowList.collection_id = collection_id;
    allowList.collection_name = collectionCurrent.name;
    await updateAllowList(allowList);
  }

  if (event.body.avatar && event.body.avatar !== "") {
    const sourcePath = event.body.avatar;
    const [extension] = sourcePath.split(".").slice(-1);
    const targetPath = `collections_images/${userId}/${uuid()}.${extension}`;
    await storePrivateFile(sourcePath, targetPath);
    upd_collection.avatar = targetPath;
  } else if (
    event.body.remove_image &&
    (!event.body.avatar || event.body.avatar === "") &&
    collectionCurrent.avatar &&
    collectionCurrent.avatar !== ""
  ) {
    const targetPath = collectionCurrent.avatar as unknown as string;
    await deletePrivateFile(targetPath);
    upd_collection.avatar = "";
  }

  if (event.body.checkoutConditions) {
    upd_collection.checkoutConditions = event.body.checkoutConditions;
    if (event.body.checkoutConditions.branding) {
      upd_collection.checkoutConditions.branding =
        event.body.checkoutConditions.branding;
      if (
        event.body.checkoutConditions.branding?.logo &&
        event.body.checkoutConditions.branding?.logo !== ""
      ) {
        if (event.body.checkoutConditions.branding?.logo !== "delete") {
          const sourcePath = event.body.checkoutConditions.branding.logo;
          const [extension] = sourcePath.split(".").slice(-1);
          const targetPath = `tokens_images/${collection_id}/branding_logo_${uuid()}.${extension}`;
          await storePublicFile(sourcePath, targetPath);
          upd_collection.checkoutConditions.branding.logo = targetPath;
        } else {
          const targetPath = collectionCurrent.checkoutConditions?.branding
            ?.logo as unknown as string;
          await deletePublicFile(targetPath);
          delete upd_collection.checkoutConditions.branding.logo;
        }
      } else if (collectionCurrent.checkoutConditions?.branding?.logo) {
        upd_collection.checkoutConditions.branding.logo =
          collectionCurrent.checkoutConditions?.branding.logo;
      }
      if (
        !upd_collection.checkoutConditions.branding.logo &&
        upd_collection.checkoutConditions.branding.primaryColor === "" &&
        upd_collection.checkoutConditions.branding.secondaryColor === "" &&
        upd_collection.checkoutConditions.branding.tertiaryColor === ""
      ) {
        delete upd_collection.checkoutConditions.branding;
      }
    }
    if (
      event.body.checkoutConditions.tokenPreviewImage &&
      event.body.checkoutConditions.tokenPreviewImage !== ""
    ) {
      upd_collection.checkoutConditions.tokenPreviewImage =
        event.body.checkoutConditions.tokenPreviewImage;
      if (event.body.checkoutConditions.tokenPreviewImage !== "delete") {
        const sourcePath = event.body.checkoutConditions.tokenPreviewImage;
        const [extension] = sourcePath.split(".").slice(-1);
        const targetPath = `tokens_images/${collection_id}/preview_${uuid()}.${extension}`;
        await storePublicFile(sourcePath, targetPath);
        upd_collection.checkoutConditions.tokenPreviewImage = targetPath;
      } else {
        const targetPath = upd_collection.checkoutConditions
          ?.tokenPreviewImage as unknown as string;
        await deletePublicFile(targetPath);
        delete upd_collection.checkoutConditions.tokenPreviewImage;
      }
    }
  }

  if (event.body.tevplate_id) {
    const tevplate: Tevplate = await getTevplateById(event.body.tevplate_id);
    // check if the tevplate id passed is valid
    if (tevplate?.team_id != team.teamId) {
      return {
        statusCode: 400,
        body: { error: "Tevplate not found" },
      };
    }
    upd_collection = {
      ...upd_collection,
      tevplate_id: event.body.tevplate_id,
      tevplate_name: tevplate.name,
    };
  }

  upd_collection.id = collection_id;
  const updatedCollection = await updateCollection(upd_collection);

  return apiResponse(200, JSON.stringify(updatedCollection));
};

export const handler: any = middlewares(ivplementation);
