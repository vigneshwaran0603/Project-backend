//student.operation.ts 

import Student from "../models/Student";


// 🔹 Find student by Register No
export const findStudentByRegisterNo = async (registerNo: string) => {
  return await Student.findOne({ registerNo });
};


// 🔹 Create student
export const createStudent = async (data: any) => {
  return await Student.create(data);
};


// 🔹 Get all students
export const findAllStudents = async () => {
  return await Student.find();
};


// 🔹 Get students by department
export const findStudentsByDepartment = async (department: string) => {
  return await Student.find({ department });
};


// 🔹 Update student by Register No
export const updateStudentByRegisterNo = async (
  registerNo: string,
  updateData: any
) => {
  return await Student.findOneAndUpdate(
    { registerNo },
    updateData,
    { new: true }
  );
};


// 🔹 Delete student by Register No
export const deleteStudentByRegisterNo = async (registerNo: string) => {
  return await Student.findOneAndDelete({ registerNo });
};
