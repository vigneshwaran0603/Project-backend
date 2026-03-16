// utils/applicationNumber.ts
import Application from "../models/Application";

export const generateApplicationNumber = async (): Promise<number> => {
  let applicationNo=1000;
  let exists = true;

  while (exists) {
    // applicationNo = Math.floor(1000 + Math.random() * 1001); // 1000–2000
    applicationNo = (applicationNo +1); // 1000–2000
    exists = !!(await Application.exists({ applicationNo: String(applicationNo) }));
  }

  return applicationNo!;
};