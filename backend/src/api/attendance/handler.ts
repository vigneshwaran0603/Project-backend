// attendacne /handler.ts 


import {
  getStudentsForAttendance,
  markAttendanceOperation,
  getStudentAttendanceOperation,
  calculatePercentageOperation,
  checkEligibilityOperation,
} from "../../operations/attendance.operation";
import { markAttendanceSchema } from "../../validations/attendance.validation";

/**
 * 1️⃣ Get Students (Staff Dashboard)
 */
export const getStudentsHandler = async (request: any, h: any) => {
  try {
    const user = request.pre.user; // ✅ FIXED

    if (!user || !user._id) {
      return h.response({ message: "Unauthorized" }).code(401);
    }

    const staffId = user._id;
    const year = Number(request.query.year);

    if (!year) {
      return h.response({ message: "Year is required" }).code(400);
    }

    const students = await getStudentsForAttendance(staffId, year);

    return h.response({
      message: "Students fetched successfully",
      data: students,
    }).code(200);
  } catch (error: any) {
    return h.response({ message: error.message }).code(400);
  }
};

/**
 * 2️⃣ Mark Attendance
 */
export const markAttendanceHandler = async (request: any, h: any) => {
  try {
    const user = request.pre.user; // ✅ FIXED

    if (!user || !user._id) {
      return h.response({ message: "Unauthorized" }).code(401);
    }

    const staffId = user._id;

    const parsed = markAttendanceSchema.parse(request.payload);

    const result = await markAttendanceOperation(
      staffId,
      parsed.year,
      parsed.date,
      parsed.records
    );

    return h.response({
      message: "Attendance marked successfully",
      data: result,
    }).code(201);
  } catch (error: any) {
    return h.response({
      message: error.message || "Failed to mark attendance",
    }).code(400);
  }
};

/**
 * 3️⃣ Get Student Attendance
 */
export const getStudentAttendanceHandler = async (request: any, h: any) => {
  try {

    const user = request.pre.user;

    if (!user || !user._id) {
      return h.response({ message: "Unauthorized" }).code(401);
    }

    const requesterId = user._id;

    // ✅ FIXED HERE
    const studentId = request.params.id;

    const result = await getStudentAttendanceOperation(
      requesterId,
      studentId
    );

    return h.response({
      message: "Attendance fetched successfully",
      data: result,
    }).code(200);

  } catch (error: any) {
    return h.response({ message: error.message }).code(400);
  }
};

/**
 * 4️⃣ Get Attendance Percentage
 */
export const getAttendancePercentageHandler = async (
  request: any,
  h: any
) => {
  try {
    const user = request.pre.user; // ✅ FIXED

    if (!user || !user._id) {
      return h.response({ message: "Unauthorized" }).code(401);
    }

    const requesterId = user._id;
    const studentId  = request.params.id;

    const result = await calculatePercentageOperation(
      requesterId,
      studentId
    );

    return h.response({
      message: "Attendance percentage calculated",
      data: result,
    }).code(200);
  } catch (error: any) {
    return h.response({ message: error.message }).code(400);
  }
};

/**
 * 5️⃣ Hall Ticket Eligibility
 */
export const getEligibilityHandler = async (request: any, h: any) => {
  try {
    const user = request.pre.user; // ✅ FIXED

    if (!user || !user._id) {
      return h.response({ message: "Unauthorized" }).code(401);
    }

    const requesterId = user._id;
    const studentId = request.params.id;

    const result = await checkEligibilityOperation(
      requesterId,
      studentId
    );

    return h.response({
      message: "Eligibility status checked",
      data: result,
    }).code(200);
  } catch (error: any) {
    return h.response({ message: error.message }).code(400);
  }
};