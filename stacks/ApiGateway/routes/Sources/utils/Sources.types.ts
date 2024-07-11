export type Source = {
  id?: string;
  team_id?: string;
  address?: string;
  source_name?: string;
  chain_id?: number;
  type?: SOURCE_TYPE;
  symbol?: string;
  createdAt?: number;
  membersCount?: number;
};

export type SourceFilters = {
  chainId: string[];
  type: string[];
  symbol: string[];
  offset: number;
  limit: number;
};

export const enum SOURCE_TYPE {
  MANUAL = "manual",
  CSV = "csv",
  CONTRACT = "contract",
  FORM = "form",
}

export const COVALENTHQ_PAGE_SIZE = 1000;
