import { Handler } from "aws-lambda/handler";
import { BackgroundJobs } from "../../../../../shared/utils/BackgroundJobs";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getTeamOfUser, UserRole } from "../../Users/utils/Users";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Lambda } from "aws-sdk";
import { CHURNED_USERS_SORTABLE_FIELDS } from "../utils/Churned.types";
import { getSourceById } from "../../Sources/utils/Sources";
import { getFiltersFromEvent } from "../../Audiences/utils/Audiences";
import { AudienceFilters } from "../../Audiences/utils/Audiences.types";

interface Request extends APIGatewayProxyEvent {}

async function startJob(props: {
  userId: string;
  teamId: string;
  sortBy?: string[];
  filters: AudienceFilters;
}) {
  const job = await BackgroundJobs.create();
  const asyncInvokeResult = await new Lambda()
    .invokeAsync({
      FunctionName: process.env
        .ARN_LAMBDA_FOR_BACKGROUND_EXPORTING_CHURNED as string,
      InvokeArgs: JSON.stringify({
        userId: props.userId,
        teamId: props.teamId,
        filters: props.filters,
      }),
    })
    .promise();
  if (asyncInvokeResult.$response.error) {
    throw new Error(asyncInvokeResult.$response.error.message);
  }
  return { id: job.id };
}

export const lambda: Handler = async (event: Request) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const sourceId = event.queryStringParameters?.sourceId as string;
  const sortBy = event.multiValueQueryStringParameters?.sortBy as
    | undefined
    | CHURNED_USERS_SORTABLE_FIELDS[];

  if (!sourceId) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Missing required parameter: sourceId" })
    );
  }

  const filters = getFiltersFromEvent(event);

  const team = await getTeamOfUser(userId);
  const teamId = team.teamId;
  const source = await getSourceById(sourceId);

  const roleHasAccess =
    team.role == UserRole.ADMIN || team.role == UserRole.EDITOR;
  const usersTeamOwnsTheSource = source?.team_id == teamId;

  if (!roleHasAccess) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot view Churned members",
      })
    );
  }

  if (!usersTeamOwnsTheSource) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "This source does not exist or is not belonging to your team",
      })
    );
  }

  const job = await startJob({
    userId,
    teamId: team.teamId,
    sortBy,
    filters,
  });

  return {
    statusCode: 200,
    body: {
      result:
        "Exporting data. The results file will be sent to the user email. Empty results won't be sent.",
      jobId: job.id,
    },
  };
};

export const handler: any = middlewares(lambda);
