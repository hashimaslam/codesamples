import { APIGatewayProxyEvent } from "aws-lambda";
import { isUUID } from "../../../../../shared/utils/Common";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import {
  getSegmentById,
  isUniqueName,
  updateSegmentSingleField,
} from "../utils/Segments";
import { Segment } from "../utils/Segments.types";

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
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const segmentId = event.pathParameters?.id as string;

  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you are not an admin/editor. You cannot update segments",
      })
    );
  }

  if (!segmentId || !isUUID(segmentId)) {
    return apiResponse(
      400,
      JSON.stringify({ error: `Missing segment id ${segmentId}` })
    );
  }

  const segment_in = JSON.parse(JSON.stringify(event.body) ?? "{}") as Segment;
  segment_in.id = segmentId;

  const segment = await getSegmentById(segmentId);

  if (!segment) {
    return apiResponse(
      400,
      JSON.stringify({ error: `Segment with id ${segmentId} not found.` })
    );
  }

  if (segment.team_id?.localeCompare(team.teamId) !== 0) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Cannot update other team segments." })
    );
  }

  if (segment_in.name && segment_in.name.length > 0) {
    if (segment_in.name?.toLowerCase() !== segment.name?.toLowerCase()) {
      if (!(await isUniqueName(segment_in.name, team.teamId))) {
        return apiResponse(
          400,
          JSON.stringify({
            error:
              "A segment with this name already exists. Please enter a different name.",
          })
        );
      }
    }
    await updateSegmentSingleField(segmentId, "name", segment_in.name.trim());
  }

  return apiResponse(200, JSON.stringify(segment_in));
};

export const handler: any = middlewares(ivplementation);
