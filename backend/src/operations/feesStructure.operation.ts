// feesStructure.operation.ts

import FeeStructure from "../models/FeeStructure";

export const createFeeStructure = async (
  data: any,
  userId: string
) => {
  const totalAmount =
    data.tuitionFee + (data.otherFee || 0);

  const feeStructure = await FeeStructure.create({
    ...data,
    totalAmount,
    createdBy: userId,
  });

  return feeStructure;
};

export const getAllFeeStructures = async () => {
  return FeeStructure.find();
};

// 🔹 UPDATE FEE STRUCTURE
export const updateFeeStructure = async (
  id: string,
  data: any
) => {

  const totalAmount =
    data.tuitionFee + (data.otherFee || 0);

  return FeeStructure.findByIdAndUpdate(
    id,
    {
      ...data,
      totalAmount,
    },
    { new: true }
  );
};


// 🔹 DELETE FEE STRUCTURE
export const deleteFeeStructure = async (
  id: string
) => {
  return FeeStructure.findByIdAndDelete(id);
};