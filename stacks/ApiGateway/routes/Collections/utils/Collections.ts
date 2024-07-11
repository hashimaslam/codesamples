import { DynamoDB } from "aws-sdk";
import { batchDeleteItems } from "../../../../../shared/utils/DynamoDB";
import { TableNames } from "../../../../../shared/utils/TableNames";
import {
  getTokensByCollection,
  getTokenOrdersByCollection,
} from "../../Tokens/utils/Tokens";
import { Token, TokenOrder } from "../../Tokens/utils/Tokens.types";
import { Collection } from "./Collections.types";
import {
  getAllowListById,
  getAllowListItemsByAllowListId,
} from "../../AllowLists/utils/AllowLists";
import { AllowListItem } from "../../AllowLists/utils/AllowLists.types";
import { getTeamConfig, Branding } from "../../Tenants/utils/Tenants";
import { getPublicFixedURL } from "../../Storage/utils/Storage";
import { DB } from "../../../../../shared/utils/DB";

export const metadataRegExp = new RegExp("^[aA-zZ0-9]+$");

/**
 * Try to detect if the provided timestamp is in UNIX milliseconds or seconds
 * This is not exact science, because in some extreme causes a millisecond timestamp can look like seconds
 * and seconds timestamp can look like milliseconds, but it's good enough for our use case
 * The solution below just instantiates both and see which one is closer to the current time
 * Usually treating milliseconds as seconds leads to years far in the future, so it's a good heuristic
 */
function isTimestampInMilliseconds(timestamp: number) {
  const date = new Date(timestamp);

  return (
    Math.abs(Date.now() - date.getTime()) <
    Math.abs(Date.now() - date.getTime() * 1000)
  );
}

export async function getCollectionsByTeam(
  teamId: string
): Promise<Array<Collection>> {
  const results = await new DynamoDB()
    .query({
      TableName: await TableNames.collections(),
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
    return results.Items.map((x) => DynamoDB.Converter.unmarshall(x)).map(
      (x) => {
        if (!x.created_at) {
          // Backward compatibility for Collections created before the created_at field was added, make sure we return
          // always something from the API even for consistency, even if it's the wrong value.
          // This is a dev-only issue anyway, so this is a temporary hack
          x.created_at = 0;
        }

        // Convert deploy_date to seconds if it's in milliseconds, for standardization
        if (x.deploy_date && isTimestampInMilliseconds(x.deploy_date)) {
          x.deploy_date = Math.floor(x.deploy_date / 1000);
        }

        if (x.deploy_date === 0) {
          delete x.deploy_date;
        }
        return x;
      }
    );
  }
}

export async function getCollectionByChainAndAddress(
  chainId: number,
  address: string,
  teamId: string
): Promise<Collection> {
  const results = await new DynamoDB()
    .query({
      TableName: await TableNames.collections(),
      IndexName: "address",
      KeyConditionExpression: "address = :address",
      ExpressionAttributeValues: {
        ":address": { S: address },
      },
    })
    .promise();

  if (!results.Items) {
    return {};
  } else {
    const fcollections = results.Items.filter((x) => {
      const uEle = DynamoDB.Converter.unmarshall(x);
      uEle.chain_id === chainId && uEle.team_id === teamId;
    });
    //.find(() => true);
    if (fcollections.length == 0) {
      return {};
    }
    const collections = fcollections.map((i: any) =>
      DynamoDB.Converter.unmarshall(i)
    );
    return collections[0];
  }
}

export async function getCollectionById(
  id: string
): Promise<Collection | undefined> {
  const result = await new DynamoDB()
    .getItem({
      TableName: await TableNames.collections(),
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

export async function createCollection(collection: Collection) {
  await DB.write(await TableNames.collections(), collection);
  return {
    id: collection.id,
  };
}

export async function updateCollection(collection: any) {
  let updateExpression = "set";
  let ExpressionAttributeNames: any = {};
  let ExpressionAttributeValues: any = {};
  for (const property in collection as Collection) {
    if (property === "id") continue;
    updateExpression += ` #${property} = :${property} ,`;
    ExpressionAttributeNames["#" + property] = property;
    ExpressionAttributeValues[":" + property] = collection[property];
  }

  updateExpression = updateExpression.slice(0, -1);

  const result = await new DynamoDB()
    .updateItem({
      TableName: await TableNames.collections(),
      Key: DynamoDB.Converter.marshall({
        id: collection.id,
      }),
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: ExpressionAttributeNames,
      ExpressionAttributeValues: DynamoDB.Converter.marshall(
        ExpressionAttributeValues
      ),
      ReturnValues: "UPDATED_NEW",
    })
    .promise();

  if (result.$response.error) {
    console.error(result.$response.error);
    throw new Error(result.$response.error.message);
  }

  return {
    id: collection.id,
    updated_attributes: result.Attributes
      ? DynamoDB.Converter.unmarshall(result.Attributes)
      : {},
  };
}

export async function deleteCollectionFromDB(id: string): Promise<Boolean> {
  //Delete all token orders belonging to the collection
  const tokenOrders: TokenOrder[] = await getTokenOrdersByCollection(id);
  if (tokenOrders.length > 0) {
    const tokenO_ids = tokenOrders.map((tokenO) => tokenO.id);
    const resO = await batchDeleteItems(
      await TableNames.tokenorders(),
      tokenO_ids
    );
    if (resO?.error) {
      console.error(resO?.error);
      return false;
    }
  }

  //Delete all tokens belonging to the collection
  const tokens: Token[] = await getTokensByCollection(id);
  if (tokens.length > 0) {
    const token_ids = tokens.map((token) => token.id);
    const res = await batchDeleteItems(await TableNames.tokens(), token_ids);
    if (res?.error) {
      console.error(res?.error);
      return false;
    }
  }

  //Delete collection from table collections
  const item = await new DynamoDB()
    .deleteItem({
      TableName: await TableNames.collections(),
      Key: DynamoDB.Converter.marshall({ id }),
    })
    .promise();
  if (item.$response.error) {
    console.error(item.$response.error);
    return false;
  }
  return true;
}

export async function getCascadeBranding(
  collection_id: string,
  address?: string
): Promise<Branding | undefined> {
  const collection: Collection | undefined = await getCollectionById(
    collection_id
  );
  let branding: Branding | undefined = undefined;
  if (collection && collection.checkoutConditions) {
    //If not allowlist branding neither checkout branding it gets the tenant branding
    if (collection.checkoutConditions.allowListId && address) {
      const allow_list = await getAllowListById(
        collection.checkoutConditions.allowListId
      );
      const allow_list_items = await getAllowListItemsByAllowListId(
        collection.checkoutConditions.allowListId
      );
      const item = allow_list_items.find(
        (a: AllowListItem) => a.address === address
      );
      if (item) {
        branding = allow_list?.branding;
      }
    }
    if (!branding) {
      branding = collection.checkoutConditions.branding;
    }
    if (!branding) {
      branding = await getTeamConfig(
        collection.team_id as unknown as string,
        "branding"
      );
    }
    if (branding && branding.logo && branding.logo !== "") {
      branding.logo = await getPublicFixedURL(
        branding.logo as unknown as string
      );
    }
  }
  return branding;
}
