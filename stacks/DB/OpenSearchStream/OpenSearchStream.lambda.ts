import { DynamoDBStreamHandler } from "aws-lambda";
import {
  AttributeValue,
  DynamoDBBatchItemFailure,
  DynamoDBBatchResponse,
} from "aws-lambda/trigger/dynamodb-stream";
import { OpenSearchClient } from "../../../shared/utils/OpenSearch/OpenSearchClient";
import { getLogger } from "../../../shared/utils/middlewares/getLogger";
import { getErrorMessage } from "../../../shared/utils/Common";
import { Bulk } from "@opensearch-project/opensearch/api/requestParams";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue as DynamoAttributeValue } from "@aws-sdk/client-dynamodb";

function getIdFromRow(
  row: { [p: string]: DynamoAttributeValue },
  PK_FIELD: string
) {
  if (!row[PK_FIELD].S) {
    throw new Error(
      `The PK field defined as "${PK_FIELD}" was not found inside the document`
    );
  }
  return row[PK_FIELD].S as string;
}

function convertV2ObjectToV3Object(data: { [p: string]: AttributeValue }) {
  type OVERLAPPING_V2_V3_TYPES =
    | DynamoAttributeValue.BMember
    | DynamoAttributeValue.BOOLMember
    | DynamoAttributeValue.BSMember
    | DynamoAttributeValue.LMember
    | DynamoAttributeValue.MMember
    | DynamoAttributeValue.NMember
    | DynamoAttributeValue.NSMember
    | DynamoAttributeValue.NULLMember
    | DynamoAttributeValue.SMember
    | DynamoAttributeValue.SSMember;

  const converted: Record<string, DynamoAttributeValue> = {};
  Object.keys(data).forEach((key) => {
    converted[key] = data[key] as OVERLAPPING_V2_V3_TYPES;
  });
  return converted;
}

export const handler: DynamoDBStreamHandler = async (
  event
): Promise<DynamoDBBatchResponse> => {
  //Notice OpenSearch does not accept Uppercase letters at index names
  const os = await OpenSearchClient.getInstance();
  const INDEX_NAME = (
    process.env.OPENSEARCH_INDEX_NAME as string
  ).toLowerCase();
  const PK_FIELD = process.env.PK_FIELD as string;

  getLogger().appendKeys({ indexName: INDEX_NAME });

  const bulkRequestBody: any[] = [];
  const batchItemFailures: DynamoDBBatchItemFailure[] = [];

  //Comment log block to save i/o operations
  //getLogger().info(
  //  `-------------------Received ${INDEX_NAME} DB stream event with ${event.Records.length} records to process`
  //);

  //OS Bulk doc: https://opensearch.org/docs/2.11/api-reference/document-apis/bulk/

  for (const record of event.Records) {
    try {
      switch (record.eventName) {
        case "INSERT":
        case "MODIFY": {
          if (!record.dynamodb?.NewImage) {
            throw new Error(
              "DynamoDB to OpenSearch stream Lambda was misconfigured. NewImage is required to extract the document to be indexed"
            );
          }
          const data = record.dynamodb.NewImage;

          const converted = convertV2ObjectToV3Object(data);

          const document = unmarshall(converted);
          const index: {
            _index: string;
            _id?: string;
          } = {
            _index: INDEX_NAME,
          };
          if (document.id) {
            index._id = document.id;
          }
          const indexAction = {
            index,
          };
          bulkRequestBody.push(indexAction);
          bulkRequestBody.push(document);
          break;
        }
        case "REMOVE": {
          if (!record.dynamodb?.OldImage) {
            throw new Error(
              `DynamoDB to OpenSearch stream Lambda was misconfigured. OldImage is required to extract the document to be deindexed`
            );
          }
          const data = record.dynamodb.OldImage;
          const converted = convertV2ObjectToV3Object(data);
          const id = getIdFromRow(converted, PK_FIELD);
          const deleteAction = {
            delete: { _index: INDEX_NAME, _id: id },
          };
          bulkRequestBody.push(deleteAction);
          break;
        }
      }
    } catch (e) {
      const err = getErrorMessage(e);
      getLogger().error(err);
      batchItemFailures.push({
        itemIdentifier: record.eventID as unknown as string,
      });
    }
  }

  if (bulkRequestBody.length > 0) {
    const params: Bulk<any[]> = {
      body: bulkRequestBody,
    };
    try {
      await os.bulk(params);
      //Comment log block to save i/o operations
      //getLogger().info(`Sent ${(event.Records.length - batchItemFailures.length)} out of ${event.Records.length} records to OpenSearch successfully`);
    } catch (e) {
      const err = getErrorMessage(e);
      const msg = `Error sending ${bulkRequestBody.length} records to OpenSearch: ${err}`;
      console.error(msg);
      getLogger().error(err);
      throw new Error(msg);
    }
  }

  return {
    batchItemFailures,
  };
};
