import { Handler } from "aws-lambda";
import { OpenSearchClient } from "../../../../../../../shared/utils/OpenSearch/OpenSearchClient";
import { OpenSearchIndexManager } from "../../../../../../../shared/utils/OpenSearch/OpenSearchIndexManager";
import { TableNames } from "../../../../../../../shared/utils/TableNames";
import { OS_MAX_PAGINATION_LIMIT } from "../../../../Audiences/utils/Audiences.types";
import {
  getAllSources,
  getSourcesDataFromOpensearch,
} from "../../../../Sources/utils/Sources";
import { SOURCE_TYPE, Source } from "../../../../Sources/utils/Sources.types";
import { fetchTradingVolumeFromCovalent } from "../utils/AudienceAnalytics";

export const handler: Handler = async (event) => {
  // First lets create the index if needed
  const os = await OpenSearchClient.getInstance();
  const index = (await TableNames.tradingVolume()).toLowerCase();
  await OpenSearchIndexManager.createIndexIfNeeded(index);

  const fetchForYear = event.fetchForYear;

  // Once the index is created, lets fetch the contract addresses from sources
  const sources = await getAllSources();

  if (sources.length === 0) {
    return;
  }

  await Promise.all(
    sources.map(async (ele: Source) => {
      const tradingVolumeData = await fetchTradingVolumeFromCovalent(
        ele.chain_id!,
        ele.address!,
        fetchForYear ? 365 : 2
      );

      if (!tradingVolumeData.data.error) {
        try {
          for (
            let i = tradingVolumeData.data.data.items.length - 1;
            i >= 0;
            i--
          ) {
            const id = `${Date.parse(
              tradingVolumeData.data.data.items[i].date
            ).toString()}-${tradingVolumeData.data.data.address}-${
              tradingVolumeData.data.data.quote_currency
            }`;

            // We are sure that the last item in the response from the covalent has the current date data.
            const result = await os.index({
              id,
              index,
              body: tradingVolumeData.data.data.items[i],
            });

            if (!fetchForYear) {
              break;
            }
          }
        } catch (err) {
          return;
        }
      }
    })
  );
};
