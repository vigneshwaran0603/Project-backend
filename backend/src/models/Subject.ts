// models/Subjects.ts

import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISubject extends Document {
  title: string;
  subjectCode: string;
  department: string;
  year: number;
  semester: number;
  fees: number;
  createdBy: Types.ObjectId;
}

const SubjectSchema = new Schema<ISubject>(
  {
    title: { type: String, required: true },
    subjectCode: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    year: { type: Number, required: true },
    semester: { type: Number, required: true },
    fees: { type: Number, required: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISubject>("Subject", SubjectSchema);