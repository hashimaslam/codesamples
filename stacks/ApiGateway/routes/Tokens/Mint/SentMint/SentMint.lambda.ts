import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../../Users/utils/Users";
import { Token } from "../../utils/Tokens.types";
import { getTokenById, updateToken } from "../../utils/Tokens";
import { Collection } from "../../../Collections/utils/Collections.types";
import { getCollectionById } from "../../../Collections/utils/Collections";

type RequestData = {
  tx: string;
};

interface Request extends APIGatewayProxyEvent {}

const sentMint = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot execute this operation",
      })
    );
  }

  const queries = event.pathParameters;
  const token_id = queries?.id;

  if (!token_id) {
    return apiResponse(400, JSON.stringify({ error: "Missing token id" }));
  }

  const token: Token | undefined = await getTokenById(token_id);

  if (!token) {
    return apiResponse(
      400,
      JSON.stringify({ error: "This token does not exist in your team" })
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

  const collection: Collection = await getCollectionById(
    token.collection_id as unknown as string
  );
  if (!collection.deploy_date || collection.deploy_date === 0) {
    return apiResponse(
      400,
      JSON.stringify({
        error: `This collection contract is still not deployed to blockchain, so can't mint`,
      })
    );
  }

  if (token.mint_tx && token.mint_tx !== "" && token.minted_date! > 0) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          collection.contract_type === "nft-drop"
            ? "There is a transaction on the way already, you need to wait for it to be finished to send a new one."
            : "This token already has a mint transaction settled, so it is already in a mint process",
      })
    );
  }

  const { tx } = JSON.parse(JSON.stringify(event.body) ?? "{}") as RequestData;

  const upd_token: Token = {
    id: token.id,
    mint_tx: tx,
  };

  const updated_token = await updateToken(upd_token);
  return apiResponse(200, JSON.stringify(updated_token));
};

export const handler: any = middlewares(sentMint);
