import { DynamoDB } from "aws-sdk";
import { TableNames } from "../../../../../shared/utils/TableNames";
import Stripe from "stripe";
import { Web3RpcProviders } from "../../../../../shared/utils/Constants";
import { DB } from "../../../../../shared/utils/DB";

export interface CompanyProfile {
  name: string;
  addressLine1: string;
  addressLine2: string;
  country: string;
  zipCode: string;
  vatNumber: string;
  email: string;
  phoneCountry: string;
  phoneNumber: string;
}

export interface Branding {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
}

export interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  webhook?: Stripe.WebhookEndpoint;
}

export type RPCEndpoint = {
  connectionTested: number;
  chainId: number;
  key: string; //URL for custom, apiKey for others
};

export type RPCProvider = {
  type: Web3RpcProviders;
  endpoints: RPCEndpoint[];
};

export type RPCProviderSetup = {
  selectedtype?: Web3RpcProviders;
  providers: RPCProvider[];
};

export async function getTeamConfig(
  teamId: string,
  category: "companyProfile" | "branding" | "stripe" | "rpcProvider" | string
) {
  const item = await new DynamoDB()
    .getItem({
      TableName: await TableNames.teamConfigurations(),
      Key: DynamoDB.Converter.marshall({
        team_id: teamId,
        key: category,
      }),
    })
    .promise();
  return item.Item ? DynamoDB.Converter.unmarshall(item.Item).value : undefined;
}

export async function storeTeamConfig(
  teamId: string,
  category: "companyProfile" | "branding" | "stripe" | "rpcProvider" | string,
  value: CompanyProfile | Branding | StripeConfig | RPCProviderSetup
) {
  await DB.write(await TableNames.teamConfigurations(), {
    team_id: teamId,
    key: `${category}`,
    value,
  });
}
