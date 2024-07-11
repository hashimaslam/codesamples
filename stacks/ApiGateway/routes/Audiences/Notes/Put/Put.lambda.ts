import { APIGatewayProxyEvent } from "aws-lambda";
import {
  apiResponse,
  middlewares,
} from "../../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../../Users/utils/Users";
import { MAX_NOTE_SIZE } from "../utils/Notes.types";
import { isUUID } from "../../../../../../shared/utils/Common";
import { getNotesById, updateNote } from "../utils/Notes";

interface Request
  extends Omit<APIGatewayProxyEvent, "requestContext" | "body"> {
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

  body: {
    note_content: string;
  };
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer.claims.sub;

  const team = await getTeamOfUser(userId);
  const note_content = event.body.note_content;
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

  if (
    (!note_content && note_content.length == 0) ||
    note_content.length > MAX_NOTE_SIZE
  ) {
    return apiResponse(400, JSON.stringify({ error: "Invalid note size." }));
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

  // Now, update the note content
  await updateNote(note_id, note_content);

  return apiResponse(
    200,
    JSON.stringify({
      id: note_id,
      audience_id,
      updatedFields: ["note_content"],
    })
  );
};

export const handler: any = middlewares(ivplementation);
