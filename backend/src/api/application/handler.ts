// application/handler.ts
import { Request, ResponseToolkit } from "@hapi/hapi";
import cloudinary from "../../config/cloudinary";
import { updateApplicationStatus } from "../../operations/application.operation";
export const submitApplication = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const payload: any = request.payload;

    // Generate unique application number
    const applicationNo = await generateApplicationNumber();

    // Handle marksheet upload
    const file = payload.marksheet;

    if (!file || !file.hapi || !file._data) {
      return h.response({ message: "Marksheets file is required" }).code(400);
    }

    // Convert stream to buffer
    const fileBuffer = file._data;

    // Upload to Cloudinary
    const uploadedFile = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "marksheets",
        //   public_id: applicationNo, // optional: use applicationNo as file name
          resource_type: "auto",    // auto detects file type
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(fileBuffer);
    });

    // Save application in DB
    const application = await Application.create({
    applicationNo: String(applicationNo),
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      department: payload.department,
      community: payload.community,
      twelthMark: payload.twelthMark,
      marksheetUrl: uploadedFile.secure_url, // Cloudinary URL
      status: "PENDING",
    });

    return h
      .response({
        message: "Application submitted successfully",
        applicationNo: application.applicationNo,
        status: application.status,
      })
      .code(201);
  } catch (error) {
    console.error("Error submitting application:", error);
    return h
      .response({ message: "Failed to submit application" })
      .code(500);
  }
};


import {
  getAllApplications,
} from "../../operations/application.operation";
import { generateApplicationNumber } from "../../utils/applicationNumber";
import Application from "../../models/Application";

// ✅ GET ALL APPLICATIONS (HANDLER)
export const getAllApplicationsHandler = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const applications = await getAllApplications();
    return h.response(applications).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ message: "Failed to fetch applications" }).code(500);
  }
};

// ✅ UPDATE STATUS (HANDLER)
export const updateApplicationStatusHandler = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const { applicationNo } = request.params as { applicationNo: string };
    const { status } = request.payload as { status: string };

    const updated = await updateApplicationStatus(applicationNo, status as any);

    if (!updated) {
      return h.response({ message: "Application not found" }).code(404);
    }

    return h.response({
      message: "Status updated successfully",
      application: updated,
    });
  } catch (err) {
    console.error(err);
    return h.response({ message: "Failed to update status" }).code(500);
  }
};