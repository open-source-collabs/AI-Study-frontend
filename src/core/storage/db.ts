import Dexie, { type Table } from "dexie";
import type { RememberedProvider, StudySet } from "./types";

class StudyDatabase extends Dexie {
  studySets!: Table<StudySet, string>;
  rememberedProviders!: Table<RememberedProvider, string>;

  constructor() {
    super("study-os");
    this.version(1).stores({
      studySets: "id, updatedAt, sourceType",
      rememberedProviders: "id, providerId, updatedAt",
    });
  }
}

export const studyDatabase = new StudyDatabase();
