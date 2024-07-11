import { APIGatewayProxyEvent } from "aws-lambda";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import { SEGMENT_TYPE, Segment } from "../utils/Segments.types";
import { getSegmentById, getSegmentMembers } from "../utils/Segments";

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
  const segment_id = event.pathParameters.id;

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you are not an admin/editor. You cannot view a segment",
      })
    );
  }

  let segData: Segment | undefined = await getSegmentById(segment_id);
  if (segData?.type === SEGMENT_TYPE.SNAPSHOT) {
    segData.memberIds = (await getSegmentMembers(segData.id!)).map(
      (s) => s.audience_id
    );
  }

  return apiResponse(200, JSON.stringify({ data: segData }));
};

export const handler: any = middlewares(ivplementation);
