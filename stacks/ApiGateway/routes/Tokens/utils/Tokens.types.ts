import Stripe from "stripe";

export const enum TokenOrderType {
  Crypto = "Crypto",
  Stripe = "Stripe",
}

export const enum TokenOrderStatus {
  Claimed = "Claimed",
  Purchased = "Purchased",
  Transferred = "Transferred",
}

export type TokenAttribute = {
  name: string;
  value: string;
};

export type Token = {
  id?: string;
  tokenID?: number;
  endTokenID?: number;
  collection_id?: string;
  collection_name?: string;
  chain_id?: number;
  team_id?: string;
  name?: string;
  description?: string;
  youtube_url?: string;
  external_url?: string;
  animation_url?: string;
  decimals?: number; //ERC1155 metadata covpliant
  image?: string;
  attributes?: TokenAttribute[];
  mktplace_options?: boolean;
  mktplace_front?: boolean;
  mktplace_option?: string;
  minted_date?: number;
  mint_tx?: string;
  remove_video?: boolean;
  created_at?: number;
};

export type TokenOrder = {
  id?: string;
  stripe_event?: Stripe.Event; //Only Stripe field
  tx_hash?: string;
  transfer_date?: number; //Only Stripe field
  date?: number;
  wallet?: string;
  type?: TokenOrderType;
  status?: TokenOrderStatus;
  amount?: number;
  quantity?: number;
  unit_price?: number;
  collection_id?: string;
  token_id?: string; //Internal token uuid
  currency?: string;
  email?: string; //Only Stripe field
  receipt_url?: string; //Only Stripe field
};

export type TransferRequest = {
  tx_hash: string;
  order_id: string[];
};
