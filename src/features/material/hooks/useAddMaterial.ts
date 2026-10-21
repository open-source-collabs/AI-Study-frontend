"use client";

import { useState } from "react";
import { studySetRepository } from "@/core/storage";
import { createId } from "@/core/utils/id";
import { chunkText } from "../api/chunk";
import { extractTextFromFile } from "../api/extract";
import type { MaterialInput } from "../types";

export function useAddMaterial() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addMaterial(input: MaterialInput) {
    setIsSaving(true);
    setError(null);
    try {
      const text = input.text.trim();
      if (!text) throw new Error("Add some text before saving this study set.");
      const now = Date.now();
      const studySet = {
        id: createId("set"),
        title: input.title.trim() || input.sourceName.replace(/\.[^.]+$/, "") || "Untitled study set",
        sourceName: input.sourceName,
        sourceType: input.sourceType,
        text,
        chunks: chunkText(text),
        createdAt: now,
        updatedAt: now,
      };
      await studySetRepository.add(studySet);
      return studySet;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Could not save this study set.";
      setError(message);
      throw cause;
    } finally {
      setIsSaving(false);
    }
  }

  async function addFile(file: File, title: string) {
    const text = await extractTextFromFile(file);
    return addMaterial({ title, sourceName: file.name, sourceType: file.name.toLowerCase().endsWith(".pdf") ? "pdf" : "text", text });
  }

  return { addFile, addMaterial, error, isSaving };
}
