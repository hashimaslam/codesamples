import { DynamoDBStreamHandler } from "aws-lambda";
import {
  AttributeValue,
  DynamoDBClient,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Client } from "@opensearch-project/opensearch";
import { OpenSearchIndexManager } from "../../../shared/utils/OpenSearch/OpenSearchIndexManager";
import { OpenSearchClient } from "../../../shared/utils/OpenSearch/OpenSearchClient";
import { getLogger } from "../../../shared/utils/middlewares/getLogger";

const client = new DynamoDBClient({});

// Hacky workaround, as per: https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-1006086291
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

class ElasticSearchBulkIndexer {
  constructor(
    private esClient: Client,
    private indexName: string,
    private idField: string
  ) {}

  async bulkIndex(map: Record<string, any>[]) {
    if (map.length === 0) {
      return; // Nothing to do
    }

    try {
      // Convert the record array to ElasticSearch bulk compatible format
      const bulkBody = map.flatMap((item) => [
        { index: { _index: this.indexName, _id: item[this.idField] } },
        item,
      ]);

      const bulkResult = await this.esClient.bulk({
        body: bulkBody,
      });

      if (bulkResult.warnings?.length) {
        getLogger().warn(
          `ElasticSearchBulkIndexer.bulkIndex() warnings were generated during indexing ${map.length} records`
        );
        getLogger().warn(JSON.stringify(bulkResult.warnings, null, 2));
        return;
      }

      getLogger().info(
        `ElasticSearchBulkIndexer.bulkIndex() succeeded for ${map.length} records`
      );
    } catch (e: any) {
      getLogger().error(
        `ElasticSearchBulkIndexer.bulkIndex() failed for ${map.length} records: ${e.message}`,
        e
      );
      throw e;
    }
  }
}

async function indexDynamoDBItemsToES(
  Items: Record<string, AttributeValue>[],
  indexName: string,
  pkField: string
) {
  const os = await OpenSearchClient.getInstance();
  const indexer = new ElasticSearchBulkIndexer(os, indexName, pkField);
  const items = Items.map((x) => unmarshall(x));
  await indexer.bulkIndex(items);
}

async function getDynamoDbItems(
  tableName: string,
  cursor?: Record<string, AttributeValue>
) {
  const items = await client.send(
    new ScanCommand({
      TableName: tableName,
      ExclusiveStartKey: cursor,
    })
  );
  return {
    items: items.Items ?? [],
    nextKey: items.LastEvaluatedKey,
  };
}

export const handler: DynamoDBStreamHandler = async (event) => {
  const TABLE_NAME = process.env.SOURCE_TABLE_NAME as string;
  //Notice OpenSearch does not accept Uppercase letters at index names
  const INDEX_NAME = (
    process.env.OPENSEARCH_INDEX_NAME as string
  ).toLowerCase();
  const PK_FIELD = process.env.PK_FIELD as string;

  await OpenSearchIndexManager.deleteIndex(INDEX_NAME);
  await OpenSearchIndexManager.createIndexIfNeeded(INDEX_NAME);

  let lastEvaluatedKey: Record<string, AttributeValue> | undefined = undefined;

  do {
    if (lastEvaluatedKey) {
      console.log(
        "Indexing next batch of items with cursor:",
        lastEvaluatedKey
      );
    }

    const { items, nextKey } = await getDynamoDbItems(
      TABLE_NAME,
      lastEvaluatedKey
    );
    await indexDynamoDBItemsToES(items, INDEX_NAME, PK_FIELD);
    lastEvaluatedKey = nextKey; // if present, set cursor for next iteration/recursion

    console.log(`Indexed batch of ${items.length} items`);
  } while (lastEvaluatedKey);

  await OpenSearchIndexManager.logIndex(INDEX_NAME);
};
