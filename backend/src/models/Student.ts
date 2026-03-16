// models/Student.ts
import { Schema, model } from "mongoose";

const studentSchema = new Schema({
 
role: { type: String, required: true },
  name: {type: String,required: true,},

  email: {type: String,required: true,},

  phone: {type: String,required: true,},

  department: { type: String, required: true,},
  year: { type: Number, required: true,},
  sem: { type: Number, required: true,},
  dob: { type: String, required: true,},
   registerNo: { type: String, unique: true, required: true },
  password: { type: String, required: true },

//   community: {
//     type: String,
//     required: true,
//   },

//   twelthMark: {
//     type: Number,
//     required: true,
//   },

  

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("Student", studentSchema);