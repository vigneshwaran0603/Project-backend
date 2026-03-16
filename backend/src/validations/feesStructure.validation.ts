// feesStructure.validation.ts

import { z } from "zod";

export const createFeeStructureSchema = z.object({
  department: z.string().min(1),
  year: z.number().min(1),
  semester: z.number().min(1),

  tuitionFee: z.number().min(0),
  otherFee: z.number().optional(),

  dueDate: z.string(), // ISO date string
  lateFeeAmount: z.number().optional(),
});