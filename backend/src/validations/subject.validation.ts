// subject.validation.ts

import { z } from "zod";

export const createSubjectSchema = z.object({
  title: z.string().min(3),
  subjectCode: z.string().min(3),
  department: z.string().min(2),
  year: z.number().min(1),
  semester: z.number().min(1),
  fees: z.number().positive(),
});

export const updateSubjectSchema = z.object({
  title: z.string().min(3).optional(),
  subjectCode: z.string().min(3).optional(),
  department: z.string().min(2).optional(),
  year: z.number().min(1).optional(),
  semester: z.number().min(1).optional(),
  fees: z.number().positive().optional(),
});