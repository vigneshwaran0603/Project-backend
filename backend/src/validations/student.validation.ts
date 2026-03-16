// student.validation.ts

import { z } from "zod";

export const createStudentSchema = z.object({
     name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  department: z.string().min(2),
  year: z.number(),
  sem: z.number(),
   registerNo: z.string(),
   dob: z.string(),
   password: z.string(),
});


