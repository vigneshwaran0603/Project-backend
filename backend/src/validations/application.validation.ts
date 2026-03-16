// application/validation.ts
import { z } from "zod";

// Schema for submitting a student application
export const submitApplicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string(),
  department: z.string().min(1, "Department is required"),
  community: z.string(),
  twelthMark: z.number(),
  // marksheet will be validated separately in handler (file type/size)
});

// Type inferred from schema
export type CreateApplicationInput = z.infer<typeof submitApplicationSchema>;



export const updateApplicationStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export type UpdateApplicationStatusInput = z.infer<
  typeof updateApplicationStatusSchema
>;