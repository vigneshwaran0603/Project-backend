import { z } from "zod";

export const hallticketSchema = z.object({
  examName: z.string().min(3, "Exam name required"),
});