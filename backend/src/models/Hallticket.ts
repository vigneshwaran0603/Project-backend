import mongoose from "mongoose";

const HallticketSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },

    hallticketNumber: {
      type: String,
      required: true,
      unique: true,
    },

    examName: {
      type: String,
      required: true,
    },

    subjects: [
      {
        subjectCode: String,
        subjectName: String,
      },
    ],

    hallticketUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hallticket", HallticketSchema);