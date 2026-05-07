export type Formatting = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  fontSize: number;
  fontColor: string;
};

export type Note = {
  _id?: string;
  id?: string;
  userId?: string;
  type: string;
  title: string;
  text: string | string[];
  formatting?: Formatting;
  createdAt?: string | number;
  updatedAt?: string | number;
  favorite?: boolean;
};

export type ViewMode = "list" | "folder" | "timeline" | "favorites" | "graph";
export type SortMode = "default" | "az" | "za" | "favorites";
