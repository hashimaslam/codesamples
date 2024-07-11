import { SQSEvent } from "aws-lambda/trigger/sqs";
import { DeleteMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { ingestAudienceAddress } from "../../../shared/utils/AudienceDataProviders/Covalenthq.Ingester";
import { MetricResolution, MetricUnits } from "@aws-lambda-powertools/metrics";
import { getMetrics } from "../../../shared/utils/middlewares/getMetrics";
import { getLogger } from "../../../shared/utils/middlewares/getLogger";

const sqsClient = new SQSClient();

type IngestEventProps = {
  sqsUrl: string;
  audienceId: string;
  address: string;
  total: number;
  counter: number;
  jobId: string;
  retryCalls?: boolean[];
};

export const handler = async (event: SQSEvent) => {
  let errors: string[] = [];
  let aErrors = 0;
  for (let record of event.Records) {
    const params = JSON.parse(record.body) as IngestEventProps;

    const cErrors = await ingestAudienceAddress(
      params.jobId,
      params.audienceId
    );
    errors = errors.concat(cErrors);
    if (errors.length > 0) aErrors++;

    getLogger().info(
      cErrors.length > 0 ? `Finished with errors` : `Finished with success`,
      { jobId: params.jobId },
      { counter: params.counter },
      { total: params.total },
      { address: params.address },
      { errors: cErrors }
    );

    await sqsClient.send(
      new DeleteMessageCommand({
        QueueUrl: params.sqsUrl,
        ReceiptHandle: record.receiptHandle,
      })
    );
  }

  if (event.Records.length > 0) {
    getMetrics().addMetric(
      "WalletIngest/successful_api_requests",
      MetricUnits.Count,
      event.Records.length *
        (JSON.parse(event.Records[0].body) as IngestEventProps).total,
      MetricResolution.High
    );
    getMetrics().addMetric(
      "WalletIngest/successful_full_audience_requests",
      MetricUnits.Count,
      event.Records.length,
      MetricResolution.High
    );
    if (aErrors > 0) {
      getMetrics().addMetric(
        "WalletIngest/failed_full_audience_requests",
        MetricUnits.Count,
        aErrors,
        MetricResolution.High
      );
      for (const error of errors) {
        getMetrics().addMetric(
          "WalletIngest/failed_api_requests",
          MetricUnits.Count,
          aErrors,
          MetricResolution.High
        );
        getMetrics().addMetadata("error", error);
      }
    }
  }
};
