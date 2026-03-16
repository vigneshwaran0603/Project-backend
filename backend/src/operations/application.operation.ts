// application.operation.ts
import Application from "../models/Application";
import { generateApplicationNumber } from "../utils/applicationNumber";
import { CreateApplicationInput } from "../validations/application.validation";


// Create a new application
export const createApplication = async (data: CreateApplicationInput & { 
  marksheetUrl: string; 
}) => {
  // Generate application number
  const applicationNo = await generateApplicationNumber();

  return await Application.create({
    applicationNo: String(applicationNo), // store as string
    name: data.name,
    email: data.email,
    phone: data.phone,
    department: data.department,
    community: data.community,
    twelthMark: data.twelthMark,
    marksheetUrl: data.marksheetUrl,
    status: "PENDING", // default
  });
};

// Get an application by application number
export const getApplicationByNo = async (applicationNo: string | number) => {
  return await Application.findOne({ applicationNo: String(applicationNo)});
};

// Update application status
export const updateApplicationStatus = async (
  applicationNo: string | number,
  status: "PENDING" | "APPROVED" | "REJECTED"
) => {
  return await Application.findOneAndUpdate(
    { applicationNo:  String(applicationNo)},
    { status },
    { new: true }
  );
};

// Get all applications
export const getAllApplications = async () => {
  return await Application.find().sort({ createdAt: -1 });
};