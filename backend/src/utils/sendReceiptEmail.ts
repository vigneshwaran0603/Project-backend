import nodemailer from "nodemailer";

export const sendReceiptEmail = async (
  studentEmail: string,
  studentName: string,
  pdfBuffer: Buffer,
  receiptNumber: string
) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"College Admin" <${process.env.EMAIL_USER}>`,
    to: studentEmail,
    subject: "College Fee Payment Receipt",
    text: `Dear ${studentName},

Your payment has been successfully completed.

Receipt Number: ${receiptNumber}

Please find the attached receipt PDF.

Thank you.`,
    
    attachments: [
      {
        filename: `${receiptNumber}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
};