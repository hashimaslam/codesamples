import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { getTeamOfUser, UserRole } from "../../Users/utils/Users";
import { Token } from "../utils/Tokens.types";
import { deleteTokenFromDB } from "../utils/Tokens";
import { getTokenById } from "../utils/Tokens";
import { deletePublicFile } from "../../Storage/utils/Storage";

interface Request extends APIGatewayProxyEvent {}

const deleteToken = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);
  const queries = event.pathParameters;
  const token_id = queries?.id;

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot execute this operation",
      })
    );
  }

  if (!token_id) {
    return apiResponse(400, JSON.stringify({ error: "Missing token id" }));
  }

  const token: Token | undefined = await getTokenById(token_id);

  if (!token) {
    return apiResponse(
      400,
      JSON.stringify({ error: "This token does not exists" })
    );
  }

  if (token.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "This token does not belong to a collection managed by your team",
      })
    );
  }

  if (token.minted_date && token.minted_date > 0) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This token can't be deleted as is already minted",
      })
    );
  }

  if (token.image && token.image !== "") {
    const targetPath = token.image as unknown as string;
    await deletePublicFile(targetPath);
  }

  if (token.animation_url && token.animation_url !== "") {
    const targetPath = token.animation_url as unknown as string;
    await deletePublicFile(targetPath);
  }

  if (await deleteTokenFromDB(token.id as unknown as string)) {
    return apiResponse(200, JSON.stringify({ success: true }));
  }

  return apiResponse(400, JSON.stringify({ success: false }));
};

export const handler: any = middlewares(deleteToken);
