


// // new
// import { Request, ResponseToolkit } from "@hapi/hapi";
// import { calculateFeesSchema, createPaymentSessionSchema } from "../../validations/payment.validation";
// import { calculateFeesOperation, confirmPaymentOperation, createPaymentSessionOperation } from "../../operations/payment.operation";


// // 1️⃣ View Fees
// export const calculateFeesHandler = async (
//   request: Request,
//   h: ResponseToolkit
// ) => {
//   try {
//     // const studentId = request.auth.credentials._id as string;
//     const studentId = request.pre.user._id;

//     const payload = calculateFeesSchema.parse(request.payload);

//     const result = await calculateFeesOperation(
//       studentId,
//       payload.department,
//       payload.year,
//       payload.semester
//     );

//     return h.response(result).code(200);
//   } catch (error: any) {
//     return h.response({ message: error.message }).code(400);
//   }
// };

// // 2️⃣ Create Stripe Session
// export const createPaymentSessionHandler = async (
//   request: Request,
//   h: ResponseToolkit
// ) => {
//   try {
//     const studentId = request.pre.user._id as string;

//     const payload = createPaymentSessionSchema.parse(request.payload);
//     console.log("studnt id:",studentId);
// console.log("request payload:",payload);
//     const result = await createPaymentSessionOperation(
//       studentId,
//       payload.department,
//       payload.year,
//       payload.semester
//     );

//     return h.response(result).code(200);
//   } catch (error: any) {
//     return h.response({ message: error.message }).code(400);
//   }
// };

// // 3️⃣ Confirm Payment
// export const confirmPaymentHandler = async (
//   request: Request,
//   h: ResponseToolkit
// ) => {
//   try {
//     const { sessionId } = request.payload as { sessionId: string };

//     const result = await confirmPaymentOperation(sessionId);

//     return h.response(result).code(200);
//   } catch (error: any) {
//     return h.response({ message: error.message }).code(400);
//   }
// };


















// neww 2
import { Request, ResponseToolkit } from "@hapi/hapi";

import {
  calculateFeesOperation,
  createStripePaymentOperation,
  departmentPaymentReportOperation,
  getDepartmentPaymentHistoryOperation,
  verifyStripePaymentOperation,
} from "../../operations/payment.operation";

import {
  calculateFeesSchema,
  createPaymentSessionSchema,
} from "../../validations/payment.validation";



export const calculateFeesHandler = async (
  request: Request,
  h: ResponseToolkit
) => {

  try {

    const studentId = request.pre.user._id;

    const payload = calculateFeesSchema.parse(request.payload);

    const result = await calculateFeesOperation(
      studentId,
      payload.department,
      payload.year,
      payload.semester
    );

    return h.response(result).code(200);

  } catch (error: any) {
    return h.response({ message: error.message }).code(400);
  }

};



export const createStripePaymentHandler = async (
  request: Request,
  h: ResponseToolkit
) => {

  try {

    const studentId = request.pre.user._id;

    const payload = createPaymentSessionSchema.parse(request.payload);

    const result = await createStripePaymentOperation(
      studentId,
      payload.department,
      payload.year,
      payload.semester
    );

    return h.response(result).code(200);

  } catch (error: any) {

    console.error(error);

    return h.response({
      success: false,
      message: error.message,
    }).code(500);

  }

};



export const verifyStripePaymentHandler = async (
  request: Request,
  h: ResponseToolkit
) => {

  const { paymentIntentId } = request.payload as {
    paymentIntentId: string;
  };

  if (!paymentIntentId)
    return h.response({
      success: false,
      message: "paymentIntentId required",
    }).code(400);

  try {

    const result = await verifyStripePaymentOperation(
      paymentIntentId
    );

    return h.response(result).code(
      result.success ? 200 : 400
    );

  } catch (error: any) {

    return h.response({
      success: false,
      message: error.message,
    }).code(500);

  }

};

export const departmentPaymentHistoryHandler = async (
  request: Request,
  h: ResponseToolkit
) => {

  try {

    const { department, year, semester } = request.query as {
      department: string;
      year: number;
      semester: number;
    };

    const result = await getDepartmentPaymentHistoryOperation(
      department,
      Number(year),
      Number(semester)
    );

    return h.response(result).code(200);

  } catch (error: any) {

    return h.response({
      message: error.message
    }).code(500);

  }

};

export const departmentPaymentReportHandler = async (
  request: Request,
  h: ResponseToolkit
) => {

  try {

    const { department,year,semester } = request.query as any;

    const result = await departmentPaymentReportOperation(
      department,
      Number(year),
      Number(semester)
    );

    return h.response(result).code(200);

  } catch(error:any){

    return h.response({
      message:error.message
    }).code(500);

  }

};