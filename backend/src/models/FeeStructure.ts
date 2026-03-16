// models/FeeStructure.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IFeeStructure extends Document {
  department: string;
  year: number;
  semester: number;

  tuitionFee: number;
  otherFee: number; // optional (lab/library/etc)

  totalAmount: number;

  dueDate: Date;
  lateFeeAmount: number;

  createdBy: mongoose.Types.ObjectId;
}

const FeeStructureSchema = new Schema<IFeeStructure>(
  {
    department: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    semester: {
      type: Number,
      required: true,
    },

    tuitionFee: {
      type: Number,
      required: true,
    },

    otherFee: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    lateFeeAmount: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// 🔒 Prevent duplicate structure for same dept/year/semester
FeeStructureSchema.index(
  { department: 1, year: 1, semester: 1 },
  { unique: true }
);

export default mongoose.model<IFeeStructure>(
  "FeeStructure",
  FeeStructureSchema
);