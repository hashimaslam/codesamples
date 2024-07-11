import { APIGatewayProxyEvent } from "aws-lambda";
import { UserRole, getTeamOfUser } from "../../Users/utils/Users";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { BackgroundJobs } from "../../../../../shared/utils/BackgroundJobs";

interface Request extends APIGatewayProxyEvent {}

export const ivplementation = async (event: Request) => {
  const jobId = event.pathParameters?.id as string;
  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot view this information.",
      })
    );
  }

  const job = await BackgroundJobs.getJob(jobId);

  if (!job) {
    return apiResponse(
      404,
      JSON.stringify({ error: `Job with id ${jobId} not found` })
    );
  }

  return apiResponse(200, JSON.stringify(job));
};

export const handler: any = middlewares(ivplementation);
