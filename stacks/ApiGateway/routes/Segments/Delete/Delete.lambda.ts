import { APIGatewayProxyEvent } from "aws-lambda";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import { getSegmentById } from "../utils/Segments";
import { BackgroundJobs } from "../../../../../shared/utils/BackgroundJobs";
import { Lambda } from "aws-sdk";

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
  const segmentId = event.pathParameters.id;

  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot delete segments.",
      })
    );
  }

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
      JSON.stringify({ error: "Cannot delete other team segments." })
    );
  }

  const job = await BackgroundJobs.create({ type: "segmentDeletion" });

  const asyncInvokeResult = await new Lambda()
    .invokeAsync({
      FunctionName: process.env.ARN_LAMBDA_FOR_BACKGROUND_PROCESSING as string,
      InvokeArgs: JSON.stringify({
        jobId: job.id,
        segmentId,
      }),
    })
    .promise();

  if (asyncInvokeResult.$response.error) {
    return apiResponse(
      400,
      JSON.stringify({
        error: `Cannot delete segment: ${asyncInvokeResult.$response.error.message}`,
      })
    );
  }

  return apiResponse(
    200,
    JSON.stringify({
      jobId: job.id,
      message: `Segment ${segmentId} will be deleted at background.`,
    })
  );
};

export const handler: any = middlewares(ivplementation);
