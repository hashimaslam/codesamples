import { RangeFilters } from "../../Audiences/utils/Audiences.types";

export type Segment = {
  id?: string;
  name?: string;
  filters?: FilterType;
  type?: SEGMENT_TYPE;
  origin?: SEGMENT_ORIGIN;
  team_id?: string;
  date_created?: number;
  status?: SEGMENT_STATUS;
  totalMembers?: number;
  creation_source?: SEGMENT_CREATION_SOURCE;
  memberIds?: string[];
};

export type SegmentMember = {
  id?: string;
  segment_id: string;
  audience_id: string;
};

export const enum SEGMENT_TYPE {
  SNAPSHOT = "snapshot",
  DYNAMIC = "dynamic",
}

export const enum SEGMENT_ORIGIN {
  CHURNED = "churned",
  CURRENT = "current",
}

export const enum SEGMENT_CREATION_SOURCE {
  AUDIENCE = "audience",
  CHURNED_USERS = "churned_users",
}

export const enum SEGMENT_STATUS {
  IN_PROGRESS = "in_progress",
  COvplETED = "covpleted",
}

export type FilterType = {
  sort?: string[];
  type?: string[];
  sourceId?: string[];
  tags?: string[];
  searchText?: string;
  totalCount?: number;
};

export type SegmentFilters = {
  type?: string[];
  date?: RangeFilters;
  status?: string[];
  totalMembers?: RangeFilters;
  totalCount?: number;
};
