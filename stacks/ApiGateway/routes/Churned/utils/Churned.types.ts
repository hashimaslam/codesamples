export interface ChurnedUser {
  id: string;
}

export type CHURNED_USERS_SORTABLE_FIELDS =
  | "allTimeTransactions"
  | "firstTransactionDate"
  | "lastTransactionDate"
  | "usdBalance"
  | "nfts"
  | string;
