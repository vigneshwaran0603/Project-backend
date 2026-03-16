// staff/createStudent/handler.ts

import bcrypt from "bcryptjs";
import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  findStudentByRegisterNo,
  createStudent,
  findAllStudents,
  findStudentsByDepartment,
  updateStudentByRegisterNo,
  deleteStudentByRegisterNo,
} from "../../../operations/student.operation";

import { createStudentSchema } from "../../../validations/student.validation";


// 🔹 CREATE STUDENT
export const createStudentHandler = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const result = createStudentSchema.safeParse(req.payload);

    if (!result.success) {
      return h.response({ error: result.error.issues }).code(400);
    }

    const {
      name,
      phone,
      department,
      year,
      sem,
      email,
      dob,
      registerNo,
      password,
    } = result.data;

    const exists = await findStudentByRegisterNo(registerNo);
    if (exists) {
      return h.response({ message: "Student already exists" }).code(409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createStudent({
      role: "student", // ✅ forced
      name,
      phone,
      department,
      year,
      sem,
      email,
      dob,
      registerNo,
      password: hashedPassword,
    });

    return h.response({
      message: "Student created successfully",
    }).code(201);

  } catch (error) {
    console.error("Create Student Error:", error);
    return h.response({ message: "Internal Server Error" }).code(500);
  }
};


// 🔹 GET ALL STUDENTS
export const getAllStudentsHandler = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const students = await findAllStudents();
    return h.response(students).code(200);
  } catch (error) {
    console.error("Get All Students Error:", error);
    return h.response({ message: "Internal Server Error" }).code(500);
  }
};


// 🔹 GET STUDENT BY REGISTER NO
export const getStudentByRegisterNoHandler = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const { registerNo } = req.params;

    const student = await findStudentByRegisterNo(registerNo);

    if (!student) {
      return h.response({ message: "Student not found" }).code(404);
    }

    return h.response(student).code(200);

  } catch (error) {
    console.error("Get Student Error:", error);
    return h.response({ message: "Internal Server Error" }).code(500);
  }
};


// 🔹 GET STUDENTS BY DEPARTMENT
export const getStudentsByDepartmentHandler = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const { department } = req.params;

    const students = await findStudentsByDepartment(department);

    return h.response(students).code(200);

  } catch (error) {
    console.error("Get Students By Department Error:", error);
    return h.response({ message: "Internal Server Error" }).code(500);
  }
};


// 🔹 UPDATE STUDENT
export const updateStudentHandler = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const { registerNo } = req.params;

    const updateData = req.payload as any;

    // ❌ Prevent role change
    if (updateData.role) {
      delete updateData.role;
    }

    // 🔐 Hash password if updated
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedStudent = await updateStudentByRegisterNo(
      registerNo,
      updateData
    );

    if (!updatedStudent) {
      return h.response({ message: "Student not found" }).code(404);
    }

    return h.response({
      message: "Student updated successfully",
      updatedStudent,
    }).code(200);

  } catch (error) {
    console.error("Update Student Error:", error);
    return h.response({ message: "Internal Server Error" }).code(500);
  }
};


// 🔹 DELETE STUDENT
export const deleteStudentHandler = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const { registerNo } = req.params;

    const deletedStudent = await deleteStudentByRegisterNo(registerNo);

    if (!deletedStudent) {
      return h.response({ message: "Student not found" }).code(404);
    }

    return h.response({
      message: "Student deleted successfully",
    }).code(200);

  } catch (error) {
    console.error("Delete Student Error:", error);
    return h.response({ message: "Internal Server Error" }).code(500);
  }
};
