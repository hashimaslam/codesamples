import { APIGatewayProxyEvent } from "aws-lambda";
import {
  SEGMENT_CREATION_SOURCE,
  SEGMENT_ORIGIN,
  SEGMENT_TYPE,
} from "../utils/Segments.types";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getTeamOfUser, UserRole } from "../../Users/utils/Users";
import { BackgroundJobs } from "../../../../../shared/utils/BackgroundJobs";
import { Lambda } from "aws-sdk";
import { isUniqueName } from "../utils/Segments";
import { AudienceFilters } from "../../Audiences/utils/Audiences.types";

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
    name: string;
    filters: AudienceFilters;
    type: SEGMENT_TYPE;
    origin: SEGMENT_ORIGIN;
    creationSource: SEGMENT_CREATION_SOURCE;
  };
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer.claims.sub;
  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot add new segment.",
      })
    );
  }

  const body = event.body;

  // First check if the name exists
  if (!(await isUniqueName(body.name.trim(), team.teamId))) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "A segment with this name already exists. Please enter a different name.",
      })
    );
  }

  if (
    !body.origin ||
    (body.origin !== SEGMENT_ORIGIN.CHURNED &&
      body.origin !== SEGMENT_ORIGIN.CURRENT)
  ) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "Should specify a segment data origin, churned or current.",
      })
    );
  }

  // Check if the filters are present
  if (!body.filters) {
    return apiResponse(400, JSON.stringify({ error: "Filters not provided" }));
  }

  const job = await BackgroundJobs.create();
  const asyncInvokeResult = await new Lambda()
    .invokeAsync({
      FunctionName: process.env.ARN_LAMBDA_FOR_BACKGROUND_PROCESSING as string,
      InvokeArgs: JSON.stringify({
        name: body.name.trim(),
        team_id: team.teamId,
        filters: body.filters,
        type: body.type ? body.type : SEGMENT_TYPE.SNAPSHOT,
        origin: body.origin,
        creation_source:
          body.creationSource ?? SEGMENT_CREATION_SOURCE.AUDIENCE,
        job_id: job.id,
      }),
    })
    .promise();

  if (asyncInvokeResult.$response.error) {
    throw new Error(asyncInvokeResult.$response.error.message);
  }

  return apiResponse(200, JSON.stringify({ jobId: job.id }));
};

export const handler: any = middlewares(ivplementation);
