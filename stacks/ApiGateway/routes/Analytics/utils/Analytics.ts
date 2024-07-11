import { computeDaysInWallet } from "../../../../../shared/utils/AudienceDataProviders/Covalenthq.utils";
import { TableNames } from "../../../../../shared/utils/TableNames";
import { getAudienceById } from "../../Audiences/utils/Audiences";
import { Audience } from "../../Audiences/utils/Audiences.types";

export async function getDaysInWallet(
  audienceId: string,
  contractAddress: string,
  chainId: number
): Promise<number> {
  const audience: Audience | undefined = await getAudienceById(audienceId);
  const [olderOwn, amount] = await computeDaysInWallet(
    audience?.address!,
    contractAddress,
    chainId
  );
  return amount;
}
