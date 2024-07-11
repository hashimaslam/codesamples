import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getTeamOfUser, UserRole } from "../../Users/utils/Users";
import { AudienceFilters } from "../utils/Audiences.types";
import { BackgroundJobs } from "../../../../../shared/utils/BackgroundJobs";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";

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
    tags: string[];
    filters: AudienceFilters;
  };
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const body = JSON.parse(JSON.stringify(event.body) ?? "{}");

  if (!body.tags) {
    return apiResponse(
      400,
      JSON.stringify({ error: "No tags sent to add or remove" })
    );
  }

  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you have not grants to update audiences",
      })
    );
  }

  const job = await BackgroundJobs.create();
  await new LambdaClient().send(
    new InvokeCommand({
      FunctionName: process.env.ARN_LAMBDA_FOR_BACKGROUND_PROCESSING as string,
      InvocationType: "Event",
      Payload: JSON.stringify({
        team_id: team.teamId,
        filters: body.filters,
        tags: body.tags,
        job_id: job.id,
      }),
    })
  );

  return apiResponse(200, JSON.stringify({ jobId: job.id }));
};

export const handler: any = middlewares(ivplementation);
