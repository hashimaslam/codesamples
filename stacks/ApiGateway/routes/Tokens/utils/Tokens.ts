import { DynamoDB } from "aws-sdk";
import { TableNames } from "../../../../../shared/utils/TableNames";
import { Token, TokenOrder } from "./Tokens.types";
import { getSendGrid } from "../../../../../shared/utils/SendGrid";
import {
  EMAIL_FROM_DEFAULT_SENDER,
  SupportedContractTypes,
} from "../../../../../shared/utils/Constants";
import { DB } from "../../../../../shared/utils/DB";

export async function getTokensByCollection(
  collectionId: string
): Promise<Array<Token>> {
  const results = await new DynamoDB()
    .query({
      TableName: await TableNames.tokens(),
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

export async function getTokensByTeam(teamId: string): Promise<Array<Token>> {
  const results = await new DynamoDB()
    .query({
      TableName: await TableNames.tokens(),
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

export async function getTokenOrdersByCollection(
  teamId: string
): Promise<Array<TokenOrder>> {
  const results = await new DynamoDB()
    .query({
      TableName: await TableNames.tokenorders(),
      IndexName: "collection_id",
      KeyConditionExpression: "collection_id = :collection_id",
      ExpressionAttributeValues: {
        ":collection_id": {
          S: teamId,
        },
      },
    })
    .promise();
  if (!results.Items) {
    return [];
  } else {
    const forders = results.Items.map((x) => DynamoDB.Converter.unmarshall(x));
    //return fpurchases.filter((x) => !x.transfer_tx); //Only pending
    return forders;
  }
}

export async function getTokenOrderByTxHash(tx: string): Promise<TokenOrder[]> {
  const results = await new DynamoDB()
    .query({
      TableName: await TableNames.tokenorders(),
      IndexName: "tx_hash",
      KeyConditionExpression: "tx_hash = :tx_hash",
      ExpressionAttributeValues: {
        ":tx_hash": {
          S: tx,
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

export async function getTokenById(id: string): Promise<Token | undefined> {
  const result = await new DynamoDB()
    .getItem({
      TableName: await TableNames.tokens(),
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

export async function getTokenBySmartContractTokenId(
  collectionId: string,
  tokenID: number | undefined
): Promise<Token | undefined> {
  const results = await new DynamoDB()
    .query({
      TableName: await TableNames.tokens(),
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
    return {};
  } else {
    let tokens = results.Items.map((i: any) =>
      DynamoDB.Converter.unmarshall(i)
    );
    if (tokenID !== undefined)
      tokens = tokens.filter((x) => x.tokenID === tokenID);
    if (tokens.length === 0) {
      return undefined;
    }
    return tokens[0];
  }
}

export async function createToken(token: Token) {
  if (!token.id) throw new Error("Unique token id is required for creation");

  await DB.write(await TableNames.tokens(), token);
  return {
    id: token.id,
  };
}

export async function updateToken(token: any) {
  let updateExpression = "set";
  let ExpressionAttributeNames: any = {};
  let ExpressionAttributeValues: any = {};
  for (const property in token) {
    if (property === "id") continue;
    updateExpression += ` #${property} = :${property} ,`;
    ExpressionAttributeNames["#" + property] = property;
    ExpressionAttributeValues[":" + property] = token[property];
  }

  updateExpression = updateExpression.slice(0, -1);

  const result = await new DynamoDB()
    .updateItem({
      TableName: await TableNames.tokens(),
      Key: DynamoDB.Converter.marshall({
        id: token.id,
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
    id: token.id,
    updated_attributes: result.Attributes
      ? DynamoDB.Converter.unmarshall(result.Attributes)
      : {},
  };
}

export async function deleteTokenFromDB(id: string): Promise<Boolean> {
  const item = await new DynamoDB()
    .deleteItem({
      TableName: await TableNames.tokens(),
      Key: DynamoDB.Converter.marshall({ id }),
    })
    .promise();
  if (item.$response.error) {
    console.error(item.$response.error);
    return false;
  }
  return true;
}

export async function getTokenOrderById(
  id: string
): Promise<TokenOrder | undefined> {
  const result = await new DynamoDB()
    .getItem({
      TableName: await TableNames.tokenorders(),
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

export async function createTokenOrder(order: TokenOrder) {
  await DB.write(await TableNames.tokenorders(), order);
  return {
    id: order.id,
  };
}

export async function updateTokenOrder(order: any) {
  let updateExpression = "set";
  let ExpressionAttributeNames: any = {};
  let ExpressionAttributeValues: any = {};
  for (const property in order) {
    if (property === "id") continue;
    updateExpression += ` #${property} = :${property} ,`;
    ExpressionAttributeNames["#" + property] = property;
    ExpressionAttributeValues[":" + property] = order[property];
  }

  updateExpression = updateExpression.slice(0, -1);

  const result = await new DynamoDB()
    .updateItem({
      TableName: await TableNames.tokenorders(),
      Key: DynamoDB.Converter.marshall({
        id: order.id,
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
    id: order.id,
    updated_attributes: result.Attributes
      ? DynamoDB.Converter.unmarshall(result.Attributes)
      : {},
  };
}

export async function sendStripeEmail(props: {
  receiverEmail: string;
  tevplateId: string;
  tevplateData: any;
}) {
  const { receiverEmail, tevplateId, tevplateData } = props;
  const sendGrid = await getSendGrid();
  return await sendGrid.send({
    from: EMAIL_FROM_DEFAULT_SENDER,
    to: receiverEmail,
    tevplateId: tevplateId,
    dynamicTevplateData: tevplateData,
  });
}

export function generateMetadata(
  token: Token,
  imageURI: string,
  type: SupportedContractTypes
) {
  /*
    if (type === "edition" || type === "edition-drop") {
      //TODO: Notice ERC-1155 Metadata URI JSON Schema:
        //This JSON schema is loosely based on the “ERC721 Metadata JSON Schema”, but includes optional formatting to allow for
      //ID substitution by clients. If the string {id} exists in any JSON value, it MUST be replaced with the actual token ID,
      //by all client software that follows this standard.

      return {
        title: "Asset metadada",
        type: "object",
        properties: {
          name: {
            type: "string",
            description: token.name,
          },
          decimals: {
            type: "string",
            description: token.decimals,
          },
          description: {
            type: "string",
            description: token.description,
          },
          image: {
            type: "string",
            description: imageURI,
          },
          properties: {
            type: "object",
            description: token.attributes,
          },
        },
      };
    } else {
  */
  //"nft-drop" || "nft-collection"  -> ERC721
  return {
    title: "Asset metadada",
    type: "object",
    properties: {
      name: {
        type: "string",
        description: token.name,
      },
      description: {
        type: "string",
        description: token.description,
      },
      image: {
        type: "string",
        description: imageURI,
      },
      ...token.attributes,
    },
  };
  //}
}
