const DEFAULT_CHUNK_SIZE = 4000;

export function chunkText(text: string, chunkSize = DEFAULT_CHUNK_SIZE) {
  const normalized = text.trim();
  if (!normalized) return [];
  if (chunkSize < 1) throw new Error("Chunk size must be greater than zero.");

  const chunks: string[] = [];
  for (let index = 0; index < normalized.length; index += chunkSize) {
    chunks.push(normalized.slice(index, index + chunkSize));
  }
  return chunks;
}
