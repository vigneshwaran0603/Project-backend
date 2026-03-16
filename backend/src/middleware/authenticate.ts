// import { Request, ResponseToolkit } from "@hapi/hapi";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// import { ResponseToolkit } from "@hapi/hapi";
// import Student from "../models/Student";
// import User from "../models/User";

// dotenv.config();

// const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

// export const authenticate = async (req: Request, h: ResponseToolkit) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return h.response({ message: "No token provided" }).code(401).takeover();
//   }

//   const token = authHeader.split(" ")[1];
//   // console.log("RAW TOKEN:", token); // 🔥 Add this
 

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as any;
//     (req as any).user = decoded;
    
//     return h.continue;
//   } catch (error) {
//     console.log("JWT VERIFY ERROR:", error);
 
//     return h.response({ message: "Invalid token" }).code(401).takeover();
//   }
// };




// import { Request, ResponseToolkit } from "@hapi/hapi";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();

// const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

// export const authenticate = async (req: Request, h: ResponseToolkit) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return h.response({ message: "No token provided" }).code(401).takeover();
//     }

//     const token = authHeader.split(" ")[1];

//     // Verify token
//     const decoded = jwt.verify(token, JWT_SECRET) as any;

//     // 🔥 Attach decoded user to request
//     (req as any).user = decoded;

//     return h.continue;

//   } catch (error: any) {
//     console.log("JWT VERIFY ERROR:", error.message);
//     return h.response({ message: "Invalid token" }).code(401).takeover();
//   }
// };








// middleware/authenticate.ts
import { Request, ResponseToolkit } from "@hapi/hapi";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();
import Student from "../models/Student";
import User from "../models/User";
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";
export const authenticate = async (request: Request, h: ResponseToolkit) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    let loggedUser;
console.log("decoded",decoded);
    if (decoded.role === "student") {
      loggedUser = await Student.findById(decoded._id);
    } else {
      loggedUser = await User.findById(decoded._id);
    }
    // console.log("logged user:",loggedUser);

    if (!loggedUser) {
      throw new Error("User not found");
    }

    // 🔥 attach role manually from token
    return {
      ...loggedUser.toObject(),
      role: decoded.role,
    };

  } catch (err: any) {
    return h.response({ message: err.message }).code(401).takeover();
  }
};