import Hallticket from "../models/Hallticket";
import Student from "../models/Student";
import Subject from "../models/Subject";
import FeesPayment from "../models/FeesPayment";

import { generateHallticketPDF } from "../utils/generateHallticketPDF";

import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { calculatePercentageOperation } from "./attendance.operation";



export const generateHallticketOperation = async (
  studentId: string,
  examName: string
) => {

  /* -----------------------------
     1️⃣ CHECK STUDENT
  ------------------------------ */
console.log("studnet id:",studentId);
  const student = await Student.findById(studentId);

  if (!student) {
    throw new Error("Student not found");
  }


  /* -----------------------------
     2️⃣ CHECK FEES PAYMENT
  ------------------------------ */

  const payment = await FeesPayment.findOne({
    student:studentId,
    paymentStatus: "PAID",
  });

  if (!payment) {
    throw new Error(
      "Exam fees not paid. Hallticket cannot be generated."
    );
  }


/* -----------------------------
   3️⃣ CHECK ATTENDANCE
-------------------------------- */

// const attendance = await calculatePercentageOperation(
//   studentId,
//   studentId
// );

// if (attendance.percentage < 75) {
//   throw new Error(
//     "Attendance below 75%. Not eligible for hallticket."
//   );
// }


  /* -----------------------------
     4️⃣ CHECK EXISTING HALLTICKET
  ------------------------------ */

//   const existingHallticket = await Hallticket.findOne({ studentId });

//   if (existingHallticket) {
//     return {
//       message: "Hallticket already generated",
//       hallticketUrl: existingHallticket.hallticketUrl,
//     };
//   }


  /* -----------------------------
     5️⃣ FETCH SUBJECTS
  ------------------------------ */

  const subjectDocs = await Subject.find({
    department: student.department,
    semester: student.sem,
  });

  if (!subjectDocs.length) {
    throw new Error("Subjects not found for this semester");
  }

  const subjects = subjectDocs.map((s) => ({
    subjectCode: s.subjectCode,
    subjectName: s.title,
  }));


  /* -----------------------------
     6️⃣ GENERATE HALLTICKET NUMBER
  ------------------------------ */

  const hallticketNumber = `HT-${student.registerNo}-${Date.now()}`;


  /* -----------------------------
     7️⃣ GENERATE PDF
  ------------------------------ */

  const pdfBuffer = await generateHallticketPDF({
    collegeName: "ABC College of Arts and Science",
    examName,
    hallticketNumber,
    studentName: student.name,
    registerNumber: student.registerNo,
    department: student.department,
    semester: student.sem,
    subjects,
  });


  /* -----------------------------
     8️⃣ UPLOAD PDF TO CLOUDINARY
  ------------------------------ */

//   const uploadResult: any = await new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: "halltickets",
//         resource_type: "raw",
//         public_id: `hallticket_${student.registerNo}`,
//         format: "pdf",
//       },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result);
//       }
//     );

//     streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
//   });







// new
const uploadResult: any = await new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "halltickets",
      resource_type: "raw",
      public_id: `hallticket_${student.registerNo}`,
      format: "pdf",
      type: "upload",
      access_mode: "public",
    },
    (error, result) => {
      if (error) return reject(error);
      resolve(result);
    }
  );

  const bufferStream = streamifier.createReadStream(pdfBuffer);
  bufferStream.on("error", reject);
  bufferStream.pipe(uploadStream);
});
console.log("PDF buffer size:", pdfBuffer.length);


  /* -----------------------------
     9️⃣ SAVE HALLTICKET
  ------------------------------ */

  const hallticket = await Hallticket.create({
    studentId,
    hallticketNumber,
    examName,
    subjects,
    hallticketUrl: uploadResult.secure_url,
  });


  /* -----------------------------
     🔟 RETURN RESPONSE
  ------------------------------ */

  return {
    message: "Hallticket generated successfully",
    hallticketUrl: hallticket.hallticketUrl,
  };
};







export const getMyHallticketOperation = async (studentId: string) => {

  const hallticket = await Hallticket.findOne({ studentId });

  if (!hallticket) {
    throw new Error("Hallticket not generated yet");
  }

  return {
    message: "Hallticket fetched successfully",
    hallticketUrl: hallticket.hallticketUrl,
  };
};

