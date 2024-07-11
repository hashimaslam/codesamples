import { Handler } from "aws-lambda/handler";
import { BackgroundJobs } from "../../../../../shared/utils/BackgroundJobs";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { getTeamOfUser, UserRole } from "../../Users/utils/Users";
import { APIGatewayProxyEvent } from "aws-lambda";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";

interface Request extends APIGatewayProxyEvent {}

async function startJob(props: {
  userId: string;
  sourceId?: string[];
  sortBy?: string[];
  type?: string[];
  tags?: string[];
  searchText: string;
  teamId: string;
  totalItems?: number;
  segmentId?: string;
}) {
  const job = await BackgroundJobs.create();
  const FunctionName = process.env
    .ARN_LAMBDA_FOR_BACKGROUND_EXPORTING_AUDIENCES as string;
  await new LambdaClient().send(
    new InvokeCommand({
      FunctionName,
      InvocationType: "Event",
      Payload: JSON.stringify({
        userId: props.userId,
        sourceId: props.sourceId,
        sortBy: props.sortBy,
        type: props.type,
        tags: props.tags,
        searchText: props.searchText,
        teamId: props.teamId,
        totalItems: props.totalItems,
        segmentId: props.segmentId,
      }),
    })
  );
  return { id: job.id };
}

export const lambda: Handler = async (event) => {
  const userId = event.requestContext.authorizer?.claims.sub as string;
  // sort params
  const sortBy = event.multiValueQueryStringParameters?.sortBy as [string];

  // filter params
  const type = event.multiValueQueryStringParameters?.type;
  const tags = event.multiValueQueryStringParameters?.tags;
  const searchText = event.queryStringParameters?.search as string;

  const totalItems = event.queryStringParameters?.totalItems as number;

  // fetch segment related information
  const segmentId = event.queryStringParameters?.segment_id;

  //fetch source related information
  const sourceId = event.multiValueQueryStringParameters?.sourceId;

  const team = await getTeamOfUser(userId);

  if (team.role != UserRole.ADMIN && team.role != UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot get the Audiences List",
      })
    );
  }

  const job = await startJob({
    userId,
    sourceId,
    sortBy,
    type,
    tags,
    searchText,
    teamId: team.teamId,
    totalItems,
    segmentId,
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
