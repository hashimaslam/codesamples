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
  tokenID: number;
};

interface Request extends APIGatewayProxyEvent {}

const postMintToken = async (event: Request) => {
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

  const collection: Collection | undefined = await getCollectionById(
    token.collection_id as unknown as string
  );

  if (!collection || collection.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "This token does not exist or does not belong to a collection managed by your team",
      })
    );
  }

  if (!collection.deploy_date) {
    return apiResponse(
      400,
      JSON.stringify({
        error: `This collection contract is still not deployed to blockchain, so can't mint`,
      })
    );
  }

  if (
    token.tokenID &&
    token.tokenID !== 0 &&
    collection.contract_type === "nft-collection"
  ) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This token has already a tokenID, so it is already minted",
      })
    );
  }

  const { tokenID } = JSON.parse(
    JSON.stringify(event.body) ?? "{}"
  ) as RequestData;

  if (tokenID === undefined) {
    //Don't use !, as is number))
    return apiResponse(
      400,
      JSON.stringify({ error: "Invalid 'tokenID' provided" })
    );
  }

  let upd_token: any = {
    id: token.id,
    minted_date: new Date().getTime(),
  };

  if (collection.contract_type !== "nft-collection") {
    upd_token.tokenID = tokenID;
  } else {
    upd_token.tokenID = 0; //We dont update startTokenId, as is stored at DB as 0 to avoid extenal contract calls to lazymint count inconsistencies
    upd_token.endTokenID = tokenID;
    upd_token.minted_date = 0;
    delete upd_token.mint_tx;
  }
  const updated_token = await updateToken(upd_token);
  return apiResponse(200, JSON.stringify(updated_token));
};

export const handler: any = middlewares(postMintToken);
