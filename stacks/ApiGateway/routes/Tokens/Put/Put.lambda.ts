import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { v4 as uuid } from "uuid";
import { Token } from "../utils/Tokens.types";
import { storePublicFile, deletePublicFile } from "../../Storage/utils/Storage";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import { getTokenById, updateToken } from "../utils/Tokens";
import { Collection } from "../../Collections/utils/Collections.types";
import { getCollectionById } from "../../Collections/utils/Collections";
import { isUUID } from "../../../../../shared/utils/Common";

interface Request extends APIGatewayProxyEvent {}

const putToken = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const queries = event.pathParameters;

  const token_id = queries?.id;

  if (!token_id || !isUUID(token_id)) {
    return apiResponse(400, JSON.stringify({ error: "Missing token id" }));
  }

  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you are not an admin/editor. You cannot update tokens",
      })
    );
  }

  const token_in = JSON.parse(JSON.stringify(event.body) ?? "{}") as Token;

  const token = await getTokenById(token_id);
  if (!token) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This token does not exist",
      })
    );
  }

  const collection: Collection | undefined = await getCollectionById(
    token.collection_id as unknown as string
  );
  if (!collection || collection.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "This token does not belong to a collection managed by your team",
      })
    );
  }

  if (token_in.image && token_in.image !== "") {
    const sourcePath = token_in.image;
    const [extension] = sourcePath.split(".").slice(-1);
    const targetPath = `tokens_images/${
      token_in.collection_id
    }/${uuid()}.${extension}`;
    await storePublicFile(sourcePath, targetPath);
    token_in.image = targetPath;
  }

  if (token_in.animation_url && token_in.animation_url !== "") {
    const sourcePath = token_in.animation_url;
    const [extension] = sourcePath.split(".").slice(-1);
    const targetPath = `tokens_videos/${
      token_in.collection_id
    }/${uuid()}.${extension}`;
    await storePublicFile(sourcePath, targetPath);
    token_in.animation_url = targetPath;
  } else if (
    token_in.remove_video &&
    (!token_in.animation_url || token_in.animation_url !== "") &&
    token.animation_url &&
    token.animation_url !== ""
  ) {
    const targetPath = token.animation_url as unknown as string;
    await deletePublicFile(targetPath);
    token_in.animation_url = "";
  }

  token_in.id = token_id;
  const updated_token = await updateToken(token_in);

  return apiResponse(200, JSON.stringify(updated_token));
};

export const handler: any = middlewares(putToken);
