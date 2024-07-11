import { batchDeleteItems } from "../../../../../shared/utils/DynamoDB";
import { TableNames } from "../../../../../shared/utils/TableNames";
import { AllowList, AllowListItem } from "./AllowLists.types";
import { DB } from "../../../../../shared/utils/DB";
import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const dbClient = new DynamoDBClient();

export async function getAllowListsByTeam(
  teamId: string
): Promise<Array<AllowList>> {
  const results = await dbClient.send(
    new QueryCommand({
      TableName: await TableNames.allowlists(),
      IndexName: "team_id",
      KeyConditionExpression: "team_id = :team_id",
      ExpressionAttributeValues: {
        ":team_id": {
          S: teamId,
        },
      },
    })
  );

  if (!results.Items) {
    return [];
  }

  return results.Items.map((x) => unmarshall(x));
}

export async function getAllowListById(
  id: string
): Promise<AllowList | undefined> {
  const result = await dbClient.send(
    new GetItemCommand({
      TableName: await TableNames.allowlists(),
      Key: marshall({
        id: id,
      }),
    })
  );

  if (!result.Item) {
    return undefined;
  }

  return unmarshall(result.Item);
}

export async function createAllowList(allowlist: AllowList) {
  await DB.write(await TableNames.allowlists(), allowlist);
  return {
    id: allowlist.id,
  };
}

export async function removeCollectionFromAllowList(allowlistId: string) {
  const command = new UpdateItemCommand({
    TableName: await TableNames.allowlists(),
    Key: marshall({
      id: allowlistId,
    }),
    UpdateExpression: "REMOVE #param1, #param2",
    ExpressionAttributeNames: {
      "#param1": "collection_id",
      "#param2": "collection_name",
    },
    ReturnValues: "UPDATED_NEW",
  });

  try {
    const result = await dbClient.send(command);
    return {
      id: allowlistId,
      updated_attributes: result.Attributes
        ? unmarshall(result.Attributes)
        : {},
    };
  } catch (error) {
    console.error(error);
    throw new Error((error as any).message);
  }
}

export async function updateAllowList(allowlist: any) {
  let updateExpression = "set";
  let ExpressionAttributeNames: any = {};
  let ExpressionAttributeValues: any = {};
  for (const property in allowlist as AllowList) {
    if (property === "id") continue;
    updateExpression += ` #${property} = :${property} ,`;
    ExpressionAttributeNames["#" + property] = property;
    ExpressionAttributeValues[":" + property] = allowlist[property];
  }

  updateExpression = updateExpression.slice(0, -1);

  const result = await dbClient.send(
    new UpdateItemCommand({
      TableName: await TableNames.allowlists(),
      Key: marshall({
        id: allowlist.id,
      }),
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: ExpressionAttributeNames,
      ExpressionAttributeValues: marshall(ExpressionAttributeValues),
      ReturnValues: "UPDATED_NEW",
    })
  );

  return {
    id: allowlist.id,
    updated_attributes: result.Attributes ? unmarshall(result.Attributes) : {},
  };
}

export async function createAllowListItem(allowListItem: AllowListItem) {
  if (!allowListItem.address)
    throw new Error("Unique address is required for creation");

  await DB.write(await TableNames.allowlistitems(), allowListItem);
  return {
    address: allowListItem.address,
  };
}

export async function getAllowListItemsByAllowListId(
  allowListId: string
): Promise<Array<any>> {
  const results = await dbClient.send(
    new QueryCommand({
      TableName: await TableNames.allowlistitems(),
      IndexName: "allow_list_id",
      KeyConditionExpression: "allow_list_id = :allow_list_id",
      ExpressionAttributeValues: {
        ":allow_list_id": {
          S: allowListId,
        },
      },
    })
  );
  if (!results.Items) {
    return [];
  }
  return results.Items.map((x) => unmarshall(x));
}

export async function getAllowListsByCollectionId(
  collectionId: string
): Promise<Array<AllowList>> {
  const results = await dbClient.send(
    new QueryCommand({
      TableName: await TableNames.allowlists(),
      IndexName: "collection_id",
      KeyConditionExpression: "collection_id = :collection_id",
      ExpressionAttributeValues: {
        ":collection_id": {
          S: collectionId,
        },
      },
    })
  );
  if (!results.Items) {
    return [];
  }
  return results.Items.map((x) => unmarshall(x));
}

export async function deleteAllowListItemsByAllowListId(
  id: string
): Promise<Boolean> {
  //Delete all allowlistitems belonging to the given allowlist
  const items: AllowListItem[] = await getAllowListItemsByAllowListId(id);
  const item_ids = items.map((item: AllowListItem) => item.id);
  const res = await batchDeleteItems(
    await TableNames.allowlistitems(),
    item_ids
  );
  if (res?.error) {
    console.error(res?.error);
    return false;
  }
  return true;
}

export async function deleteAllowListFromDB(id: string): Promise<Boolean> {
  if (!(await deleteAllowListItemsByAllowListId(id))) return false;

  //Delete allowlist from table
  await dbClient.send(
    new DeleteItemCommand({
      TableName: await TableNames.allowlists(),
      Key: marshall({ id }),
    })
  );
  return true;
}
