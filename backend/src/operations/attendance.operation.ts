// attendace.operation.ts

import { Attendance } from "../models/Attendance";
import { Types } from "mongoose";


import Student from "../models/Student";// or Student model (use your correct model name)
import User from "../models/User";

/**
 * 1️⃣ Get Students For Attendance (Staff Dashboard)
 */
export const getStudentsForAttendance = async (
  staffId: string,
  year: number
) => {
  const staff = await User.findById(staffId);

  if (!staff || staff.role !== "staff") {
    throw new Error("Unauthorized");
  }

  const students = await Student.find({
    role: "student",
    department: staff.department,
    year,
  }).select("_id name department year");

  return students;
};

/**
 * 2️⃣ Mark Attendance
 */
export const markAttendanceOperation = async (
  staffId: string,
  year: number,
  date: string,
  records: { studentId: string; status: "present" | "absent" }[]
) => {
  const staff = await User.findById(staffId);

  if (!staff || staff.role !== "staff") {
    throw new Error("Unauthorized");
  }

  const attendanceDate = new Date(date);

//   const results: never[] = [];
const results = [];

  for (const record of records) {
    const student = await Student.findById(record.studentId);

    if (!student) continue;

    // 🔐 Department security check
    if (student.department !== staff.department) {
      throw new Error("You can only mark attendance for your department");
    }

    // 🚫 Duplicate prevention (extra safety)
    const existing = await Attendance.findOne({
      studentId: record.studentId,
      date: attendanceDate,
    });

    if (existing) {
      throw new Error(
        `Attendance already marked for student ${student.name}`
      );
    }

    const attendance = await Attendance.create({
      studentId: record.studentId,
      department: student.department,
      year: student.year,
      date: attendanceDate,
      status: record.status,
      markedBy: new Types.ObjectId(staffId),
    });

    results.push(attendance);
  }

  return results;
};

/**
 * 3️⃣ Get Attendance of One Student
 */
export const getStudentAttendanceOperation = async (
  requester: any,
  studentId: string
) => {

  const student = await Student.findById(studentId);

  if (!student) {
    throw new Error("Student not found");
  }

  // 🔐 Access control

  if (requester.role === "student" && requester._id.toString() !== studentId) {
    throw new Error("You can only view your own attendance");
  }

  if (
    requester.role === "staff" &&
    requester.department !== student.department
  ) {
    throw new Error("Access denied");
  }

  const records = await Attendance.find({ studentId }).sort({ date: -1 });

  const total = records.length;
  const present = records.filter((r) => r.status === "present").length;
  const absent = total - present;

  return {
    totalDays: total,
    presentDays: present,
    absentDays: absent,
    records,
  };
};
/**
 * 4️⃣ Calculate Attendance Percentage
 */
export const calculatePercentageOperation = async (
  requesterId: string,
  studentId: string
) => {
  const attendanceData = await getStudentAttendanceOperation(
    requesterId,
    studentId
  );

  const percentage =
    attendanceData.totalDays === 0
      ? 0
      : (attendanceData.presentDays / attendanceData.totalDays) * 100;

  return {
    totalDays: attendanceData.totalDays,
    presentDays: attendanceData.presentDays,
    percentage: Number(percentage.toFixed(2)),
  };
};

/**
 * 5️⃣ 75% Hall Ticket Eligibility
 */
export const checkEligibilityOperation = async (
  requesterId: string,
  studentId: string
) => {
  const percentageData = await calculatePercentageOperation(
    requesterId,
    studentId
  );

  const eligible = percentageData.percentage >= 75;

  return {
    ...percentageData,
    eligibleForHallTicket: eligible,
    message: eligible
      ? "Eligible for hall ticket"
      : "Attendance below 75%. Hall ticket cannot be generated.",
  };
};