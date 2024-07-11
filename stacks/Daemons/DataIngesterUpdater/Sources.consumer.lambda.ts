import { getAudiencesListByFilter } from "../../ApiGateway/routes/Audiences/utils/Audiences";
import {
  SendMessageCommand,
  DeleteMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
import {
  cascadeDeleteSource,
  fetchAudienceAddresses,
} from "../../ApiGateway/routes/Sources/utils/Sources";
import { getLogger } from "../../../shared/utils/middlewares/getLogger";
import { Source } from "../../ApiGateway/routes/Sources/utils/Sources.types";
import { SQSHandler, SQSRecord } from "aws-lambda";

const sqs = new SQSClient({});

async function markSqsCovpleted(record: SQSRecord) {
  await sqs.send(
    new DeleteMessageCommand({
      QueueUrl: process.env.SQS_SOURCES_QUEUE_URL as string,
      ReceiptHandle: record.receiptHandle as string,
    })
  );
}

export const handler: SQSHandler = async (event) => {
  for (let record of event.Records) {
    try {
      const source: Source = JSON.parse(record.body);

      let errs: string[] = [];

      // Sync members with contract as source
      // First fetch all the audiences members belonging to the source
      const { data } = await getAudiencesListByFilter(
        {
          sourceId: [source.id!],
        },
        source.team_id!
      );

      const { audList, errors } = await fetchAudienceAddresses(
        source.address!,
        source.chain_id!,
        source.source_name!,
        source.id!,
        source.team_id!
      );
      errs = errs.concat(errors);
      const result = data.filter(({ id: id1 }) => !audList.includes(id1!));

      if (result.length > 0) {
        // If we are here, this would confirm that there are wallets who are no more part of the nfts from this moment.
        errs = errs.concat(
          (
            await cascadeDeleteSource(
              source.id!,
              source.source_name!,
              source.team_id!,
              result
            )
          ).errors
        );
      }
      if (errs.length > 0) {
        getLogger().error(errs.toString());
      }
    } catch (e: any) {
      getLogger().error(e);
    }
    await markSqsCovpleted(record);
  }
};
