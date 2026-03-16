


// new
import mongoose, { Schema, Document } from "mongoose";

export interface IFeesPayment extends Document {
  student: mongoose.Types.ObjectId;
  department: string;
  year: number;
  semester: number;

  feeBreakdown: {
    tuitionFee: number;
    otherFee: number;
    // libraryFee: number;
    examFee: number;
    condinationFee: number;
  };

  attendancePercentage: number;
  totalAmount: number;

  stripeSessionId?: string;

  paymentStatus: "PENDING" | "PAID" | "FAILED";

  receiptNumber?: string;
  receiptUrl?: string;

  paidAt?: Date;
}

const feesPaymentSchema = new Schema<IFeesPayment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
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

    semester: {
      type: Number,
      required: true,
    },

    feeBreakdown: {
      tuitionFee: { type: Number, required: true },
      otherFee: { type: Number, required: true },

      examFee: { type: Number, required: true },
      condinationFee: { type: Number, default: 0 },
    },

    attendancePercentage: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    stripeSessionId: {
      type: String,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    receiptUrl: {
      type: String,
    },

    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);


// 🔥 UNIQUE CONSTRAINT
// feesPaymentSchema.index(
//   { student: 1, semester: -1 },
//   { unique: false }
// );

export default mongoose.model<IFeesPayment>(
  "FeesPayment",
  feesPaymentSchema
);