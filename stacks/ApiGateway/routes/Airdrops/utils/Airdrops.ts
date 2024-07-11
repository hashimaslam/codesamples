import { TableNames } from "../../../../../shared/utils/TableNames";
import { DB } from "../../../../../shared/utils/DB";
import { Airdrop } from "./Airdrop.types";
import { DynamoDB } from "aws-sdk";

export async function createAirdrop(airdrop: Airdrop) {
  if (!airdrop.id) throw new Error("Unique token id is required for creation");

  await DB.write(await TableNames.airdrops(), airdrop);
  return {
    id: airdrop.id,
  };
}

export async function getAirdropById(id: string): Promise<Airdrop | undefined> {
  const result = await new DynamoDB()
    .getItem({
      TableName: await TableNames.airdrops(),
      Key: DynamoDB.Converter.marshall({
        id: id,
      }),
    })
    .promise();
  if (!result.Item) {
    return undefined;
  } else {
    return DynamoDB.Converter.unmarshall(result.Item);
  }
}

export async function getAirdropsByCollection(
  collectionId: string
): Promise<Array<Airdrop>> {
  const results = await new DynamoDB()
    .query({
      TableName: await TableNames.airdrops(),
      IndexName: "collection_id",
      KeyConditionExpression: "collection_id = :collection_id",
      ExpressionAttributeValues: {
        ":collection_id": {
          S: collectionId,
        },
      },
    })
    .promise();
  if (!results.Items) {
    return [];
  } else {
    return results.Items.map((x) => DynamoDB.Converter.unmarshall(x));
  }
}

export async function getAirdropsByTeam(
  teamId: string
): Promise<Array<Airdrop>> {
  const results = await new DynamoDB()
    .query({
      TableName: await TableNames.airdrops(),
      IndexName: "team_id",
      KeyConditionExpression: "team_id = :team_id",
      ExpressionAttributeValues: {
        ":team_id": {
          S: teamId,
        },
      },
    })
    .promise();
  if (!results.Items) {
    return [];
  } else {
    return results.Items.map((x) => DynamoDB.Converter.unmarshall(x));
  }
}

export async function updateAirdropField(
  id: string,
  field: string,
  value: string | number
) {
  const updateResult = await new DynamoDB()
    .updateItem({
      TableName: await TableNames.airdrops(),
      Key: DynamoDB.Converter.marshall({ id }),
      UpdateExpression: `set #f = :v`,
      ExpressionAttributeNames: {
        "#f": field,
      },
      ExpressionAttributeValues: DynamoDB.Converter.marshall({
        ":v": value,
      }),
    })
    .promise();

  if (updateResult.$response.error) {
    console.error(updateResult.$response.error);
    throw new Error(updateResult.$response.error.message);
  }

  return true;
}

export async function deleteAirdropById(airdrop_id: string) {
  const item = await new DynamoDB()
    .deleteItem({
      TableName: await TableNames.airdrops(),
      Key: DynamoDB.Converter.marshall({ id: airdrop_id }),
    })
    .promise();

  if (item.$response.error) {
    throw new Error("Failed to delete a airdrop");
  }

  return true;
}
