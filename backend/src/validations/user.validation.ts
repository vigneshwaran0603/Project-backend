// user.validation.ts

import { z } from "zod";

export const createStaffSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  department: z.string().min(2),
});

// export const createStudentSchema = z.object({
//   registerNo: z.string(),
//   dob: z.string(),
// });

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
