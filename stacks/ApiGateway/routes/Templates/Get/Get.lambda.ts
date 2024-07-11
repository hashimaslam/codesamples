import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { middlewares } from "../../../../../shared/utils/middlewares";
import { getTeamOfUser, UserRole } from "../../Users/utils/Users";
import { getTevplateById } from "../utils/Tevplates";
import { Tevplate } from "../utils/Tevplates.types";

interface Request extends APIGatewayProxyEvent {}

const getTevplate = async (event: Request) => {
  const queries = event.pathParameters;
  const tevplate_id = queries!.id as string;

  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return {
      statusCode: 401,
      body: {
        error:
          "Sorry, you are not an admin/editor of any team yet. You cannot view a tevplate",
      },
    };
  }

  const tevplate: Tevplate = await getTevplateById(tevplate_id);

  if (!tevplate) {
    return {
      statusCode: 400,
      body: { error: "This tevplate does not exist in your team" },
    };
  } else if (tevplate.team_id != team.teamId) {
    return {
      statusCode: 400,
      body: {
        error: "Cannot access the tevplate from other team",
      },
    };
  }

  return { statusCode: 200, body: { tevplate } };
};

export const handler: any = middlewares(getTevplate);
