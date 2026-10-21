import { studyDatabase } from "./db";
import type { RememberedProvider, StudySet } from "./types";

export type { MaterialSourceType, RememberedProvider, StudySet } from "./types";

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
  async remove(providerId: string) {
    await studyDatabase.rememberedProviders.where("providerId").equals(providerId).delete();
  },
};
