import { APIGatewayProxyEvent } from "aws-lambda";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { isUniqueSourceName } from "../utils/Sources";

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
    source_name: string;
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

  if (payload.source_name) {
    if (!(await isUniqueSourceName(team.teamId, payload.source_name))) {
      return apiResponse(
        200,
        JSON.stringify({
          error: `Duplicate name. Source name with "${payload.source_name}" is already present`,
        })
      );
    }

    return apiResponse(
      200,
      JSON.stringify({ source_name: payload.source_name, isAvailable: true })
    );
  }

  return apiResponse(
    400,
    JSON.stringify({ error: "Source name not provided." })
  );
};

export const handler: any = middlewares(ivplementation);
