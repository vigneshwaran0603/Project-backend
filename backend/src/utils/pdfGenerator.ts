




// // new 2
// import PDFDocument from "pdfkit";
// import { v2 as cloudinary } from "cloudinary";
// import streamifier from "streamifier";

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// interface ReceiptData {
//   receiptNumber: string;
//   studentName: string;
//   registerNo: string;
//   department: string;
//   year: number;
//   semester: number;
//   breakdown: {
//     tuitionFee: number;
//     otherFee: number;
//     examFee: number;
//     condonationFee: number;
//   };
//   totalAmount: number;
//   paidAt: Date;
// }

// export const generateReceiptPdf = async (
//   data: ReceiptData
// ): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     try {
//       const doc = new PDFDocument({
//         size: "A4",
//         margin: 50,
//       });

//       const buffers: Uint8Array[] = [];

//       doc.on("data", buffers.push.bind(buffers));

//       doc.on("end", async () => {
//         const pdfBuffer = Buffer.concat(buffers);

//         const uploadStream = cloudinary.uploader.upload_stream(
//           {
//             folder: "receipts",
//             public_id: data.receiptNumber,
//             resource_type: "raw",
//             format: "pdf",
//             type: "upload",
//           },
//           (error, result) => {
//             if (error || !result) {
//               reject("Cloudinary upload failed");
//             } else {
//               resolve(result.secure_url);
//             }
//           }
//         );

//         streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
//       });

//       /* ---------- HEADER ---------- */

//       doc
//         .fontSize(20)
//         .text("ABC COLLEGE OF ENGINEERING", {
//           align: "center",
//         });

//       doc
//         .fontSize(12)
//         .text("Fee Payment Receipt", {
//           align: "center",
//         });

//       doc.moveDown(2);

//       /* ---------- RECEIPT INFO ---------- */

//       doc.fontSize(12);
//       doc.text(`Receipt No : ${data.receiptNumber}`);
//       doc.text(`Date       : ${data.paidAt.toDateString()}`);

//       doc.moveDown();

//       /* ---------- STUDENT DETAILS ---------- */

//       doc.fontSize(14).text("Student Details", { underline: true });

//       doc.moveDown(0.5);

//       doc.fontSize(12);
//       doc.text(`Name          : ${data.studentName}`);
//       doc.text(`Register No   : ${data.registerNo}`);
//       doc.text(`Department    : ${data.department}`);
//       doc.text(`Year          : ${data.year}`);
//       doc.text(`Semester      : ${data.semester}`);

//       doc.moveDown(2);

//       /* ---------- TABLE ---------- */

//       doc.fontSize(14).text("Fee Breakdown", { underline: true });

//       doc.moveDown();

//       const tableTop = doc.y;
//       const itemX = 50;
//       const amountX = 400;
//       const rowHeight = 25;

//       const drawRow = (y: number, item: string, amount: string) => {
//         doc
//           .rect(itemX, y, 350, rowHeight)
//           .stroke();

//         doc
//           .rect(amountX, y, 150, rowHeight)
//           .stroke();

//         doc.text(item, itemX + 10, y + 8);
//         doc.text(amount, amountX + 10, y + 8);
//       };

//       // Header Row
//       drawRow(tableTop, "Fee Type", "Amount (₹)");

//       let y = tableTop + rowHeight;

//       drawRow(y, "Tuition Fee", `₹${data.breakdown.tuitionFee}`);
//       y += rowHeight;

//       drawRow(y, "Other Fee", `₹${data.breakdown.otherFee}`);
//       y += rowHeight;

//       drawRow(y, "Exam Fee", `₹${data.breakdown.examFee}`);
//       y += rowHeight;

//       drawRow(y, "Condonation Fee", `₹${data.breakdown.condonationFee}`);
//       y += rowHeight;

//       drawRow(y, "Total Paid", `₹${data.totalAmount}`);

//       doc.moveDown(6);

//       /* ---------- STATUS ---------- */

//       doc.fontSize(12).text("Payment Status : PAID");

//       doc.moveDown(4);

//       /* ---------- SIGNATURE ---------- */

//       const signY = doc.y;

//       doc.moveTo(400, signY).lineTo(520, signY).stroke();

//       doc.text("Authorized Signature", 400, signY + 5, {
//         width: 150,
//         align: "center",
//       });

//       doc.moveDown(4);

//       /* ---------- FOOTER ---------- */

//       doc
//         .fontSize(10)
//         .text("This is a computer generated receipt.", {
//           align: "center",
//         });

//       doc.text("No physical signature required.", {
//         align: "center",
//       });

//       doc.end();
//     } catch (error) {
//       reject("PDF generation failed");
//     }
//   });
// };







// new new
import PDFDocument from "pdfkit";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface ReceiptData {
  receiptNumber: string;
  studentName: string;
  registerNo: string;
  department: string;
  year: number;
  semester: number;
  breakdown: {
    tuitionFee: number;
    otherFee: number;
    examFee: number;
    condinationFee: number;
  };
  totalAmount: number;
  paidAt: Date;
}

export const generateReceiptPdf = async (
  data: ReceiptData
): Promise<{ url: string; buffer: Buffer }> =>{
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const buffers: Uint8Array[] = [];

      doc.on("data", buffers.push.bind(buffers));

      doc.on("end", async () => {
        try {
          const pdfBuffer = Buffer.concat(buffers);

          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "receipts",
              public_id: data.receiptNumber,
              resource_type: "raw",
              format: "pdf",
            },
            (error, result) => {
              if (error || !result) {
                reject("Cloudinary upload failed");
              } else {
                resolve({
  url: result.secure_url,
  buffer: pdfBuffer,
});
              }
            }
          );

          streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
        } catch (err) {
          reject("Upload failed");
        }
      });

      /* ---------- HEADER ---------- */

      doc
        .fontSize(20)
        .text("ERODE ARTS AND SCIENCE COLLEGE", {
          align: "center",
        });

      doc
        .fontSize(12)
        .text("Fee Payment Receipt", {
          align: "center",
        });

      doc.moveDown(2);

      /* ---------- RECEIPT INFO ---------- */

      doc.fontSize(12);
      doc.text(`Receipt No : ${data.receiptNumber}`);
      doc.text(`Date       : ${data.paidAt.toDateString()}`);

      doc.moveDown();

      /* ---------- STUDENT DETAILS ---------- */

      doc.fontSize(14).text("Student Details", { underline: true });

      doc.moveDown(0.5);

      doc.fontSize(12);
      doc.text(`Name          : ${data.studentName}`);
      doc.text(`Register No   : ${data.registerNo}`);
      doc.text(`Department    : ${data.department}`);
      doc.text(`Year          : ${data.year}`);
      doc.text(`Semester      : ${data.semester}`);

      doc.moveDown(2);

      /* ---------- TABLE ---------- */

      doc.fontSize(14).text("Fee Breakdown", { underline: true });

      doc.moveDown();

      const tableTop = doc.y;
      const itemX = 50;
      const amountX = 400;
      const rowHeight = 25;

      const drawRow = (y: number, item: string, amount: string) => {
        doc.rect(itemX, y, 350, rowHeight).stroke();
        doc.rect(amountX, y, 150, rowHeight).stroke();

        doc.text(item, itemX + 10, y + 8);
        doc.text(amount, amountX + 10, y + 8);
      };

      drawRow(tableTop, "Fee Type", "Amount (₹)");

      let y = tableTop + rowHeight;

      drawRow(y, "Tuition Fee", `₹${data.breakdown.tuitionFee}`);
      y += rowHeight;

      drawRow(y, "Other Fee", `₹${data.breakdown.otherFee}`);
      y += rowHeight;

      drawRow(y, "Exam Fee", `₹${data.breakdown.examFee}`);
      y += rowHeight;

      drawRow(y, "Condination Fee", `₹${data.breakdown.condinationFee}`);
      y += rowHeight;

      drawRow(y, "Total Paid", `₹${data.totalAmount}`);

      doc.moveDown(6);

      /* ---------- STATUS ---------- */

      doc.fontSize(12).text("Payment Status : PAID");

      doc.moveDown(4);

      /* ---------- SIGNATURE ---------- */

      const signY = doc.y;

      doc.moveTo(400, signY).lineTo(520, signY).stroke();

      doc.text("Authorized Signature", 400, signY + 5, {
        width: 150,
        align: "center",
      });

      doc.moveDown(4);

      /* ---------- FOOTER ---------- */

      doc
        .fontSize(10)
        .text("This is a computer generated receipt.", {
          align: "center",
        });

      doc.text("No physical signature required.", {
        align: "center",
      });

      doc.end();
    } catch (error) {
      reject("PDF generation failed");
    }
  });
};