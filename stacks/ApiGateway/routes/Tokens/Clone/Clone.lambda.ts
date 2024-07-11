import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { v4 as uuid } from "uuid";
import { Token } from "../utils/Tokens.types";
import { clonePublicFile } from "../../Storage/utils/Storage";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import { createToken, getTokenById } from "../utils/Tokens";
import { isUUID } from "../../../../../shared/utils/Common";

interface Request extends APIGatewayProxyEvent {}

const cloneToken = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);
  const queries = event.pathParameters;

  const token_id = queries?.id;

  if (!token_id || !isUUID(token_id)) {
    return apiResponse(400, JSON.stringify({ error: "Missing token id" }));
  }

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you are not an admin/editor. You cannot clone tokens",
      })
    );
  }

  const token_in: Token | undefined = await getTokenById(token_id);

  if (!token_in) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This token does not exist",
      })
    );
  }

  if (token_in.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "This token does not belong to a collection managed by your team",
      })
    );
  }

  const sourcePath = token_in.image as unknown as string;
  const [extension] = sourcePath.split(".").slice(-1);
  const targetPath = `tokens_images/${
    token_in.collection_id
  }/${uuid()}.${extension}`;
  await clonePublicFile(sourcePath, targetPath);

  if (token_in.animation_url && token_in.animation_url !== "") {
    const sourcePath = token_in.animation_url;
    const [extension] = sourcePath.split(".").slice(-1);
    const targetPath = `tokens_videos/${
      token_in.collection_id
    }/${uuid()}.${extension}`;
    await clonePublicFile(sourcePath, targetPath);
    token_in.animation_url = targetPath;
  }

  token_in.mint_tx = "";
  token_in.minted_date = 0;
  token_in.image = targetPath;
  token_in.id = uuid();

  const new_token = await createToken(token_in);

  return apiResponse(200, JSON.stringify({ id: new_token.id }));
};

export const handler: any = middlewares(cloneToken);
