// admin/createStaff /handler.ts

import bcrypt from "bcryptjs";
import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  createUser,
  findUserByEmail,
  findAllStaff,
  findStaffByDepartment,
  findStaffByEmail,
  updateStaffByEmail,
  deleteStaffByEmail,
} from "../../../operations/user.operation";
import { createStaffSchema } from "../../../validations/user.validation";
import { IUser } from "../../../models/User";


// 🔹 CREATE STAFF
export const createStaffHandler = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const result = createStaffSchema.safeParse(req.payload);

    if (!result.success) {
      return h.response({ error: result.error.issues }).code(400);
    }

    const { email, password, department } = result.data;

    const exists = await findUserByEmail(email);
    if (exists) {
      return h.response({ message: "Staff already exists" }).code(409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser({
      role: "staff", // ✅ forced role
      email,
      password: hashedPassword,
      department,
    });

    return h.response({
      message: "Staff created successfully",
      department,
    }).code(201);

  } catch (error) {
    console.error("Create Staff Error:", error);
    return h.response({ message: "Internal Server Error" }).code(500);
  }
};


// 🔹 GET ALL STAFF
export const getAllStaffHandler = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const staff = await findAllStaff();
    return h.response(staff).code(200);
  } catch (error) {
    console.error("Get All Staff Error:", error);
    return h.response({ message: "Internal Server Error" }).code(500);
  }
};


// 🔹 GET STAFF BY DEPARTMENT
export const getStaffByDepartmentHandler = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const { department } = req.params;

    const staff = await findStaffByDepartment(department);

    return h.response(staff).code(200);
  } catch (error) {
    console.error("Get Staff By Department Error:", error);
    return h.response({ message: "Internal Server Error" }).code(500);
  }
};


// 🔹 GET STAFF BY EMAIL
export const getStaffByEmailHandler = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const { email } = req.params;

    const staff = await findStaffByEmail(email);

    if (!staff) {
      return h.response({ message: "Staff not found" }).code(404);
    }

    return h.response(staff).code(200);

  } catch (error) {
    console.error("Get Staff By Email Error:", error);
    return h.response({ message: "Internal Server Error" }).code(500);
  }
};


// 🔹 UPDATE STAFF
export const updateStaffHandler = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const { email } = req.params;
    const updateData = req.payload as Partial<IUser>;

    // ❌ Prevent role modification
    if ((updateData as any).role) {
      delete (updateData as any).role;
    }

    // ❌ If password is updated → hash it
    if ((updateData as any).password) {
      (updateData as any).password = await bcrypt.hash(
        (updateData as any).password,
        10
      );
    }

    const updatedStaff = await updateStaffByEmail(email, updateData);

    if (!updatedStaff) {
      return h.response({ message: "Staff not found" }).code(404);
    }

    return h.response({
      message: "Staff updated successfully",
      updatedStaff,
    }).code(200);

  } catch (error) {
    console.error("Update Staff Error:", error);
    return h.response({ message: "Internal Server Error" }).code(500);
  }
};


// 🔹 DELETE STAFF
export const deleteStaffHandler = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const { email } = req.params;

    const deleted = await deleteStaffByEmail(email);

    if (!deleted) {
      return h.response({ message: "Staff not found" }).code(404);
    }

    return h.response({
      message: "Staff deleted successfully",
    }).code(200);

  } catch (error) {
    console.error("Delete Staff Error:", error);
    return h.response({ message: "Internal Server Error" }).code(500);
  }
};
