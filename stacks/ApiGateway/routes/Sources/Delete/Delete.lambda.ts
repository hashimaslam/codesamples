import { APIGatewayProxyEvent } from "aws-lambda";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import { Lambda } from "aws-sdk";
import { getSourceById } from "../utils/Sources";

import { BackgroundJobs } from "../../../../../shared/utils/BackgroundJobs";
import { FORM_STATUS } from "../../Forms/utils/Forms.types";
import { getFormsFromOpensearch } from "../../Forms/utils/Forms";

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

async function startJob(sourceId: string, sourceName: string, teamId: string) {
  const job = await BackgroundJobs.create({ type: "sourceDeletion" });

  const asyncInvokeResult = await new Lambda()
    .invokeAsync({
      FunctionName: process.env
        .ARN_LAMBDA_FOR_BACKGROUND_SOURCE_DELETION as string,
      InvokeArgs: JSON.stringify({
        jobId: job.id,
        sourceId,
        sourceName,
        teamId,
      }),
    })
    .promise();

  if (asyncInvokeResult.$response.error) {
    throw new Error(asyncInvokeResult.$response.error.message);
  }

  return job;
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer.claims.sub;
  const sourceId = event.pathParameters.id;

  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you are not an admin/editor. You cannot delete sources.",
      })
    );
  }

  const source = await getSourceById(sourceId);

  if (!source) {
    return apiResponse(
      400,
      JSON.stringify({ error: `Source with id ${sourceId} not found.` })
    );
  }

  if (source.team_id?.localeCompare(team.teamId) !== 0) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Cannot delete other team sources." })
    );
  }

  const filters = {
    status: [FORM_STATUS.PUBLISHED],
    sourceId: source.id,
  };

  const { data, absoluteCount } = await getFormsFromOpensearch(
    0,
    0,
    team.teamId,
    "",
    filters,
    []
  );

  if (absoluteCount > 0) {
    return apiResponse(
      400,
      JSON.stringify({
        error:
          "Cannot delete this source as is being used by a published form.",
      })
    );
  }

  // Now invoke the sqs queue and return the job id
  const job = await startJob(sourceId, source.source_name!, team.teamId);

  return apiResponse(
    200,
    JSON.stringify({
      jobId: job.id,
      message: `Source with id ${sourceId} will be deleted in the background.`,
    })
  );
};

export const handler: any = middlewares(ivplementation);
