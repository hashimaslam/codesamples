import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuid } from "uuid";
import { DynamoDB } from "aws-sdk";
import { isAddress } from "ethers/lib/utils";
import { isValidChainId } from "../../../../../shared/utils/Web3";
import { apiResponse } from "../../../../../shared/utils/middlewares";
import { TableNames } from "../../../../../shared/utils/TableNames";
import { DB } from "../../../../../shared/utils/DB";

type Request = {
  address: string;
  chain_id: number;
};

export const handler: APIGatewayProxyHandler = async (event) => {
  const { address, chain_id } = JSON.parse(event.body || "{}") as Request;
  const userId = event.requestContext.authorizer?.claims.sub as string;

  if (!address || !isAddress(address)) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Invalid 'address' provided" })
    );
  }

  if (!chain_id || isNaN(chain_id) || !isValidChainId(Number(chain_id))) {
    return apiResponse(
      400,
      JSON.stringify({ error: "Invalid 'chain_id' provided" })
    );
  }

  if (await walletExists(chain_id, address)) {
    //Don't force 400 error, as this method is called each time users connect their wallets
    return apiResponse(
      200,
      JSON.stringify({ error: "Wallet already exists for this chain_id" })
    );
  }

  const connection_id = await createWalletConnection(userId, address, chain_id);

  return apiResponse(200, JSON.stringify({ id: connection_id }));
};

async function createWalletConnection(
  userId: string,
  address: string,
  chainId: number
) {
  const id = uuid();
  await DB.write(await TableNames.walletcollections(), {
    id,
    user_id: userId,
    team_id: "test", // @TODO Resolve team ID from the user ID
    address,
    chain_id: chainId,
  });
  return id;
}

async function walletExists(
  chainId: number,
  address: string
): Promise<boolean> {
  const results = await new DynamoDB()
    .query({
      TableName: await TableNames.walletcollections(),
      FilterExpression: "chain_id = :chain_id AND address = :address",
      ExpressionAttributeValues: DynamoDB.Converter.marshall({
        ":chain_id": chainId,
        ":address": address,
      }),
    })
    .promise();

  return !!results.Items;
}
