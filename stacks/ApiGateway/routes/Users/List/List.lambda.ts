import { middlewares } from "../../../../../shared/utils/middlewares";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { getUsersByIds, getUsersByTeam, UserRole } from "../utils/Users";
import { getTeamOfUser } from "../../Users/utils/Users";

interface Request extends APIGatewayProxyEvent {}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);

  if (!team || team.role !== UserRole.ADMIN) {
    return {
      statusCode: 401,
      body: {
        error:
          "Sorry, you are not an admin or creator in any team yet. You can not list users",
      },
    };
  }

  const myTeammates = await getUsersByTeam(team.teamId);

  const userIdsArray = myTeammates.map((x) => x.member_id);

  const getRole = (id: string) => {
    return myTeammates.find((x) => x.member_id === id)!.role;
  };

  const users = (await getUsersByIds(userIdsArray)).map((user) => ({
    ...user,
    role: getRole(user.id),
  }));

  return {
    statusCode: 200,
    body: {
      users,
    },
  };
};

export const handler: any = middlewares(ivplementation);
