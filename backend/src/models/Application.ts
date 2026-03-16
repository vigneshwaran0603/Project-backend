// models/Application.ts
import { Schema, model } from "mongoose";

const applicationSchema = new Schema({
  applicationNo: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  department: {
    type: String,
    required: true,
  },

  community: {
    type: String,
    required: true,
  },

  twelthMark: {
    type: Number,
    required: true,
  },

  marksheetUrl: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("Application", applicationSchema);