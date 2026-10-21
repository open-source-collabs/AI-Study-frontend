import type { MaterialSourceType, StudySet } from "@/core/storage";

export type MaterialInput = {
  title: string;
  sourceName: string;
  sourceType: MaterialSourceType;
  text: string;
};

export type MaterialResult = StudySet;
