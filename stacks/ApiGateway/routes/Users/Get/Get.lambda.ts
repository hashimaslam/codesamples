import { middlewares } from "../../../../../shared/utils/middlewares";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  UserStatus,
  getRole,
  getTeamOfUser,
  getUsersByIds,
} from "../utils/Users";
import { UserTeam } from "../../../../../shared/utils/UserTeam";
import { getTeamConfig } from "../../Tenants/utils/Tenants";
import { THIRDWEB_API_KEY } from "../../../../../shared/utils/Constants";

interface Request extends APIGatewayProxyEvent {}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const id =
    event.pathParameters?.id === "me"
      ? userId
      : (event.pathParameters?.id as string);

  // True, if the API caller is retrieving user information for himself
  const isSelfRetrieval = userId === id;

  if (!id) {
    return {
      statusCode: 404,
      body: {
        error: "User not found",
      },
    };
  }

  // True, if the API caller is an admin of at least one team, where the retrieved user is a member of
  const isManagingRetrievedUser = await UserTeam.isManagingUser(userId, id);

  if (!isSelfRetrieval && !isManagingRetrievedUser) {
    return {
      statusCode: 400,
      body: {
        error:
          "Can not retrieve users for teams, of which you are not the admin of",
      },
    };
  }

  const users = await getUsersByIds([id]);
  const user = users.find(() => true); // Get first

  if (!user) {
    return {
      statusCode: 404,
      body: {
        error: "User not found",
      },
    };
  }

  const team = await getTeamOfUser(user.id);

  let ret = {};
  ret = {
    ...ret,
    id: user.id,
    team_id: team.teamId,
    created_at: user.created_at,
    updated_at: user.updated_at,
    email: user.email,
    username: user.username ?? "",
    full_name: user.full_name ?? "",
    wallet_address: user.wallet_address ?? "",
    status: user.status,
    role: await getRole(id),
  };

  if (isSelfRetrieval && user.status === UserStatus.ACTIVE) {
    const rpcProvider = await getTeamConfig(team.teamId, "rpcProvider");
    if (rpcProvider?.providers) {
      ret = {
        ...ret,
        rpcProvider: rpcProvider.providers.find(
          (p: any) => p.type === rpcProvider.selectedtype
        ),
      };
    }
  }

  ret = {
    ...ret,
    thirdweb_apikey: THIRDWEB_API_KEY,
  };

  return {
    statusCode: 200,
    body: ret,
  };
};

export const handler: any = middlewares(ivplementation);
