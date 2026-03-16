import PDFDocument from "pdfkit";

interface Subject {
  subjectCode: string;
  subjectName: string;
}

interface HallticketData {
  collegeName: string;
  examName: string;
  hallticketNumber: string;
  studentName: string;
  registerNumber: string;
  department: string;
  semester: number;
  subjects: Subject[];
}

export const generateHallticketPDF = (
  data: HallticketData
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {

    const doc = new PDFDocument({
      size: "A4",
      margin: 50
    });

    const buffers: Buffer[] = [];

    /* -----------------------------
       STREAM HANDLING
    ----------------------------- */

    doc.on("data", (chunk: Buffer) => {
      buffers.push(chunk);
    });

    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      console.log("Generated PDF size:", pdfBuffer.length);
      resolve(pdfBuffer);
    });

    doc.on("error", (err) => {
      reject(err);
    });

    /* --------------------------------
       COLLEGE TITLE
    -------------------------------- */

    doc
      .fontSize(20)
      .text(data.collegeName, { align: "center" });

    doc.moveDown(0.5);

    doc
      .fontSize(16)
      .text(`${data.examName} - HALL TICKET`, { align: "center" });

    doc.moveDown(2);

    /* --------------------------------
       STUDENT DETAILS
    -------------------------------- */

    doc.fontSize(12);

    doc.text(`Hall Ticket No : ${data.hallticketNumber}`);
    doc.text(`Student Name   : ${data.studentName}`);
    doc.text(`Register No    : ${data.registerNumber}`);
    doc.text(`Department     : ${data.department}`);
    doc.text(`Semester       : ${data.semester}`);

    doc.moveDown(2);

    /* --------------------------------
       SUBJECT TABLE HEADER
    -------------------------------- */

    const tableTop = doc.y;
    const codeX = 50;
    const nameX = 200;

    doc
      .fontSize(13)
      .text("Subject Code", codeX, tableTop)
      .text("Subject Name", nameX, tableTop);

    doc.moveDown(0.5);

    doc.moveTo(codeX, doc.y).lineTo(550, doc.y).stroke();

    doc.moveDown(0.5);

    /* --------------------------------
       SUBJECT ROWS
    -------------------------------- */

    data.subjects.forEach((subject) => {

      const y = doc.y;

      doc
        .fontSize(12)
        .text(subject.subjectCode, codeX, y)
        .text(subject.subjectName, nameX, y);

      doc.moveDown(0.5);

      doc.moveTo(codeX, doc.y).lineTo(550, doc.y).stroke();

      doc.moveDown(0.5);
    });

    doc.moveDown(4);

    /* --------------------------------
       SIGNATURE
    -------------------------------- */

    doc
      .fontSize(12)
      .text("Controller of Examinations", {
        align: "right",
      });

    /* --------------------------------
       FINALIZE PDF
    -------------------------------- */

    doc.end();
  });
};