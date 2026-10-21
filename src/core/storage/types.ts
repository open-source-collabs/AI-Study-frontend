export type MaterialSourceType = "text" | "pdf";

export type StudySet = {
  id: string;
  title: string;
  sourceName: string;
  sourceType: MaterialSourceType;
  text: string;
  chunks: string[];
  createdAt: number;
  updatedAt: number;
};

export type RememberedProvider = {
  id: string;
  providerId: string;
  apiKey: string;
  model: string;
  updatedAt: number;
};
