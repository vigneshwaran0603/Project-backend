// models/User.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  role: "student" | "staff" | "admin";
  // registerNo?: string;
  email?: string;
  password: string;
  department?: string;
//   dob?: string;
}

const UserSchema = new Schema<IUser>(
  {
    role: { type: String, required: true },
    // registerNo: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    department: { type: String },
    // dob: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
