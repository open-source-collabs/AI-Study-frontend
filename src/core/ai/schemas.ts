import { z } from "zod";

export const providerIdSchema = z.enum(["openrouter", "groq", "gemini"]);
