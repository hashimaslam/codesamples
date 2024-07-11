import { APIGatewayProxyEvent } from "aws-lambda";
import {
  apiResponse,
  middlewares,
} from "../../../../../shared/utils/middlewares";
import { computeDaysInWallet } from "../../../../../shared/utils/AudienceDataProviders/Covalenthq.utils";
import {
  getCheckSumAddress,
  isAddress,
  isValidChainId,
} from "../../../../../shared/utils/Web3";
import { getSourceByAddress } from "../../Sources/utils/Sources";

interface Request extends Omit<APIGatewayProxyEvent, "requestContext"> {
  requestContext: {
    authorizer: {
      claims: {
        sub: string;
      };
    };
  };
}

type ANALYTICS_METRIC =
  | "tokens_sold"
  | "tokens_created"
  | "tokens_listed"
  | "tokens_airdropped"
  | "collections_created"
  | "total_mint_time"
  | "trading_volume"
  | "items_count"
  | "holders_count"
  | "avg_purchase_price"
  | "mint_floor_diff"
  | "top_holders"
  | "most_loyal_holder"
  | "collection_crossover"
  | "current_floor_price"
  | "avg_holding_duration"
  | "total_trades"
  | "churned_wallets"
  | "new_holders"
  | "lowest_purchase_price"
  | "highest_purchase_price"
  | "days_in_wallet";

// How to group the numbers
type ANALYTICS_GROUPING = "daily" | "weekly" | "monthly" | "yearly";

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer.claims.sub;
  const queries = event.pathParameters;

  const metric = event.queryStringParameters?.metric as ANALYTICS_METRIC;

  // How to group the returned data. Daily grouping means one returned datapoint will represent one day
  const grouping = event.queryStringParameters?.grouping as ANALYTICS_GROUPING;

  // How many data points to return
  const datapoints = event.queryStringParameters?.datapoints
    ? Number(event.queryStringParameters?.datapoints)
    : 1;

  const compare_to_previous =
    event.queryStringParameters?.compare_to_previous === "true";

  // Make sure there are boundaries to how much data points can be requested from this endpoint
  // to avoid too much computing
  switch (grouping) {
    case "daily":
      if (datapoints <= 0 || datapoints > 30) {
        return apiResponse(
          400,
          JSON.stringify({
            error:
              "Daily grouping can only return between 1 and 30 datapoints (up to a month of data)",
          })
        );
      }
      break;
    case "weekly":
      if (datapoints <= 0 || datapoints > 52) {
        return apiResponse(
          400,
          JSON.stringify({
            error:
              "Weekly grouping can only return between 1 and 52 datapoints (up to a year of data)",
          })
        );
      }
      break;
    case "monthly":
      if (datapoints <= 0 || datapoints > 12) {
        return apiResponse(
          400,
          JSON.stringify({
            error:
              "Monthly grouping can only return between 1 and 12 datapoints (up to a year of data)",
          })
        );
      }
      break;
    case "yearly":
      if (datapoints <= 0 || datapoints > 10) {
        return apiResponse(
          400,
          JSON.stringify({
            error:
              "Yearly grouping can only return between 1 and 10 datapoints (up to 10 years of data)",
          })
        );
      }
      break;
    default:
    //return apiResponse(400, JSON.stringify({ error: "Invalid grouping" }));
  }

  switch (metric) {
    case "tokens_created":
      // @TODO ivplement - query OpenSearch index that contains aggregates
      return apiResponse(
        200,
        JSON.stringify({
          data: {
            current_period: [10, 20, 30, 40, 30],
            previous_period: compare_to_previous
              ? [30, 20, 10, 40, 20]
              : undefined,
          },
          percentage_change: compare_to_previous ? -20 : undefined,
        })
      );
    case "days_in_wallet":
      const address = event.queryStringParameters?.address;
      const contract_address = event.queryStringParameters?.contract_address;
      const chain_id = event.queryStringParameters?.chain_id;

      if (!address || !isAddress(address)) {
        return apiResponse(
          400,
          JSON.stringify({ error: "Missing holder address" })
        );
      }
      if (!contract_address || !isAddress(contract_address)) {
        return apiResponse(
          400,
          JSON.stringify({ error: "Missing or wrong contract address" })
        );
      }
      if (!chain_id || !isValidChainId(Number(chain_id))) {
        return apiResponse(
          400,
          JSON.stringify({ error: "Missing or wrong chain id" })
        );
      }
      const sources = await getSourceByAddress(
        getCheckSumAddress(contract_address)
      );
      if (sources.length === 0) {
        return apiResponse(
          400,
          JSON.stringify({ error: "Missing or wrong chain id" })
        );
      }
      const [first_purchased_at, days_in_wallet] = await computeDaysInWallet(
        address,
        contract_address!,
        Number(chain_id)
      );
      return apiResponse(
        200,
        JSON.stringify({
          data: {
            days_in_wallet,
          },
        })
      );
    default: {
      return apiResponse(400, JSON.stringify({ error: "Invalid metric" }));
    }
  }
};

export const handler: any = middlewares(ivplementation);
