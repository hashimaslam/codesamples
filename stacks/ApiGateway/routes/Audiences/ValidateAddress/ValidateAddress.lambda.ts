import { APIGatewayProxyEvent } from "aws-lambda";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { isAddressPresentForATeam, validateAddress } from "../utils/Audiences";

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
    ens: string;
    chain_id: number;
  };
}

export const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;

  const ens = event.body.ens;
  const chainId = event.body.chain_id;

  const team = await getTeamOfUser(userId);

  if (team.role != UserRole.ADMIN && team.role != UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot validate addresses.",
      })
    );
  }

  const [flag, address] = await validateAddress(ens, team.teamId, chainId);
  let isAvailable = true;

  if (flag) {
    const audienceList = await isAddressPresentForATeam(address, team.teamId);

    if (audienceList.length > 0) isAvailable = false;
  }

  return apiResponse(
    200,
    JSON.stringify({
      address: address,
      isValid: flag,
      isPresent: isAvailable,
    })
  );
};

export const handler: any = middlewares(ivplementation);
