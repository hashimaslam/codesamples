import { TableNames } from "../../../shared/utils/TableNames";
import {
  getProxyAddressFromTransaction,
  getTokenIdFromTransaction,
  getTokensTransferredTransaction,
  TokensTransferredType,
  TX_FAILED,
  TX_PENDING,
} from "../../../shared/utils/TxParser";
import {
  getCollectionById,
  updateCollection,
} from "../../ApiGateway/routes/Collections/utils/Collections";
import { Collection } from "../../ApiGateway/routes/Collections/utils/Collections.types";
import {
  getTokenById,
  getTokenOrderById,
  getTokenOrderByTxHash,
  sendStripeEmail,
  updateToken,
  updateTokenOrder,
} from "../../ApiGateway/routes/Tokens/utils/Tokens";
import {
  Token,
  TokenOrder,
  TokenOrderStatus,
} from "../../ApiGateway/routes/Tokens/utils/Tokens.types";
import { SENDGRID_BUYER_TOKEN_PURCHASED_BY_STRIPE } from "../../../shared/utils/Constants";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDB } from "aws-sdk";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const handler = async () => {
  await checkUnmintedTokens();
  await checkUndeployedCollections();
  await checkUntransferredTokens();
};

async function checkUnmintedTokens() {
  const tokens = await getNotMintedTokens();
  for (let i = 0; i < tokens.length; i++) {
    const collection: Collection | undefined = await getCollectionById(
      tokens[i].collection_id as unknown as string
    );
    if (!collection) return;
    const tokenID = await getTokenIdFromTransaction(
      collection.chain_id as unknown as number,
      tokens[i].mint_tx as unknown as string,
      collection.team_id as unknown as string
    );

    if (tokenID === TX_FAILED) {
      const upd_token: Token = {
        id: tokens[i].id,
        mint_tx: "",
      };
      await updateToken(upd_token);
      console.log(
        `Mint transaction ${tokens[i].mint_tx} failed and token ${tokens[i].id} could not be minted`
      );
      continue;
    }

    if (tokenID !== TX_PENDING) {
      const upd_token: Token = {
        id: tokens[i].id,
      };
      if (collection.contract_type !== "nft-collection") {
        upd_token.minted_date = new Date().getTime();
        upd_token.tokenID = tokenID;
      } else {
        upd_token.tokenID = 0; //We dont update startTokenId, as is stored at DB as 0 to avoid extenal contract calls to lazymint count inconsistencies
        upd_token.endTokenID = tokenID;
        delete upd_token.mint_tx;
        upd_token.minted_date = 0;
      }
      await updateToken(upd_token);
    }
  }
}

async function checkUndeployedCollections() {
  const collections = await getNotDeployedCollections();
  for (let i = 0; i < collections.length; i++) {
    console.log(
      "--------------------Not deployed collection:",
      collections[i].id
    );
    const proxyAddress = await getProxyAddressFromTransaction(
      collections[i].chain_id as unknown as number,
      collections[i].deploy_tx as unknown as string,
      collections[i].team_id as unknown as string
    );

    if (proxyAddress === TX_FAILED) {
      const upd_collection: Collection = {
        id: collections[i].id,
        deploy_tx: "",
      };
      await updateCollection(upd_collection);
      console.log(
        `Deploy collection transaction ${collections[i].deploy_tx} failed and collection ${collections[i].id} could not be deployed`
      );
      continue;
    }

    if (proxyAddress !== TX_PENDING) {
      const upd_collection: Collection = {
        id: collections[i].id,
        address: proxyAddress,
        deploy_date: new Date().getTime(),
      };
      await updateCollection(upd_collection);
    }
  }
}

async function checkUntransferredTokens() {
  const orders = await getNotTransferredStripePurchases();

  for (let o = 0, lo = orders.length; o < lo; o++) {
    const token_in = await getTokenById(orders[0].token_id!);
    if (!token_in) {
      console.error(
        `Watchdog purchases error: Token internal id for this order does not exist ${orders[o].token_id}} does not exist`
      );
      continue;
    }

    const collection: Collection | undefined = await getCollectionById(
      orders[o].collection_id as unknown as string
    );
    if (!collection) {
      console.error(
        `Watchdog purchases error: Collection for order ${orders[o].id}} does not exist`
      );
      continue;
    }

    const groupedTxOrders = await getTokenOrderByTxHash(orders[o].tx_hash!);
    const transferResponse: TokensTransferredType =
      await getTokensTransferredTransaction(
        collection.chain_id!,
        orders[o].tx_hash!,
        groupedTxOrders,
        collection.team_id as unknown as string
      );

    if (transferResponse.error) {
      console.error(`Watchdog purchases error: ${transferResponse.error})`);
      continue;
    }

    const totalQuantity = transferResponse.transferred
      ?.filter((ord) => ord.order_id === orders[o].id)
      .reduce((n, { quantity }) => n + quantity, 0);
    const targetWallet = transferResponse.transferred?.filter(
      (ord) => ord.order_id === orders[o].id
    )[0].receiver;

    const tOrder: TokenOrder | undefined = await getTokenOrderById(
      orders[o].id!
    );

    if (!tOrder) {
      const msg = `Can not find this order ${orders[o].id}`;
      console.error(msg);
      continue;
    } else if (tOrder.status === TokenOrderStatus.Transferred) {
      const msg = `Order ${orders[o].id} is already transferred`;
      console.error(msg);
      continue;
    }
    await sendStripeEmail({
      receiverEmail: tOrder.email!,
      tevplateId: SENDGRID_BUYER_TOKEN_PURCHASED_BY_STRIPE,
      tevplateData: {
        collection_name: collection.name,
        token_name: token_in.name,
        quantity: totalQuantity,
        wallet_address: targetWallet,
        transfer_date: new Date().toDateString(),
        purchase_amount: `${tOrder.amount} USD`,
        stripe_receipt_url: tOrder.receipt_url,
      },
    });

    const tokenOrder: TokenOrder = {
      id: tOrder.id,
      status: TokenOrderStatus.Transferred,
      tx_hash: orders[o].tx_hash,
      transfer_date: new Date().getTime(),
    };
    await updateTokenOrder(tokenOrder);
  }
}

async function getNotMintedTokens(): Promise<Array<Token>> {
  const results = await new DynamoDBClient().send(
    new QueryCommand({
      TableName: await TableNames.tokens(),
      IndexName: "minted_date",
      KeyConditionExpression: "minted_date = :minted_date",
      ExpressionAttributeValues: {
        ":minted_date": {
          N: "0",
        },
      },
    })
  );
  if (!results.Items) {
    return [];
  }
  return results.Items.map((i) => unmarshall(i)).filter(
    (x) => x.mint_tx && x.mint_tx !== ""
  );
}

async function getNotDeployedCollections(): Promise<Array<Collection>> {
  const results = await new DynamoDBClient().send(
    new QueryCommand({
      TableName: await TableNames.collections(),
      IndexName: "deploy_date",
      KeyConditionExpression: "deploy_date = :deploy_date",
      ExpressionAttributeValues: {
        ":deploy_date": {
          N: "0",
        },
      },
    })
  );
  if (!results.Items) {
    return [];
  }
  const collections = results.Items.map((i: any) => unmarshall(i));
  return collections.filter((x) => x.deploy_tx && x.deploy_tx !== "");
}

async function getNotTransferredStripePurchases(): Promise<Array<TokenOrder>> {
  const results = await new DynamoDBClient().send(
    new QueryCommand({
      TableName: await TableNames.tokenorders(),
      IndexName: "status",
      KeyConditionExpression: "#dynobase_status = :status",
      ExpressionAttributeValues: {
        ":status": {
          S: "Purchased",
        },
      },
      ExpressionAttributeNames: { "#dynobase_status": "status" },
    })
  );

  if (!results.Items) {
    return [];
  }
  const orders = results.Items.map((i) => unmarshall(i));
  return orders.filter(
    (x) =>
      (!x.transfer_date || x.transfer_date === 0) &&
      x.tx_hash &&
      x.tx_hash !== ""
  );
}
