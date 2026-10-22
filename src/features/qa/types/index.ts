import { z } from "zod";

export const qaSchema = z.object({
  answer: z.string().min(1),
  quotes: z.array(z.string().min(1)).max(3),
});

export type Exchange = {
  id: number;
  question: string;
  status: "asking" | "done" | "error";
  answer?: string;
  // Passages confirmed to exist in the material. Empty means the answer could not be tied to a passage.
  sources?: string[];
  error?: string;
};
