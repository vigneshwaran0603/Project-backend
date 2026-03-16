// feesStructure/router.ts

import { Server } from "@hapi/hapi";
import {createFeeStructureHandler,deleteFeeStructureHandler,getAllFeeStructuresHandler, updateFeeStructureHandler} from "./handler";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";



export const feeStructureRoutes = {
    name: "feesStructureRoutes",
    register: async function (server: Server) {
        server.route([
        {
            method: "POST",
            path: "/fee-structure",
            handler: createFeeStructureHandler,
            options: {
                pre: [
                    { method: authenticate ,assign: "user"},
                    { method: authorize(["admin"]) }, // only staff create
                ],
            },
        },
       {
  method: "GET",
  path: "/fee-structure",
  handler: getAllFeeStructuresHandler,
  options: {
    pre: [
      { method: authenticate, assign: "user" },
      { method: authorize(["admin", "staff", "student"]) },
    ],
  },
},
        // 🔹 UPDATE FEE STRUCTURE
{
  method: "PUT",
  path: "/fee-structure/{id}",
  handler: updateFeeStructureHandler,
  options: {
    pre: [
      { method: authenticate, assign: "user" },
      { method: authorize(["admin"]) },
    ],
  },
},

// 🔹 DELETE FEE STRUCTURE
{
  method: "DELETE",
  path: "/fee-structure/{id}",
  handler: deleteFeeStructureHandler,
  options: {
    pre: [
      { method: authenticate, assign: "user" },
      { method: authorize(["admin"]) },
    ],
  },
},
        
        ]);
    },
};