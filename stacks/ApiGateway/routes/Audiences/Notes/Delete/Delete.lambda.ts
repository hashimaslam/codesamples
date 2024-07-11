import { APIGatewayProxyEvent } from "aws-lambda";
import {
  apiResponse,
  middlewares,
} from "../../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../../Users/utils/Users";
import { deleteNote, getNotesById } from "../utils/Notes";

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
    note_id: string;
  };
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer.claims.sub;

  const team = await getTeamOfUser(userId);
  const audience_id = event.pathParameters.id;
  const note_id = event.pathParameters.note_id;

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you are not an admin/editor. You cannot update note.",
      })
    );
  }

  const noteData = await getNotesById(note_id);

  if (
    !noteData ||
    noteData.team_id !== team.teamId ||
    noteData.audience_id !== audience_id
  ) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Invalid Audience/Note Id provided." })
    );
  }

  await deleteNote(note_id);

  return apiResponse(200, JSON.stringify({ id: note_id }));
};

export const handler: any = middlewares(ivplementation);
