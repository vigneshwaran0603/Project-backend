// // login/handler.ts

// import bcrypt from "bcryptjs";
// import { Request, ResponseToolkit } from "@hapi/hapi";
// import { findUserByEmail } from "../../operations/user.operation";
// import { findStudentByRegisterNo } from "../../operations/student.operation";
// import { generateToken } from "../../utils/jwt";
// import { loginSchema } from "../../validations/user.validation";

// export const loginHandler = async (
//   req: Request,
//   h: ResponseToolkit
// ) => {
//   // ✅ Zod validation
//   const result = loginSchema.safeParse(req.payload);

//   if (!result.success) {
//     return h.response({ error: result.error.issues }).code(400);
//   }

//   const { username, password } = result.data;

//   // 🔹 STEP 1: Check in Users collection (Admin / Staff)
//   const user = await findUserByEmail(username);
  

//   if (user) {
//     const isValid = await bcrypt.compare(password, user.password);

//     if (!isValid) {
//       return h.response({ message: "Invalid credentials" }).code(401);
//     }

//     const token = generateToken({
//       _id: user._id,
//       role: user.role,
//     });

//     return h.response({
//       message: "Login successful",
//       _id: user._id, 
//       role: user.role,
//       token,
//     });
//   }

//   // 🔹 STEP 2: If not found in Users → Check in Students collection
//   const student = await findStudentByRegisterNo(username);

//   if (student) {
//     const isValid = await bcrypt.compare(password, student.password); 
//     // ⚠ make sure DOB is hashed while storing

//     if (!isValid) {
//       return h.response({ message: "Invalid credentials" }).code(401);
//     }

//     const token = generateToken({
//       _id: student._id,
      
//       role: student.role,
//     });

//     return h.response({
//       message: "Login successful",
//       _id:student._id,
//       role: student.role,
//       token,
//     });
//   }

//   // 🔹 If neither found
//   return h.response({ message: "Invalid credentials" }).code(401);
// };





//  new 2
// login/handler.ts

import bcrypt from "bcryptjs";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { findUserByEmail } from "../../operations/user.operation";
import { findStudentByRegisterNo } from "../../operations/student.operation";
import { generateToken } from "../../utils/jwt";
import { loginSchema } from "../../validations/user.validation";

export const loginHandler = async (
  req: Request,
  h: ResponseToolkit
) => {

  try {

    // ✅ Validate request body
    const result = loginSchema.safeParse(req.payload);

    if (!result.success) {
      return h.response({ error: result.error.issues }).code(400);
    }

    const { username, password } = result.data;

    console.log("Login attempt:", username);

    // 🔹 STEP 1: Check Admin / Staff in Users collection
    const user = await findUserByEmail(username);

    if (user) {

      console.log("User found in Users collection");

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return h.response({ message: "Invalid credentials" }).code(401);
      }

      const token = generateToken({
        _id: user._id,
        role: user.role,
      });

      return h.response({
        message: "Login successful",
        token,
        role: user.role,
        user: {
          _id: user._id,
          username: user.email
        }
      });
    }

    // 🔹 STEP 2: Check Students collection
    const student = await findStudentByRegisterNo(username);

    if (student) {

      console.log("User found in Students collection");

      let isValid = false;

      // 🔸 Case 1: password stored hashed
      if (student.password.startsWith("$2")) {
        isValid = await bcrypt.compare(password, student.password);
      }
      // 🔸 Case 2: password stored plain text (temporary support)
      else {
        isValid = password === student.password;
      }

      if (!isValid) {
        return h.response({ message: "Invalid credentials" }).code(401);
      }

      const token = generateToken({
        _id: student._id,
        role: student.role,
      });

      return h.response({
        message: "Login successful",
        token,
        role: student.role,
        user: {
          _id: student._id,
          username: student.registerNo
        }
      });
    }

    // 🔹 If neither found
    return h.response({ message: "Invalid credentials" }).code(401);

  } catch (err) {

    console.error("Login error:", err);

    return h.response({
      message: "Server error"
    }).code(500);

  }

};