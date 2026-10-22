import Dexie, { type Table } from "dexie";
import type { Checkpoint, ProgressEvent, RememberedProvider, StoredOutput, StudySet } from "./types";

class StudyDatabase extends Dexie {
  studySets!: Table<StudySet, string>;
  rememberedProviders!: Table<RememberedProvider, string>;
  outputs!: Table<StoredOutput, string>;
  progressEvents!: Table<ProgressEvent, number>;
  checkpoints!: Table<Checkpoint, string>;

  constructor() {
    super("study-os");
    this.version(1).stores({
      studySets: "id, updatedAt, sourceType",
      rememberedProviders: "id, providerId, updatedAt",
    });
    this.version(2).stores({ outputs: "id, setId" });
    this.version(3).stores({ progressEvents: "++id, setId, at", checkpoints: "id, setId, updatedAt" });
  }
}

export const studyDatabase = new StudyDatabase();
