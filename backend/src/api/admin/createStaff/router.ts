// admin/createStaff /router.ts

import Hapi from "@hapi/hapi";
import {
  createStaffHandler,
  deleteStaffHandler,
  getAllStaffHandler,
  getStaffByDepartmentHandler,
  getStaffByEmailHandler,
  updateStaffHandler,
} from "./handler";

import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";

export const staffRoutes: Hapi.Plugin<undefined> = {
  name: "staff-routes",
  register: async (server: Hapi.Server) => {

    // 🔹 Create Staff
    server.route({
      method: "POST",
      path: "/admin/create-staff",
      options: {
        pre: [
          { method: authenticate ,assign: "user" },
          { method: authorize(["admin"]) },
        ],
      },
      handler: createStaffHandler,
    });

    // 🔹 Get All Staff
    server.route({
      method: "GET",
      path: "/admin/staff",
      options: {
        pre: [
          { method: authenticate,assign: "user"  },
          { method: authorize(["admin"]) },
        ],
      },
      handler: getAllStaffHandler,
    });

    // 🔹 Get Staff By Department
    server.route({
      method: "GET",
      path: "/admin/staff/department/{department}",
      options: {
        pre: [
          { method: authenticate ,assign: "user" },
          { method: authorize(["admin"]) },
        ],
      },
      handler: getStaffByDepartmentHandler,
    });

    // 🔹 Get Staff By Email
    server.route({
      method: "GET",
      path: "/admin/staff/{email}",
      options: {
        pre: [
          { method: authenticate,assign: "user"  },
          { method: authorize(["admin"]) },
        ],
      },
      handler: getStaffByEmailHandler,
    });

    // 🔹 Update Staff
    server.route({
      method: "PUT",
      path: "/admin/staff/{email}",
      options: {
        pre: [
          { method: authenticate,assign: "user"  },
          { method: authorize(["admin"]) },
        ],
      },
      handler: updateStaffHandler,
    });

    // 🔹 DELETE STAFF
server.route({
  method: "DELETE",
  path: "/admin/staff/{email}",
  options: {
    pre: [
      { method: authenticate, assign: "user" },
      { method: authorize(["admin"]) },
    ],
  },
  handler: deleteStaffHandler,
});

  },
};


