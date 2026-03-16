

// // new
// import Student from "../models/Student";

// import Subject from "../models/Subject";
// import { sendReceiptEmail } from "../utils/sendReceiptEmail";


// const CONDINATION_FEE = 1000;

// export const calculateFeesOperation = async (
//   studentId: string,
//   department: string,
//   year: number,
//   semester: number
// ) => {
//   // 1️⃣ Get student
//   const student = await Student.findById(studentId);
//   if (!student) {
//     throw new Error("Student not found");
//   }

//   // 2️⃣ Check if already paid
//   const existingPayment = await FeesPayment.findOne({
//     student: studentId,
//     year,
//     semester,
//     paymentStatus: "PAID",
//   });

//   if (existingPayment) {
//     throw new Error("Fees already paid for this semester");
//   }

//   // 3️⃣ Get Fees Structure
//   const feesStructure = await FeeStructure.findOne({
//     department,
//     year,
//     semester,
//   });

//   if (!feesStructure) {
//     throw new Error("Fees structure not found");
//   }

//   const {
//     tuitionFee,
//     otherFee = 0,
//   } = feesStructure;

//   // 4️⃣ Get Subjects → Calculate Exam Fees
//   const subjects = await Subject.find({
//     department,
//     year,
//     semester,
//   },{fees:1});

//   let examFeeTotal = 0;

//   subjects.forEach((subject: any) => {
//     examFeeTotal += subject.fees || 0;
//   });

//   // 5️⃣ Calculate Attendance Percentage
//   // const attendanceRecords = await Attendance.find({
//   //   student: studentId,
//   //   year,
//   //   semester,
//   // });

//   // let totalClasses = 0;
//   // let attendedClasses = 0;

//   // attendanceRecords.forEach((record: any) => {
//   //   totalClasses += record.totalClasses;
//   //   attendedClasses += record.attendedClasses;
//   // });

//   // const attendancePercentage =
//   //   totalClasses === 0
//   //     ? 0
//   //     : Number(((attendedClasses / totalClasses) * 100).toFixed(2));
//   const attendanceRecords = await calculatePercentageOperation(
//      studentId,
//      studentId);
//      const percentage=attendanceRecords.percentage;

//   // 6️⃣ Add Condonation Fee if < 75%
//   const condinationFee =
//     percentage < 75 ? CONDINATION_FEE : 0;

//   // 7️⃣ Calculate Final Total
//   const totalAmount =
//     tuitionFee +
//     otherFee +
//     examFeeTotal +
//     condinationFee;

//   return {
//     studentName: student.name,
//     registerNumber: student.registerNo,
//     department,
//     year,
//     semester,
//     percentage,
//     breakdown: {
//       tuitionFee,
//       otherFee,
//       examFee: examFeeTotal,
//       condinationFee,
//     },
//     totalAmount,
//   };
// };
















// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);


// export const createPaymentSessionOperation = async (
//   studentId: string,
//   department: string,
//   year: number,
//   semester: number
// ) => {
//   // 1️⃣ Calculate Fees First
//   const feeData = await calculateFeesOperation(
//     studentId,
//     department,
//     year,
//     semester
//   );

//   // 2️⃣ Create Stripe Checkout Session
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     mode: "payment",
//     line_items: [
//       {
//         price_data: {
//           currency: "inr",
//           product_data: {
//             name: `College Fees - Year ${year} Semester ${semester}`,
//           },
//           unit_amount: feeData.totalAmount * 100, // Stripe uses paise
//         },
//         quantity: 1,
//       },
//     ],
//     success_url: process.env.STRIPE_SUCCESS_URL as string,
//     cancel_url: process.env.STRIPE_CANCEL_URL as string,
//   });

//   // 3️⃣ Create PENDING Payment Record
//   const paymentRecord = await FeesPayment.create({
//     student: studentId,
//     department,
//     year,
//     semester,
//     feeBreakdown: {
//       tuitionFee: feeData.breakdown.tuitionFee,
//       examFee: feeData.breakdown.examFee,
//       otherFee: feeData.breakdown.otherFee,
//       condinationFee: feeData.breakdown.condinationFee,
//     },
//     attendancePercentage: feeData.percentage,
//     totalAmount: feeData.totalAmount,
//     stripeSessionId: session.id,
//     paymentStatus: "PENDING",
//   });

//   return {
//     checkoutUrl: session.url,
//     sessionId: session.id,
//     paymentId: paymentRecord._id,
//   };
// };







// import { Attendance } from "../models/Attendance";
// import FeesPayment from "../models/FeesPayment";
// import { generateReceiptPdf } from "../utils/pdfGenerator";
// import FeeStructure from "../models/FeeStructure";
// import { calculatePercentageOperation } from "./attendance.operation";


// export const confirmPaymentOperation = async (sessionId: string) => {
 

//   // 1️⃣ Verify Stripe Session
//   const session = await stripe.checkout.sessions.retrieve(sessionId);

//   if (!session) {
//     throw new Error("Invalid Stripe session");
//   }

//   if (session.payment_status !== "paid") {
//     throw new Error("Payment not completed");
//   }

//   // 2️⃣ Find Payment Record
//   const payment = await FeesPayment.findOne({
//     stripeSessionId: sessionId,
//   }).populate("student");

//   if (!payment) {
//     throw new Error("Payment record not found");
//   }

//   if (payment.paymentStatus === "PAID") {
//     throw new Error("Payment already confirmed");
//   }

//   // 3️⃣ Generate Unique Receipt Number
//   const receiptNumber = `RCPT-${new Date().getFullYear()}-${Date.now()}`;

//   // 4️⃣ Generate PDF and Upload (we implement util next)
//   const receipt = await generateReceiptPdf({
//     receiptNumber,
//     studentName: (payment.student as any).name,
//     registerNo: (payment.student as any).registerNo,
//     department: payment.department,
//     year: payment.year,
//     semester: payment.semester,
//     breakdown: payment.feeBreakdown,
//     totalAmount: payment.totalAmount,
//     paidAt: new Date(),
//   });

//   // 5️⃣ Update Payment Record
//   payment.paymentStatus = "PAID";
//   payment.receiptNumber = receiptNumber;
//   payment.receiptUrl = receipt.url;
//   payment.paidAt = new Date();

//   await payment.save();

//   // 6️⃣ Send Receipt Email
// await sendReceiptEmail(
//   (payment.student as any).email,
//   (payment.student as any).name,
//   receipt.buffer,
//   receiptNumber
// );

// // 7️⃣ Return Response
// return {
//   message: "Payment successful",
//   receiptNumber,
//   receiptUrl: receipt.url,
// };
// };























// newww update 
import Stripe from "stripe";
import Student from "../models/Student";
import Subject from "../models/Subject";
import FeesPayment from "../models/FeesPayment";
import FeeStructure from "../models/FeeStructure";
import { sendReceiptEmail } from "../utils/sendReceiptEmail";
import { generateReceiptPdf } from "../utils/pdfGenerator";
import { calculatePercentageOperation } from "./attendance.operation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const CONDINATION_FEE = 1000;

export const calculateFeesOperation = async (
  studentId: string,
  department: string,
  year: number,
  semester: number
) => {

  const student = await Student.findById(studentId);
  if (!student) throw new Error("Student not found");

  const existingPayment = await FeesPayment.findOne({
    student: studentId,
    year,
    semester,
    paymentStatus: "PAID",
  });

  if (existingPayment) {
    throw new Error("Fees already paid for this semester");
  }

  const feesStructure = await FeeStructure.findOne({
    department,
    year,
    semester,
  });

  if (!feesStructure) throw new Error("Fees structure not found");

  const { tuitionFee, otherFee = 0 } = feesStructure;

  const subjects = await Subject.find(
    { department, year, semester },
    { fees: 1 }
  );

  let examFeeTotal = 0;
  subjects.forEach((s: any) => {
    examFeeTotal += s.fees || 0;
  });

  const attendance = await calculatePercentageOperation(studentId, studentId);
  const percentage = attendance.percentage;

  const condinationFee = percentage < 75 ? CONDINATION_FEE : 0;

  const totalAmount =
    tuitionFee + otherFee + examFeeTotal + condinationFee;

  return {
    studentName: student.name,
    registerNumber: student.registerNo,
    department,
    year,
    semester,
    percentage,
    breakdown: {
      tuitionFee,
      otherFee,
      examFee: examFeeTotal,
      condinationFee,
    },
    totalAmount,
  };
};



/* ===============================
   CREATE PAYMENT INTENT
================================ */

export const createStripePaymentOperation = async (
  studentId: string,
  department: string,
  year: number,
  semester: number
) => {

  const feeData = await calculateFeesOperation(
    studentId,
    department,
    year,
    semester
  );

  const payment = await FeesPayment.create({
    student: studentId,
    department,
    year,
    semester,
    feeBreakdown: feeData.breakdown,
    attendancePercentage: feeData.percentage,
    totalAmount: feeData.totalAmount,
    paymentStatus: "PENDING",
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: feeData.totalAmount * 100,
    currency: "inr",

    automatic_payment_methods: {
      enabled: true, // enables card, UPI, wallets etc
    },

    metadata: {
      paymentId: payment._id.toString(),
      studentId:studentId.toString(),
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    paymentId: payment._id,
    amount: feeData.totalAmount,
  };
};



/* ===============================
   VERIFY PAYMENT
================================ */

export const verifyStripePaymentOperation = async (
  paymentIntentId: string
) => {

  const paymentIntent = await stripe.paymentIntents.retrieve(
    paymentIntentId
  );

  if (paymentIntent.status !== "succeeded") {
    return {
      success: false,
      message: "Payment not completed",
    };
  }

  const paymentId = paymentIntent.metadata.paymentId;

  const payment = await FeesPayment.findById(paymentId).populate("student");

  if (!payment) throw new Error("Payment record not found");

  if (payment.paymentStatus === "PAID") {
    return {
      success: true,
      message: "Payment already confirmed",
    };
  }

  const receiptNumber = `RCPT-${Date.now()}`;

  const receipt = await generateReceiptPdf({
    receiptNumber,
    studentName: (payment.student as any).name,
    registerNo: (payment.student as any).registerNo,
    department: payment.department,
    year: payment.year,
    semester: payment.semester,
    breakdown: payment.feeBreakdown,
    totalAmount: payment.totalAmount,
    paidAt: new Date(),
  });

  payment.paymentStatus = "PAID";
  payment.receiptNumber = receiptNumber;
  payment.receiptUrl = receipt.url;
  payment.paidAt = new Date();

  await payment.save();

  await sendReceiptEmail(
    (payment.student as any).email,
    (payment.student as any).name,
    receipt.buffer,
    receiptNumber
  );

  return {
    success: true,
    message: "Payment successful",
    receiptNumber,
    receiptUrl: receipt.url,
  };
};

export const getDepartmentPaymentHistoryOperation = async (
  department: string,
  year: number,
  semester: number
) => {

  const payments = await FeesPayment.find({
    department,
    year,
    semester,
    paymentStatus: "PAID"
  })
  .populate("student", "name registerNo email")
  .sort({ paidAt: -1 });

  return payments;

};



export const departmentPaymentReportOperation = async (
  department: string,
  year: number,
  semester: number
) => {

  const students = await Student.find({
    department,
    year
  });

  const payments = await FeesPayment.find({
    department,
    year,
    semester,
    paymentStatus: "PAID"
  }).populate("student","name registerNo email");

  const paidStudentIds = payments.map(
    (p:any)=>p.student._id.toString()
  );

  const unpaidStudents = students.filter(
    (s:any)=>!paidStudentIds.includes(s._id.toString())
  );

  return {

    totalStudents: students.length,

    totalPaid: payments.length,

    totalUnpaid: unpaidStudents.length,

    payments,

    unpaidStudents

  };

};