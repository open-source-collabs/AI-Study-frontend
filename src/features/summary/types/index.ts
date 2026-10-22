import { z } from "zod";

export const summarySchema = z.object({
  title: z.string().min(1),
  overview: z.string().min(1),
  sections: z.array(z.object({ heading: z.string().min(1), points: z.array(z.string().min(1)).min(1) })).min(1),
});

export type Summary = z.infer<typeof summarySchema>;
