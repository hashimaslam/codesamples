import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { v4 as uuid } from "uuid";
import { Collection } from "../utils/Collections.types";
import { Token } from "../../Tokens/utils/Tokens.types";
import { clonePrivateFile, clonePublicFile } from "../../Storage/utils/Storage";
import { getTeamOfUser, UserRole } from "../../Users/utils/Users";
import { createCollection, getCollectionById } from "../utils/Collections";
import { createToken, getTokensByCollection } from "../../Tokens/utils/Tokens";
import { isUUID } from "../../../../../shared/utils/Common";
import { Time } from "../../../../../shared/utils/DateTime";
import { isValidChainId } from "../../../../../shared/utils/Web3";

interface Request
  extends Omit<APIGatewayProxyEvent, "requestContext" | "body"> {
  requestContext: {
    authorizer: {
      claims: {
        sub: string;
      };
    };
  };
  body: {
    name?: string;
    chain_id?: number;
    clone_tokens?: boolean;
  };
}

const cloneCollection = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);
  const queries = event.pathParameters;
  const collection_id = queries?.id;
  const collection_name = event.body?.name;
  const chain_id = event.body?.chain_id;
  const shouldCloneTokens = event.body?.clone_tokens;

  if (!collection_id || !isUUID(collection_id)) {
    return apiResponse(400, JSON.stringify({ error: "Missing collection id" }));
  }

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot execute this operation",
      })
    );
  }

  if (!collection_id) {
    return apiResponse(400, JSON.stringify({ error: "Missing collection id" }));
  }

  const collection_in: Collection | undefined = await getCollectionById(
    collection_id
  );

  if (!collection_in) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This collection does not exist",
      })
    );
  }

  if (collection_in.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This collection is not managed by your team",
      })
    );
  }
  if (collection_name && collection_name?.trim() !== "") {
    collection_in.name = collection_name;
  }

  if (chain_id && isValidChainId(chain_id)) {
    collection_in.chain_id = chain_id;
  }

  const sourcePath = collection_in.avatar;
  let targetPath = "";
  if (!!sourcePath && sourcePath.trim() !== "") {
    const [extension] = sourcePath.split(".").slice(-1);
    targetPath = `collections_images/${userId}/${uuid()}.${extension}`;
    await clonePrivateFile(sourcePath, targetPath);
  }

  const tokens: Token[] = await getTokensByCollection(collection_in.id!);

  const new_collection_id = uuid();
  delete collection_in.address;
  delete collection_in.deploy_tx;
  delete collection_in.checkoutConditions;
  collection_in.deploy_date = 0;
  collection_in.avatar = targetPath;
  (collection_in.created_at = Time.now()),
    (collection_in.id = new_collection_id);
  collection_in.metadata!.baseURI = `https://${event.headers.Host}/prod/tokens/metadata/${new_collection_id}/`;

  if (shouldCloneTokens) {
    await Promise.all(
      tokens.map(async (token: Token) => {
        const sourcePath = token.image as unknown as string;
        const [extension] = sourcePath.split(".").slice(-1);
        const targetPath = `tokens_images/${new_collection_id}/${uuid()}.${extension}`;
        await clonePublicFile(sourcePath, targetPath);
        delete token.tokenID;
        token.collection_id = new_collection_id;
        token.mint_tx = "";
        token.minted_date = 0;
        token.image = targetPath;
        token.id = uuid();
        await createToken(token);

        if (!!token.animation_url) {
          const sourcePath2 = token.animation_url as unknown as string;
          const [extension2] = sourcePath.split(".").slice(-1);
          const targetPath2 = `tokens_images/${new_collection_id}/${uuid()}.${extension2}`;
          await clonePublicFile(sourcePath2, targetPath2);
          token.animation_url = targetPath2;
        }
      })
    );
  }
  const new_collection = await createCollection(collection_in);

  return apiResponse(200, JSON.stringify({ id: new_collection.id }));
};

export const handler: any = middlewares(cloneCollection);
