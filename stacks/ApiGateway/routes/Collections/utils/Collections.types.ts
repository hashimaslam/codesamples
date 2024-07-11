import { SupportedContractTypes } from "../../../../../shared/utils/Constants";
import { Branding } from "../../Tenants/utils/Tenants";

export type CollectionMetadata = {
  name?: string;
  symbol?: string;
  baseURI?: string;
};

export type CheckoutConditions = {
  isEnabled?: boolean;
  isStripeEnabled?: boolean;
  cryptoSupply?: number;
  currency?: string;
  currency_symbol?: string;
  allowListId?: string; //If exists overrides these conditions object values
  pricePerToken?: number;
  stripeReserve?: number;
  cryptoClaimed?: number;
  branding?: Branding;
  tokenPreviewImage?: string;
  isAllowListItem?: boolean; // To find out if the user is in the allow list or not (if allowListId exists)
  allowListNotes?: string;
};

export type Collection = {
  id?: string;
  team_id?: string;
  user_id?: string;
  chain_id?: number;
  address?: string;
  totalSupply?: string;
  maxSupply?: string;
  owner?: string;
  name?: string;
  description?: string;
  externalURL?: string;
  avatar?: string;
  royalties?: number;
  royalties_receiver?: string;
  metadata?: CollectionMetadata;
  deploy_tx?: string;
  deploy_date?: number;
  platform_fee_bps?: string;
  platform_fee_recipient?: string;
  primary_sale_recipient?: string;
  tags?: string[];
  contract_type?: SupportedContractTypes;
  checkoutConditions?: CheckoutConditions;
  stripe_publishable_key?: string;
  stripe_secret_key?: string;
  remove_image?: boolean;
  created_at?: number;
  tevplate_id?: string;
  tevplate_name?: string;
  airdrop_contract_address?: string;
};
