// user.operation.ts

import User, { IUser } from "../models/User";


// 🔹 Find user by email (admin/staff login)
export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};


// 🔹 Create user (Admin / Staff)
export const createUser = async (data: Partial<IUser>) => {
  return await User.create(data);
};


// 🔹 Get all staff
export const findAllStaff = async () => {
  return await User.find({ role: "staff" });
};


// 🔹 Get staff by department
export const findStaffByDepartment = async (department: string) => {
  return await User.find({
    role: "staff",
    department,
  });
};


// 🔹 Get staff by email (only staff)
export const findStaffByEmail = async (email: string) => {
  return await User.findOne({
    role: "staff",
    email,
  });
};


// 🔹 Update staff by email
export const updateStaffByEmail = async (
  email: string,
  updateData: Partial<IUser>
) => {
  return await User.findOneAndUpdate(
    { role: "staff", email },
    updateData,
    { new: true }
  );
};


// 🔹 (Optional Future Use) Delete staff
export const deleteStaffByEmail = async (email: string) => {
  return await User.findOneAndDelete({ email, role: "staff" });
};
