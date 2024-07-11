import { APIGatewayProxyEvent } from "aws-lambda";
import {
  apiResponse,
  middlewares,
} from "../../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../../Users/utils/Users";
import { isUUID } from "../../../../../../shared/utils/Common";
import { getNotesByAudienceIdAndTeam } from "../utils/Notes";

interface Request extends Omit<APIGatewayProxyEvent, "requestContext"> {
  requestContext: {
    authorizer: {
      claims: {
        sub: string;
      };
    };
  };

  pathParameters: {
    id: string;
  };
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer.claims.sub;

  const team = await getTeamOfUser(userId);
  const audience_id = event.pathParameters.id;

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you are not an admin/editor. You cannot view notes.",
      })
    );
  }

  if (!audience_id && !isUUID(audience_id)) {
    return apiResponse(400, JSON.stringify({ error: "Invalid Audience UUID" }));
  }
  const notes = await getNotesByAudienceIdAndTeam(audience_id, team.teamId);

  return apiResponse(200, JSON.stringify(notes));
};

export const handler: any = middlewares(ivplementation);
