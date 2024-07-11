export type Note = {
  id?: string;
  team_id?: string;
  audience_id?: string;
  note_content?: string;
  timestamp?: number;
  updated_at?: number;
};

export const MAX_NOTE_SIZE = 10000;
