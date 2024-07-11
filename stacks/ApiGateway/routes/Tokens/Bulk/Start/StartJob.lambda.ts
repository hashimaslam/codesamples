import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import {
  apiResponse,
  middlewares,
} from "../../../../../../shared/utils/middlewares";
import { v4 as uuid } from "uuid";
import { getTeamOfUser, UserRole } from "../../../Users/utils/Users";
import { Collection } from "../../../Collections/utils/Collections.types";
import { getCollectionById } from "../../../Collections/utils/Collections";
import { DynamoDB, Lambda } from "aws-sdk";
import { TableNames } from "../../../../../../shared/utils/TableNames";
import { DB } from "../../../../../../shared/utils/DB";

interface Request extends Omit<APIGatewayProxyEvent, "body"> {
  body: {
    collectionId: string;
    csv: string;
    zip: string;
  };
}

async function createBackgroundJob() {
  const id = uuid();
  await DB.write(await TableNames.backgroundJobs(), {
    id: id,
    status: "in_progress",
    // delete the job in 24 hours, after a certain point it's no longer relevant, because the user
    // will have naturally moved on to different pages and when they come back to the Token listing,
    // the page will naturally refresh and show the new Tokens anyway
    ttl: Date.now() / 1000 + 60 * 60 * 24,
  });
  return { id };
}

const lambda = async (event: Request) => {
  const tmpCsvPath = event.body.csv;
  const tmpZipPath = event.body.zip;
  const collectionId = event.body.collectionId;

  const userId = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(userId);

  const collection: Collection | undefined = await getCollectionById(
    collectionId
  );

  if (team.role !== UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error: "Sorry, you are not an admin/editor. You cannot upload tokens",
      })
    );
  }

  if (!collection || collection.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "Attempting to import tokens in an unknown collection",
      })
    );
  }

  // Create job and start it
  const job = await createBackgroundJob();

  await new Lambda()
    .invokeAsync({
      FunctionName: process.env.ARN_LAMBDA_FOR_BACKGROUND_PROCESSING as string,
      InvokeArgs: JSON.stringify({
        id: job.id,
        csv: tmpCsvPath,
        zip: tmpZipPath,
        idCollection: collectionId,
        idUser: userId,
      }),
    })
    .promise();
  return apiResponse(
    200,
    JSON.stringify({
      jobId: job.id,
    })
  );
};

export const handler: any = middlewares(lambda);
