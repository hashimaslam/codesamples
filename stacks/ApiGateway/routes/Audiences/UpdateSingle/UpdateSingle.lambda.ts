import { APIGatewayProxyEvent } from "aws-lambda";
import { getTeamOfUser, UserRole } from "../../Users/utils/Users";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getAudienceById, updateAudienceSingleField } from "../utils/Audiences";
import { removeDuplicates } from "../../../../../shared/utils/Common";

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
    email: string;
    tags: [string];
    type: string;
  };
}

const ivplementation = async (event: Request) => {
  const idActor = event.requestContext.authorizer.claims.sub;
  const idUpdatedUser = event.pathParameters?.id as string;
  const team = await getTeamOfUser(idActor);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot edit audience members",
      })
    );
  }

  const audienceItem = await getAudienceById(idUpdatedUser);

  if (!audienceItem || audienceItem.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Audience member does not exist." })
    );
  }

  if (event.body.email) {
    await updateAudienceSingleField(idUpdatedUser, "email", event.body.email);
  }
  if (event.body.type) {
    await updateAudienceSingleField(idUpdatedUser, "type", event.body.type);
  }
  if (event.body.tags) {
    const normalizedTags = removeDuplicates(event.body.tags);
    await updateAudienceSingleField(idUpdatedUser, "tags", normalizedTags);
  }

  return apiResponse(200, JSON.stringify({ id: idUpdatedUser }));
};

export const handler: any = middlewares(ivplementation);
