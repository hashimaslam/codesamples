import { getAllSources } from "../../../../Sources/utils/Sources";
import {
  abiERC721Enumerable,
  getWeb3RpcProvider,
} from "../../../../../../../shared/utils/Web3";
import { getLogger } from "../../../../../../../shared/utils/middlewares/getLogger";
import { ethers } from "ethers";
import { OpenSearchIndexManager } from "../../../../../../../shared/utils/OpenSearch/OpenSearchIndexManager";
import { OpenSearchClient } from "../../../../../../../shared/utils/OpenSearch/OpenSearchClient";

const _cachedProviders = new Map<string, ethers.providers.Provider>();

/**
 * Get a web3 provider for this team and Chain from cache, or from DB and fill the cache for future invocations.
 * This is a useful optimization for Teams that predominantly work with the same Chain and have multiple collections in that Chain.
 * In that case,the method would fill the cache just once and return from the cache afterward.
 */
async function getCachedRpcProvider(
  chainId: number,
  teamId: string
): Promise<ethers.providers.Provider | undefined> {
  const key = `${teamId}_${chainId}`;
  if (_cachedProviders.has(key)) {
    return _cachedProviders.get(key);
  }

  const provider = await getWeb3RpcProvider(chainId, teamId);
  if (!provider) {
    return undefined;
  }
  _cachedProviders.set(key, provider);
  return provider;
}

export const handler = async () => {
  const sources = await getAllSources();

  await OpenSearchIndexManager.createIndexIfNeeded(
    await OpenSearchIndexManager.computeFullIndexName("tokens-created-daily")
  );
  const os = await OpenSearchClient.getInstance();

  for (let source of sources) {
    if (!source.address || !source.chain_id) {
      // getLogger().warn(`Source has no address or chain_id: ${source.id}. Skipping`)
      continue;
    }

    const chainId = source.chain_id!;
    const teamId = source.team_id!;
    const address = source.address!;

    const provider = await getCachedRpcProvider(chainId, teamId);

    if (!provider) {
      getLogger().warn(
        `Could not get provider for source ${source.id}. Skipping`
      );
      continue;
    }

    const contractERC721 = new ethers.Contract(
      address,
      abiERC721Enumerable,
      provider
    );
    let totalSupply: ethers.BigNumber = await contractERC721.totalSupply();

    // If the total supply is >1 million, we're probably dealing with a contract that has a lot of spam tokens,
    // so we'll round down to 1 million
    if (totalSupply.gt(ethers.BigNumber.from(9000))) {
      totalSupply = ethers.BigNumber.from(5);
    }

    console.log(totalSupply.toString(), "totalSupply");

    // @TODO Figure out the right OpenSearch index structure for how to store this number in a way that's efficient to aggregate daily/weekly/monthly

    // os.index({
    //     index: await OpenSearchIndexManager.computeFullIndexName('tokens-created-daily'),
    //     body: {
    //         sourceId: source.id,
    //         totalSupply: totalSupply.toString(),
    //         timestamp: Date.now(),
    //     },
    // });
  }
  return {};
};
