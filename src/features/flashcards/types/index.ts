import { z } from "zod";

export const flashcardsSchema = z.object({
  cards: z.array(z.object({ front: z.string().min(1), back: z.string().min(1) })).min(1).max(50),
});

export type Flashcards = z.infer<typeof flashcardsSchema>;
