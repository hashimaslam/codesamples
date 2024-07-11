import { APIGatewayProxyEvent } from "aws-lambda";
import { UserRole, getTeamOfUser } from "../../../Users/utils/Users";
import {
  apiResponse,
  middlewares,
} from "../../../../../../shared/utils/middlewares";
import { MAX_NOTE_SIZE, Note } from "../utils/Notes.types";
import { v4 as uuid } from "uuid";
import { createNote } from "../utils/Notes";
import { isAudienceExist } from "../../utils/Audiences";
import { isUUID } from "../../../../../../shared/utils/Common";
import { Time } from "../../../../../../shared/utils/DateTime";

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
  };

  body: {
    note_content: string;
  };
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer.claims.sub;

  const team = await getTeamOfUser(userId);
  const body = event.body;
  const audience_id = event.pathParameters.id;

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you are not an admin/editor. You cannot view notes.",
      })
    );
  }

  // Some sanity checks for the request body
  if (
    !body.note_content &&
    (body.note_content.length == 0 || body.note_content.length > MAX_NOTE_SIZE)
  ) {
    return apiResponse(400, JSON.stringify({ error: "Invalid note size" }));
  }

  if (!audience_id && !isUUID(audience_id)) {
    return apiResponse(400, JSON.stringify({ error: "Invalid Audience UUID" }));
  }

  // check if the audience exist for the team
  const isExist = await isAudienceExist(audience_id, team.teamId);

  if (!isExist) {
    return apiResponse(
      400,
      JSON.stringify({
        error: `Audience with id ${audience_id} does not exist.`,
      })
    );
  }

  const note: Note = {
    id: uuid(),
    team_id: team.teamId,
    note_content: body.note_content,
    audience_id: audience_id,
    timestamp: Time.now(),
    updated_at: 0,
  };

  await createNote(note);

  return apiResponse(200, JSON.stringify({ id: note.id }));
};

export const handler: any = middlewares(ivplementation);
