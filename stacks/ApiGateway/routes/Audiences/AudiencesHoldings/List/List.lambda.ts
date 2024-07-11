import { APIGatewayProxyEvent } from "aws-lambda";
import {
  apiResponse,
  middlewares,
} from "../../../../../../shared/utils/middlewares";
import { UserRole, getTeamOfUser } from "../../../Users/utils/Users";
import { Audience, AudienceHolding } from "../../utils/Audiences.types";
import { getAudienceById } from "../../utils/Audiences";
import {
  CHAIN_IDS,
  CHAIN_NAMES,
} from "../../../../../../shared/utils/AudienceDataProviders/AudienceDataProviders.types";
import { getCovalentAPIKey } from "../../../../../../shared/utils/AudienceDataProviders/Covalenthq.utils";
import { getAddresTokensData } from "../../../../../../shared/utils/AudienceDataProviders/Covalenthq.Ingester";
import { getLogger } from "../../../../../../shared/utils/middlewares/getLogger";

interface Request extends Omit<APIGatewayProxyEvent, "requestContext"> {
  requestContext: {
    authorizer: {
      claims: {
        sub: string;
      };
    };
  };
}

const ivplementation = async (event: Request) => {
  const userId = event.requestContext.authorizer.claims.sub;
  const team = await getTeamOfUser(userId);
  const audience_id = event.pathParameters?.id as string;

  if (team.role != UserRole.ADMIN && team.role !== UserRole.EDITOR) {
    return apiResponse(
      401,
      JSON.stringify({
        error:
          "Sorry, you are not an admin/editor. You cannot view audience holdings",
      })
    );
  }

  let audience: Audience | undefined = await getAudienceById(audience_id);

  if (!audience || audience.team_id !== team.teamId) {
    return apiResponse(
      400,
      JSON.stringify({
        error: "This audience does not exist or it is not managed by your team",
      })
    );
  }
  const errors: string[] = [];
  const apiKey = await getCovalentAPIKey();
  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  const address = audience?.address as unknown as string;
  const chaineddata: any[] = await Promise.all(
    CHAIN_IDS.map(async (chainId: number) => {
      return await getAddresTokensData(CHAIN_NAMES[chainId], address, headers);
    })
  );

  const aHoldings: AudienceHolding[] = [];

  for (const cdata of chaineddata) {
    if (cdata.error) {
      getLogger().error(cdata.error);
      errors.push(cdata.error);
      continue;
    }
    if (cdata.NFTbalances?.error) {
      getLogger().error(cdata.NFTbalances?.error);
      errors.push(cdata.NFTbalances?.error);
    }
    if (cdata.NFTbalances?.data?.items) {
      for (let t = 0; t < cdata.NFTbalances.data.items.length; t++) {
        let type = "";
        if (
          cdata.NFTbalances.data.items[t].supports_erc?.indexOf("erc721") !== -1
        ) {
          type = "ERC-721";
        } else if (
          cdata.NFTbalances.data.items[t].supports_erc?.indexOf("erc1155") !==
          -1
        ) {
          type = "ERC-1155";
        } else if (
          cdata.NFTbalances.data.items[t].supports_erc?.indexOf("erc20") !== -1
        ) {
          console.error(
            "----------DBG: Detected NFT supporting ERC-20 but not supporting NTF standard"
          );
          continue;
          //type = "ERC-20";
        }

        const audienceHolding: AudienceHolding = {
          chain_id: cdata.chainId,
          team_id: audience?.team_id as unknown as string,
          audience_id: audience.id as unknown as string,
          name: cdata.NFTbalances.data.items[t].contract_name,
          symbol: cdata.NFTbalances.data.items[t].contract_ticker_symbol,
          balance: Number(cdata.NFTbalances.data.items[t].balance),
          balance24h: Number(cdata.NFTbalances.data.items[t].balance_24h),
          contractAddress: cdata.NFTbalances.data.items[t].contract_address,
          last_transferred_at:
            cdata.balance?.data.items[t]?.last_transferred_at,
          type: type,
        };
        aHoldings.push(audienceHolding);
      }
    }
    if (cdata.balance?.error) {
      getLogger().error(cdata.balance?.error);
      errors.push(cdata.balance?.error);
    }
    if (cdata.balance?.data?.items) {
      for (let c = 0; c < cdata.balance.data.items.length; c++) {
        if (
          !cdata.balance.data.items[c].native_token ||
          !Boolean(cdata.balance.data.items[c].native_token)
        ) {
          const audienceHolding: AudienceHolding = {
            chain_id: cdata.chainId,
            team_id: audience?.team_id as unknown as string,
            audience_id: audience.id as unknown as string,
            name: cdata.balance.data.items[c].contract_name,
            symbol: cdata.balance.data.items[c].contract_ticker_symbol,
            balance:
              Number(cdata.balance.data.items[c].balance) /
              Math.pow(10, cdata.balance.data.items[c].contract_decimals),
            balance24h:
              Number(cdata.balance.data.items[c].balance_24h) /
              Math.pow(10, cdata.balance.data.items[c].contract_decimals),
            quote: Number(cdata.balance.data.items[c].quote),
            quote24h: Number(cdata.balance.data.items[c].quote24h),
            contractAddress: cdata.balance.data.items[c].contract_address,
            last_transferred_at:
              cdata.balance.data.items[c]?.last_transferred_at,
            type:
              cdata.balance.data.items[c].supports_erc?.indexOf("erc20") != -1
                ? "ERC-20"
                : "",
            contract_decimals: cdata.balance.data.items[c].contract_decimals,
          };
          aHoldings.push(audienceHolding);
        }
      }
    }
  }

  return apiResponse(
    200,
    JSON.stringify({
      holdings: aHoldings,
      absoluteCount: aHoldings.length,
      errors: errors.length === 0 ? undefined : errors,
    })
  );
};

export const handler: any = middlewares(ivplementation);
