import { RangeFilters } from "../../Audiences/utils/Audiences.types";

export type Form = {
  name?: string;
  title?: string;
  description?: string;
  start?: number;
  end?: number;
  cta_text?: string;
  scheduled_message?: string;
  success_message?: string;
  max_member_size?: number;

  // Styling
  logo_path?: string;
  outer_background?: string;
  outer_color?: string;
  inner_background?: string;
  inner_color?: string;
  cta_background?: string;
  cta_color?: string;
  requirements?: Requirements;

  // Meta information
  id?: string;
  id_user?: string;
  id_team?: string;
  createdAt?: number;
  updatedAt?: number;
  totalSubmissions?: number;
  firstSubmission?: number;
  lastSubmission?: number;
  status?: FORM_STATUS;
  form_url?: string;
  source_id?: string;
};

export type Requirements = {
  requiredFields: SupportedRequiredFields[];
  minRequiredBalances: RequiredBalance[];
};

export type RequiredBalance = {
  network: number;
  minRequired: number;
  address?: string;
  contractType?: CONTRACT_TYPE;
};

export type SupportedRequiredFields = "email" | "captcha";

export enum FORM_STATUS {
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished",
  DRAFT = "draft",
}

export enum CONTRACT_TYPE {
  ERC1155 = "ERC-1155",
  ERC721 = "ERC-721",
  ERC20 = "ERC-20",
}

export type FormFilters = {
  status?: string[];
  rangeFilters?: RangeFilters[];
  sourceId?: string;
};

export type FormModel = keyof Form;

export const FORM_BASE_URL =
  "https://balloon-balloon-theta.vercel.app/app/audiences/";

// Secret Key
export const SECRET_KEY = "6LcrDzEpAAAAAJJ4jRSdFmd7BcpiiMTbmcYYyW5N";
export const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export const DECIMAL_PRECISION = 4;
