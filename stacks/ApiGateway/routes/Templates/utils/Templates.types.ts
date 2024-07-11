export type TevplateAttribute = {
  name: string;
  type: string;
  default_value: string;
};

export type Tevplate = {
  id?: string;
  name: string;
  description?: string;
  attributes: TevplateAttribute[];
  team_id: string;
  created_time?: string;
  updated_time?: string;
  user_id?: string;
};
