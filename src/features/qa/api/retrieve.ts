const STOP_WORDS = new Set(["the", "and", "for", "are", "was", "were", "what", "which", "who", "how", "why", "when", "where", "does", "did", "with", "that", "this", "from", "about", "into", "you", "your", "can", "has", "have", "its", "not"]);

// shortcut: plain keyword matching, no embeddings. Upgrade if students ask paraphrased questions that share no words with the notes.
export function retrieveChunks(chunks: string[], question: string, limit = 3) {
  const terms = [...new Set(question.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) ?? [])].filter((term) => !STOP_WORDS.has(term));
  if (!terms.length) return [];

  return chunks
    .map((chunk, index) => {
      const lower = chunk.toLowerCase();
      return { chunk, index, score: terms.filter((term) => lower.includes(term)).length };
    })
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .sort((a, b) => a.index - b.index)
    .map((candidate) => candidate.chunk);
}
