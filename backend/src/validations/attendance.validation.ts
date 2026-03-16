// attendance.validation.ts
import { z } from "zod";

export const markAttendanceSchema = z.object({
  year: z.number().min(1).max(4),

  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),

  records: z
    .array(
      z.object({
        studentId: z.string().min(1),
        status: z.enum(["present", "absent"]),
      })
    )
    .min(1),
});