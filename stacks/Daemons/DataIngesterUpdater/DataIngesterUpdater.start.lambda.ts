import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { ethers } from "ethers";
import { getAllSources } from "../../ApiGateway/routes/Sources/utils/Sources";

const sqs = new SQSClient({});

export const handler = async () => {
  const sources = await getAllSources();
  const cSources = sources.filter(
    (s) => s.address !== ethers.constants.AddressZero
  );

  const SQS_SOURCES_QUEUE_URL = process.env.SQS_SOURCES_QUEUE_URL as string;
  const SQS_CHURNED_QUEUE_URL = process.env.SQS_CHURNED_QUEUE_URL as string;

  await Promise.all(
    cSources.map(async (source) => {
      await sqs.send(
        new SendMessageCommand({
          QueueUrl: SQS_SOURCES_QUEUE_URL,
          MessageBody: JSON.stringify(source),
        })
      );
      //Sync churned users
      await sqs.send(
        new SendMessageCommand({
          QueueUrl: SQS_CHURNED_QUEUE_URL,
          MessageBody: JSON.stringify(source),
        })
      );
    })
  );

  return {};
};
