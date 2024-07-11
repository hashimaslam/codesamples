import { ERC20Token } from "../../../../../shared/utils/Web3";
import { Branding } from "../../Tenants/utils/Tenants";

export const enum AllowListStatus {
  READY = "Ready",
  DRAFT = "Draft",
}

export const enum AllowListItemStatus {
  CLAIMED = "Claimed",
  NOT_CLAIMED = "Not Claimed",
}

export type AllowList = {
  id?: string;
  team_id?: string;
  start_date?: number;
  end_date?: number;
  status?: AllowListStatus;
  collection_id?: string;
  collection_name?: string;
  chain_id?: number;
  name?: string;
  notes?: string;
  wallet_count?: number;
  supply?: number;
  branding?: Branding;
};

export type AllowListItem = {
  id?: string;
  allow_list_id?: string;
  currency?: ERC20Token;
  address: string;
  max_claimable: number;
  tokens_owned: number;
  email?: string;
  price: number;
  status?: AllowListItemStatus;
};
