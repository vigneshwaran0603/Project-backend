// subject.operation.ts

import Subject from "../models/Subject";
import { Types } from "mongoose";

export const createSubjectOperation = async (
  payload: any,
  userId: string
) => {
  const subject = await Subject.create({
    ...payload,
    createdBy: new Types.ObjectId(userId),
  });

  return subject;
};

export const updateSubjectOperation = async (
  subjectId: string,
  payload: any
) => {
  const subject = await Subject.findByIdAndUpdate(
    subjectId,
    payload,
    { new: true }
  );

  if (!subject) {
    throw new Error("Subject not found");
  }

  return subject;
};

export const deleteSubjectOperation = async (
  subjectId: string
) => {
  const subject = await Subject.findByIdAndDelete(subjectId);

  if (!subject) {
    throw new Error("Subject not found");
  }

  return subject;
};

export const calculateExamFeesOperation = async (
  department: string,
  year: number,
  semester: number
) => {
  const subjects = await Subject.find({
    department,
    year,
    semester,
  },{ title: 1, fees: 1, _id: 0 });
   // Extract only titles into array
  const subjectTitles = subjects.map(sub => sub.title);
  const totalSubjects = subjects.length;

  const totalFees = subjects.reduce(
    (sum, subject) => sum + subject.fees,
    0
  );

  return {
    subjects: subjectTitles,
    totalSubjects,
    totalFees,
  };
};