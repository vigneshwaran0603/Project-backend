// feesStructure/hadler.ts

import { Request, ResponseToolkit } from "@hapi/hapi";
import { createFeeStructureSchema } from "../../validations/feesStructure.validation";
import { createFeeStructure, deleteFeeStructure, getAllFeeStructures, updateFeeStructure } from "../../operations/feesStructure.operation";



export const createFeeStructureHandler = async (
  request: any,
  h: any
) => {
  const parsed = createFeeStructureSchema.parse(
    request.payload
  );

  const user = request.pre.user;
//   console.log("User object:", (request as any).user);

  const result = await createFeeStructure(
    parsed,
    user._id
  );

  return h.response(result).code(201);
};

export const getAllFeeStructuresHandler = async (
  request: any,
  h: any,
) => {
  const data = await getAllFeeStructures();
  return h.response(data);
};


// 🔹 UPDATE FEE STRUCTURE
export const updateFeeStructureHandler = async (
  request: any,
  h: any
) => {
  try {

    const { id } = request.params;

    const updated = await updateFeeStructure(
      id,
      request.payload
    );

    if (!updated) {
      return h.response({
        message: "Fee structure not found",
      }).code(404);
    }

    return h.response({
      message: "Fee structure updated successfully",
      data: updated,
    }).code(200);

  } catch (error) {
    console.error("Update Fee Structure Error:", error);

    return h.response({
      message: "Internal Server Error",
    }).code(500);
  }
};


// 🔹 DELETE FEE STRUCTURE
export const deleteFeeStructureHandler = async (
  request: any,
  h: any
) => {
  try {

    const { id } = request.params;

    const deleted = await deleteFeeStructure(id);

    if (!deleted) {
      return h.response({
        message: "Fee structure not found",
      }).code(404);
    }

    return h.response({
      message: "Fee structure deleted successfully",
    }).code(200);

  } catch (error) {

    console.error("Delete Fee Structure Error:", error);

    return h.response({
      message: "Internal Server Error",
    }).code(500);
  }
};