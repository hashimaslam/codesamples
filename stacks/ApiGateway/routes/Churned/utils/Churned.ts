import {
  formatShortDate,
  shortTimeAgo,
} from "../../../../../shared/utils/DateTime";
import { Audience } from "../../Audiences/utils/Audiences.types";

export function reconcileChurnedDBtoCSV(data: Audience[]): any[] {
  const ret: any[] = [];
  for (const churnedaudience of data) {
    let ftd = null;
    let ltd = null;
    if (
      churnedaudience.firstTransactionDate &&
      churnedaudience.firstTransactionDate > 0
    ) {
      ftd = new Date(churnedaudience.firstTransactionDate * 1000);
    }
    if (
      churnedaudience.lastTransactionDate &&
      churnedaudience.lastTransactionDate > 0
    ) {
      ltd = new Date(churnedaudience.lastTransactionDate * 1000);
    }

    let rChurned: any = {
      Address: churnedaudience.address,
      Email: churnedaudience.email,
      WalletAge: ftd === null ? undefined : shortTimeAgo(ftd),
      ChurnedOn: churnedaudience.churned_at,
      ChurnedDuration: churnedaudience.churned_duration,
      NFTPortfolio: churnedaudience.nfts,
      USDBalance: churnedaudience.usdBalance?.toLocaleString("fullwide", {
        useGrouping: false,
      }),
      Source: churnedaudience.sources?.join(";"),
      FirstTransactionDate: ftd === null ? undefined : formatShortDate(ftd),
      LastTransactionDate: ltd === null ? undefined : formatShortDate(ltd),
    };
    ret.push(rChurned);
  }
  return ret;
}
