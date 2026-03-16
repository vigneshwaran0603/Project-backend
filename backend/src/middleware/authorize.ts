// import { Request, ResponseToolkit } from "@hapi/hapi";

// export const authorize = (roles: string[]) => {
//   return async (req: Request, h: ResponseToolkit) => {
//     const user = (req as any).user;

    

//     if (!user || !roles.includes(user.role)) {
//       return h.response({ message: "Unauthorized" }).code(401).takeover();
//     }

//     return h.continue;
//   };
// };








// middleware/authorize.ts
import { Request, ResponseToolkit } from "@hapi/hapi";

export const authorize = (roles: string[]) => {
  return async (req: Request, h: ResponseToolkit) => {

    const user = req.pre.user;
    console.log("Authorize user:", user);

    if (!user) {
      return h.response({ message: "Unauthorized ####" }).code(401).takeover();
    }

    const allowedRoles = roles.map(r => r.toLowerCase());

    if (!allowedRoles.includes(user.role.toLowerCase())) {
      return h.response({ message: "Access denied" }).code(403).takeover();
    }

    return h.continue;
  };
};