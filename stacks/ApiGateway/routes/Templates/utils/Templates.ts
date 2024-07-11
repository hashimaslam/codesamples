import { DynamoDB } from "aws-sdk";
import { TableNames } from "../../../../../shared/utils/TableNames";
import { v4 as uuid } from "uuid";
import { DB } from "../../../../../shared/utils/DB";

export async function createNewTevplate(tevplate: any) {
  const id = uuid();
  await DB.write(await TableNames.tevplates(), tevplate);
  return {
    id,
  };
}

export async function getTevplateById(id: string): Promise<any> {
  const results = await new DynamoDB()
    .getItem({
      TableName: await TableNames.tevplates(),
      Key: DynamoDB.Converter.marshall({ id: id }),
    })
    .promise();

  if (!results.Item) {
    return undefined;
  }

  return DynamoDB.Converter.unmarshall(results.Item);
}

export async function getTevplatesByTeam(teamId: string) {
  const results = await new DynamoDB()
    .query({
      TableName: await TableNames.tevplates(),
      IndexName: "team_id",
      KeyConditionExpression: "team_id=:team_id",
      ExpressionAttributeValues: DynamoDB.Converter.marshall({
        ":team_id": teamId,
      }),
    })
    .promise();

  if (!results.Items) {
    return [];
  }

  return results.Items.map((i) => DynamoDB.Converter.unmarshall(i));
}

export async function deleteTevplate(tevplate_id: string) {
  const item = await new DynamoDB()
    .deleteItem({
      TableName: await TableNames.tevplates(),
      Key: DynamoDB.Converter.marshall({ id: tevplate_id }),
    })
    .promise();

  if (item.$response.error) {
    throw new Error("Failed to delete a tevplate");
  }

  return true;
}

export async function updateTevplateField(
  id: string,
  field: string,
  value: string
) {
  const updateResult = await new DynamoDB()
    .updateItem({
      TableName: await TableNames.tevplates(),
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
