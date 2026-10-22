import type { MaterialSourceType } from "@/core/storage";

export type MaterialInput = {
  title: string;
  sourceName: string;
  sourceType: MaterialSourceType;
  text: string;
};
