import { Request, ResponseToolkit } from "@hapi/hapi";

import { generateHallticketOperation, getMyHallticketOperation } from "../../operations/hallticket.operation";


export const generateHallticketHandler = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const { examName } = request.payload as any;

    const studentId = (request.pre as any).user._id;

    const result = await generateHallticketOperation(studentId, examName);

    return h.response(result).code(200);
  } catch (error: any) {
    return h.response({ message: error.message }).code(400);
  }
};



// export const downloadMyHallticketHandler = async (
//   request: any,
//   h: any
// ) => {
//   try {

//     const studentId = request.pre.user._id;

//     const result = await getMyHallticketOperation(studentId);

//     const pdfUrl = result.hallticketUrl;

//     /* -------- CHECK URL -------- */

//     if (!pdfUrl) {
//       throw new Error("Hallticket URL not found");
//     }

//     /* -------- FETCH PDF -------- */

//     const response = await axios.get(pdfUrl, {
//       responseType: "arraybuffer",
//     });

//     /* -------- SEND FILE -------- */

//     return h
//       .response(response.data)
//       .type("application/pdf")
//       .header(
//         "Content-Disposition",
//         `attachment; filename=hallticket_${studentId}.pdf`
//       );

//   } catch (error: any) {
//     return h.response({ message: error.message }).code(400);
//   }
// };
import axios from "axios";

import Student from "../../models/Student";
import Subject from "../../models/Subject";
import { generateHallticketPDF } from "../../utils/generateHallticketPDF";

export const downloadMyHallticketHandler = async (
  request: any,
  h: any
) => {
  try {

    const studentId = request.pre.user._id;

    const student = await Student.findById(studentId);

    if (!student) {
      throw new Error("Student not found");
    }

    const subjectDocs = await Subject.find({
      department: student.department,
      semester: student.sem,
    });

    const subjects = subjectDocs.map((s) => ({
      subjectCode: s.subjectCode,
      subjectName: s.title,
    }));

    const pdfBuffer = await generateHallticketPDF({
      collegeName: "Erode Arts and Science",
      examName: "End Semester Examination",
      hallticketNumber: `HT-${student.registerNo}`,
      studentName: student.name,
      registerNumber: student.registerNo,
      department: student.department,
      semester: student.sem,
      subjects,
    });

    return h
      .response(pdfBuffer)
      .type("application/pdf")
      .header(
        "Content-Disposition",
        `attachment; filename=hallticket_${student.registerNo}.pdf`
      );

  } catch (error: any) {

    console.log("Download error:", error);

    return h.response({
      message: error.message
    }).code(400);

  }
};






export const getMyHallticketHandler = async (
  request: any,
  h: any
) => {
  try {

    const studentId = request.pre.user._id;

    const result = await getMyHallticketOperation(studentId);

    return h.response(result).code(200);

  } catch (error: any) {
    return h.response({ message: error.message }).code(400);
  }
};