// subject/handler.ts

import Student from "../../models/Student";
import Subject from "../../models/Subject";
import User from "../../models/User";

import {
  createSubjectOperation,
  updateSubjectOperation,
  deleteSubjectOperation,
  calculateExamFeesOperation,
} from "../../operations/subject.operation";

import {
  createSubjectSchema,
  updateSubjectSchema,
} from "../../validations/subject.validation";


// =============================
// CREATE SUBJECT
// =============================

export const createSubjectHandler = async (request: any, h: any) => {
  try {

    const user = request.pre.user;

    if (!user) {
      return h.response({ error: "User not found in request" }).code(400);
    }

    const payload = createSubjectSchema.parse(request.payload);

    const subject = await createSubjectOperation(payload, user._id);

    return h.response({
      message: "Subject created successfully",
      data: subject,
    }).code(201);

  } catch (error: any) {

    console.error("CREATE SUBJECT ERROR:", error);

    return h.response({ error: error.message }).code(400);

  }
};


// =============================
// UPDATE SUBJECT
// =============================

export const updateSubjectHandler = async (request: any, h: any) => {
  try {

    const { id } = request.params; // ✅ FIXED

    const payload = updateSubjectSchema.parse(request.payload);

    const subject = await updateSubjectOperation(id, payload);

    if (!subject) {
      return h.response({ error: "Subject not found" }).code(404);
    }

    return h.response({
      message: "Subject updated successfully",
      data: subject,
    }).code(200);

  } catch (error: any) {

    console.error("UPDATE SUBJECT ERROR:", error);

    return h.response({ error: error.message }).code(400);

  }
};


// =============================
// DELETE SUBJECT
// =============================

export const deleteSubjectHandler = async (request: any, h: any) => {
  try {

    const { id } = request.params; // ✅ FIXED

    const deleted = await deleteSubjectOperation(id);

    if (!deleted) {
      return h.response({ error: "Subject not found" }).code(404);
    }

    return h.response({
      message: "Subject deleted successfully",
    }).code(200);

  } catch (error: any) {

    console.error("DELETE SUBJECT ERROR:", error);

    return h.response({ error: error.message }).code(500);

  }
};



// =============================
// GET SUBJECTS
// =============================

export const getSubjectsHandler = async (request: any, h: any) => {
  try {

    const user = request.pre.user;

    if (!user) {
      return h.response({ error: "User not found in request" }).code(400);
    }

    // =========================
    // STUDENT FLOW
    // =========================

    if (user.role === "student") {

      const student = await Student.findById(user._id);

      if (!student) {
        return h.response({ error: "Student not found" }).code(404);
      }

      const subjects = await Subject.find({
        department: student.department,
        year: student.year,
        semester: student.sem,
      }).sort({ subjectCode: 1 });

      const formattedSubjects = subjects.map((sub: any) => ({
        _id: sub._id,
        title: sub.title,
        subjectCode: sub.subjectCode,
        department: sub.department,
        year: sub.year,
        semester: sub.semester,
        fees: sub.fees,
      }));

      const totalExamFees = formattedSubjects.reduce(
        (sum: number, s: any) => sum + s.fees,
        0
      );

      return h.response({
        message: "Subjects fetched successfully",
        department: student.department,
        year: student.year,
        sem: student.sem,
        subjects: formattedSubjects,
        totalExamFees,
      }).code(200);

    }

    // =========================
    // STAFF FLOW
    // =========================

    if (user.role === "staff") {

      const staff = await User.findById(user._id);

      if (!staff) {
        return h.response({ error: "Staff not found" }).code(404);
      }

      const subjects = await Subject.find({
        department: staff.department,
      }).sort({ year: 1, semester: 1 });

      const formattedSubjects = subjects.map((sub: any) => ({
        _id: sub._id,
        title: sub.title,
        subjectCode: sub.subjectCode,
        department: sub.department,
        year: sub.year,
        semester: sub.semester,
        fees: sub.fees,
      }));

      const totalExamFees = formattedSubjects.reduce(
        (sum: number, s: any) => sum + s.fees,
        0
      );

      return h.response({
        message: "Subjects fetched successfully",
        department: staff.department,
        year: null,
        semester: null,
        subjects: formattedSubjects,
        totalExamFees,
      }).code(200);

    }

    return h.response({ error: "Unauthorized role" }).code(403);

  } catch (error: any) {

    console.error("GET SUBJECTS ERROR:", error);

    return h.response({ error: error.message }).code(500);

  }
};