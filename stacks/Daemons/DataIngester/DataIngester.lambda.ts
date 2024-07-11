import { Handler } from "aws-lambda/handler";
import { getAudiencesListByTeamFromDynamoDB } from "../../ApiGateway/routes/Audiences/utils/Audiences";
import {
  GetQueueUrlCommand,
  SendMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { SQS_INGEST_QUEUE_SUFFIX_NAME } from "../../../shared/utils/AudienceDataProviders/AudienceDataProviders.types";
import {
  BackgroundJob,
  BackgroundJobs,
} from "../../../shared/utils/BackgroundJobs";
import { MetricResolution, MetricUnits } from "@aws-lambda-powertools/metrics";
import { getMetrics } from "../../../shared/utils/middlewares/getMetrics";
import { getLogger } from "../../../shared/utils/middlewares/getLogger";

const sqsClient = new SQSClient();

export const handler: Handler = async (event?: { jobId: string }) => {
  const audienceList = await getAudiencesListByTeamFromDynamoDB();
  const queueName = `${process.env.AWS_ENV}${SQS_INGEST_QUEUE_SUFFIX_NAME}`;

  const command = new GetQueueUrlCommand({
    QueueName: queueName,
  });
  const sqsData = await sqsClient.send(command);

  let job;
  if (!event?.jobId) {
    job = await BackgroundJobs.create({
      counter: audienceList.length,
      type: "ingester",
    });
  }

  getLogger().info(
    `Starting ingest data from covalent with jobId: ${event?.jobId || job?.id}`
  );

  let errors: string[] = [];
  let pushedCount = 0;
  const messages = [];
  for (let i = 0; i < audienceList.length; i++) {
    const audience = audienceList[i];
    const msgBody = {
      sqsUrl: sqsData.QueueUrl as string,
      audienceId: audience.id as string,
      address: audience.address as string,
      total: audienceList.length,
      counter: i + 1,
      jobId: event?.jobId || job?.id,
    };

    messages.push(msgBody);
  }

  await Promise.all(
    messages.map(async (message) => {
      try {
        const sendData = await sqsClient.send(
          new SendMessageCommand({
            MessageBody: JSON.stringify(message),
            QueueUrl: sqsData.QueueUrl as string,
          })
        );
        if (!sendData) {
          console.error("Error sending SQS message");
          errors.push(
            `Error sending SQS message for address ${message.address}`
          );
          return;
        }
        pushedCount++;
      } catch (err) {
        console.error(err);
        errors.push(
          `Error sending SQS message ${err} for address ${message.address}`
        );
      }
      return;
    })
  );

  if (errors.length > 0) {
    getMetrics().addMetric(
      "WalletIngest/failed_sqs_requests",
      MetricUnits.Count,
      errors.length,
      MetricResolution.High
    );
    for (const error of errors) {
      getMetrics().addMetadata("WalletIngest/error", error);
    }
  }
  getMetrics().addMetric(
    "WalletIngest/total_sqs_requests_sent",
    MetricUnits.Count,
    audienceList.length,
    MetricResolution.High
  );

  const payload = {
    jobId: event?.jobId || job?.id,
    totalAdresses: `Pushed ${pushedCount} out of ${audienceList.length} addresses`,
    SQSerrors: errors.length > 0 ? errors : undefined,
  };

  const upd_job: BackgroundJob = {
    id: event?.jobId || job?.id,
    status: "succeeded",
    payload: {
      results: payload,
    },
  };
  if (errors.length > 0) {
    upd_job.payload = {
      results: upd_job.payload?.results,
      errors: errors,
    };
  }
  await BackgroundJobs.updateJob(upd_job);

  return {
    statusCode: 200,
    body: payload,
  };
};
