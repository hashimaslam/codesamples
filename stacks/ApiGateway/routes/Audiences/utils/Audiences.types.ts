export const MEMBER_TYPE = ["holder", "tech-partner", "commercial-partner"];

export type AudienceChainData = {
  chainId?: number;
  nfts?: number;
  ethBalance?: number;
  usdBalance?: number;
  ensName?: string;
  ensName_ignore_case?: string;
  allTimeTransactions?: number;
  firstTransactionDate?: number;
  lastTransactionDate?: number;
};

export type Audience = {
  id?: string;
  team_id?: string;
  type?: string;
  tags?: string[];
  email?: string;
  address?: string;
  sources?: string[];
  source_ids?: string[];
  social?: any;
  data?: AudienceChainData[]; //Data by network

  //Total across all networks
  nfts?: number;
  usdBalance?: number;
  allTimeTransactions?: number;
  firstTransactionDate?: number;
  lastTransactionDate?: number;

  //Churned data
  churned_at?: number;
  churned_duration?: number;

  //Timestamps
  createdAt?: number;
};

export type AudienceModel = keyof Audience;

export type AudienceHolding = {
  team_id?: string;
  audience_id?: string;
  name?: string;
  symbol?: string;
  balance?: number;
  balance24h?: number;
  quote?: number;
  quote24h?: number;
  chain_id?: number;
  contractAddress?: string;
  type?: string;
  last_transferred_at?: number;
  contract_decimals?: number;
};

export type AudienceFilters = {
  sort?: string[];
  sourceId?: string[];
  type?: string[];
  tags?: string[];
  searchText?: string;
  usdBalanceFrom?: string;
  usdBalanceTo?: string;
  allTimeTransactionsFrom?: string;
  allTimeTransactionsTo?: string;
  firstTransactionDateFrom?: string;
  firstTransactionDateTo?: string;
  lastTransactionDateFrom?: string;
  lastTransactionDateTo?: string;
  nftsFrom?: string;
  nftsTo?: string;
  rangeFilters?: RangeFilters[];
};

export type RangeFilters = {
  from?: number;
  to?: number;
  fieldName: string;
};

export const OS_MAX_WINDOW_SIZE = 1000000000;
export const OS_MAX_PAGINATION_LIMIT = 10000;
