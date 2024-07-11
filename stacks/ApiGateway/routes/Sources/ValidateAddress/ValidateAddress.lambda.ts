import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getERC721 } from "../../../../../shared/utils/Web3";
import { getSourceByAddress } from "../utils/Sources";
import { APIGatewayProxyEvent } from "aws-lambda";

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
    address: string;
    chain_id: number;
  };
}

export const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;

  const payload = event.body;

  const team = await getTeamOfUser(userId);

  if (team.role != UserRole.ADMIN && team.role != UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot validate contract addresses",
      })
    );
  }

  // Before hitting the blockchain, let's check if this address already exists.
  const sourceList = await getSourceByAddress(payload.address.toLowerCase());

  const sourceItem = sourceList.filter((ele) => {
    return (
      ele.team_id?.localeCompare(team.teamId) == 0 &&
      ele.chain_id === payload.chain_id
    );
  });

  if (sourceItem.length == 0) {
    const erc721Details = await getERC721(
      payload.address,
      payload.chain_id,
      team.teamId
    );

    if (erc721Details.error) {
      return apiResponse(200, JSON.stringify(erc721Details));
    }

    return apiResponse(
      200,
      JSON.stringify({
        source: erc721Details.name,
        address: erc721Details.collectionAddress,
        symbol: erc721Details.symbol,
        chain_id: erc721Details.chain_id,
      })
    );
  }

  return apiResponse(
    200,
    JSON.stringify({
      error: "Duplicate address. Address already present in the database.",
    })
  );
};

export const handler: any = middlewares(ivplementation);
