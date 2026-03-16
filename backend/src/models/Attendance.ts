// models/attendance.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance extends Document {
  studentId: mongoose.Types.ObjectId;
  department: string;
  year: number;
  date: Date;
  status: "present" | "absent";
  markedBy: mongoose.Types.ObjectId; // staffId
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student", // or Student (based on your model name)
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent"],
      required: true,
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Prevent duplicate attendance
 * Same student + same date should not exist
 */
AttendanceSchema.index(
  { studentId: 1, date: 1 },
  { unique: true }
);

export const Attendance = mongoose.model<IAttendance>(
  "Attendance",
  AttendanceSchema
);