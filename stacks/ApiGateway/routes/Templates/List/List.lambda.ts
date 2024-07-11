import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { middlewares } from "../../../../../shared/utils/middlewares";
import { getTeamOfUser } from "../../Users/utils/Users";
import { getTevplatesByTeam } from "../utils/Tevplates";

interface Request extends APIGatewayProxyEvent {}

const getListTevplates = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);
  const tevplates = await getTevplatesByTeam(team.teamId);
  tevplates.sort((a, b) => {
    const aCreatedAt = a.created_time ?? 0;
    const bCreatedAt = b.created_time ?? 0;
    return bCreatedAt - aCreatedAt;
  });
  return { statusCode: 200, body: tevplates };
};

export const handler: any = middlewares(getListTevplates);
