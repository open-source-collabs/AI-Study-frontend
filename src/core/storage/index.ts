import { studyDatabase } from "./db";
import { latestCardMarks } from "./progress";
import type { Checkpoint, OutputKind, ProgressEventData, RememberedProvider, StudySet } from "./types";

export type { Checkpoint, CheckpointMode, MaterialSourceType, OutputKind, ProgressEvent, ProgressEventData, RememberedProvider, StoredOutput, StudySet } from "./types";
export { latestCardMarks } from "./progress";

export const progressRepository = {
  async record(setId: string, data: ProgressEventData) {
    await studyDatabase.progressEvents.add({ ...data, setId, at: Date.now() });
  },
  // Oldest first (auto-increment id order), which latestCardMarks relies on.
  all() {
    return studyDatabase.progressEvents.toArray();
  },
  async cardMarks(setId: string) {
    return latestCardMarks(await studyDatabase.progressEvents.where("setId").equals(setId).toArray());
  },
};

export const checkpointRepository = {
  get(setId: string, mode: Checkpoint["mode"]) {
    return studyDatabase.checkpoints.get(`${setId}:${mode}`);
  },
  async save(checkpoint: Omit<Checkpoint, "id" | "updatedAt">) {
    await studyDatabase.checkpoints.put({ ...checkpoint, id: `${checkpoint.setId}:${checkpoint.mode}`, updatedAt: Date.now() });
  },
  async clear(setId: string, mode: Checkpoint["mode"]) {
    await studyDatabase.checkpoints.delete(`${setId}:${mode}`);
  },
  latest() {
    return studyDatabase.checkpoints.orderBy("updatedAt").last();
  },
};

export const outputRepository = {
  get(setId: string, kind: OutputKind) {
    return studyDatabase.outputs.get(`${setId}:${kind}`);
  },
  async put(setId: string, kind: OutputKind, data: unknown) {
    await studyDatabase.outputs.put({ id: `${setId}:${kind}`, setId, kind, data, createdAt: Date.now() });
  },
};

export const studySetRepository = {
  async add(studySet: StudySet) {
    await studyDatabase.studySets.put(studySet);
    return studySet;
  },
  async list() {
    return studyDatabase.studySets.orderBy("updatedAt").reverse().toArray();
  },
  async get(id: string) {
    return studyDatabase.studySets.get(id);
  },
};

export const providerCredentialRepository = {
  async save(credential: RememberedProvider) {
    await studyDatabase.rememberedProviders.put(credential);
  },
  async get(providerId: string) {
    return studyDatabase.rememberedProviders.where("providerId").equals(providerId).first();
  },
  // The most recently saved provider, so a reload can pick the student's provider back up.
  async latest() {
    return studyDatabase.rememberedProviders.orderBy("updatedAt").last();
  },
  async remove(providerId: string) {
    await studyDatabase.rememberedProviders.where("providerId").equals(providerId).delete();
  },
};
 