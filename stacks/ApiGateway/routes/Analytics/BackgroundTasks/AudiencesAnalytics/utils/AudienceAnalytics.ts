import {
  CHAIN_NAMES,
  COVALENTHQ_API_PATH,
} from "../../../../../../../shared/utils/AudienceDataProviders/AudienceDataProviders.types";
import { getCovalentAPIKey } from "../../../../../../../shared/utils/AudienceDataProviders/Covalenthq.utils";
import { getErrorMessage } from "../../../../../../../shared/utils/Common";
import fetch from "node-fetch";
import { getLogger } from "../../../../../../../shared/utils/middlewares/getLogger";
import { OS_MAX_PAGINATION_LIMIT } from "../../../../Audiences/utils/Audiences.types";
import { OpenSearchClient } from "../../../../../../../shared/utils/OpenSearch/OpenSearchClient";
import { TableNames } from "../../../../../../../shared/utils/TableNames";
import { OpenSearchIndexManager } from "../../../../../../../shared/utils/OpenSearch/OpenSearchIndexManager";

export async function fetchTradingVolumeFromCovalent(
  chain_id: number,
  contractAddress: string,
  noOfDays?: number
): Promise<{ data: any }> {
  const covalenthqApiKey = await getCovalentAPIKey();
  let data: any;

  const headers = {
    Authorization: `Bearer ${covalenthqApiKey}`,
    Accept: "application/json",
  };

  try {
    const url = `${COVALENTHQ_API_PATH}/${
      CHAIN_NAMES[chain_id]
    }/nft_market/${contractAddress}/volume/?days=${noOfDays ?? 2}`;

    const request = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    data = await request.json();
  } catch (err) {
    getLogger().error(`Something unexpected happened: ${getErrorMessage(err)}`);
  }

  return { data };
}
