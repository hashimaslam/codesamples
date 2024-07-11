import { Handler } from "aws-lambda/handler";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { BackgroundJobs } from "../../../../../shared/utils/BackgroundJobs";
import { getTeamOfUser } from "../../Users/utils/Users";
import {
  createSources,
  getSourceById,
  isUniqueSourceName,
} from "../../Sources/utils/Sources";
import { v4 as uuid } from "uuid";
import { Source, SOURCE_TYPE } from "../../Sources/utils/Sources.types";
import { ethers } from "ethers";
import { Time } from "../../../../../shared/utils/DateTime";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";

async function startJob(props: {
  idUser: string;
  csv: string;
  idSource: string;
}) {
  const job = await BackgroundJobs.create();
  await new LambdaClient().send(
    new InvokeCommand({
      FunctionName: process.env.ARN_LAMBDA_FOR_BACKGROUND_PROCESSING as string,
      InvocationType: "Event",
      Payload: JSON.stringify({
        idJob: job.id,
        idUser: props.idUser,
        csv: props.csv,
        idSource: props.idSource,
      }),
    })
  );
  return { id: job.id };
}

export const lambda: Handler = async (event) => {
  const idUser = event.requestContext.authorizer?.claims.sub as string;
  const team = await getTeamOfUser(idUser);
  const csv = event.body.csv;

  let idSource = event.body.sourceId; // Link the imported Audience members to a source in the Sources table
  if (idSource && !(await getSourceById(idSource))) {
    return apiResponse(
      400,
      JSON.stringify({
        error: `The provided sourceId does not exist: ${idSource}`,
      })
    );
  }

  const sourceName = event.body.source ?? ""; // Or allow people to specify a source name manually

  if (idSource && sourceName) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "You can't specify both source name and sourceId",
      })
    );
  }

  if (sourceName) {
    // Create the manual source in the DB
    if (!(await isUniqueSourceName(team.teamId, sourceName))) {
      return apiResponse(
        400,
        JSON.stringify({
          error: `The provided source name is not unique: ${sourceName}`,
        })
      );
    }

    // @TODO Conceptually this doesn't seem correct. All CSV imports should end up under the same Source called "CSV Imports". I just moved the code here, even though it's incorrect
    const source: Source = {
      id: uuid(),
      team_id: team.teamId,
      source_name: sourceName.trim(),
      type: SOURCE_TYPE.CSV,
      chain_id: 0,
      address: ethers.constants.AddressZero,
      createdAt: Time.now(),
    };
    await createSources(source);

    idSource = source.id;
  }

  const job = await startJob({
    idUser,
    csv,
    idSource,
  });

  return {
    statusCode: 200,
    body: {
      jobId: job.id,
    },
  };
};

export const handler: any = middlewares(lambda);
