
// import { z } from "zod";

// export const createSessionSchema = z.object({
//   semester: z.number(),
// });

// export const verifySessionSchema = z.object({
//   sessionId: z.string(),
// });









// new
import { z } from "zod";

/**
 * Validation for calculating fees
 */
export const calculateFeesSchema = z.object({
  department: z.string().min(2, "Department is required"),
  year: z.number().min(1, "Year must be at least 1"),
  semester: z.number().min(1, "Semester must be at least 1"),
});

/**
 * Validation for creating Stripe session
 * (No amount accepted from frontend for security)
 */
export const createPaymentSessionSchema = z.object({
  department: z.string().min(2),
  year: z.number().min(1),
  semester: z.number().min(1),
});

/**
 * Type exports for TypeScript safety
 */
export type CalculateFeesInput = z.infer<typeof calculateFeesSchema>;
export type CreatePaymentSessionInput = z.infer<
  typeof createPaymentSessionSchema
>;