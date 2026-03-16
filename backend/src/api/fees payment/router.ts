



// // new
// // fees-payment/router.ts

// import { Server } from "@hapi/hapi";
// import {
//   calculateFeesHandler,
//   createPaymentSessionHandler,
//   confirmPaymentHandler,
// } from "./handler";
// import { authenticate } from "../../middleware/authenticate";
// import { authorize } from "../../middleware/authorize";

// export const feesPaymentRoutes = {
//   name: "feesPaymentRoutes",
//   register: async function (server: Server) {
//     server.route([
//       // 1️⃣ Calculate Fees
//       {
//         method: "POST",
//         path: "/fees/calculate",
//         handler: calculateFeesHandler,
//         options: {
//           pre: [
//             { method: authenticate, assign: "user" },
//             { method: authorize(["student"]) }, // only student
//           ],
//         },
//       },

//       // 2️⃣ Create Stripe Session
//       {
//         method: "POST",
//         path: "/fees/pay",
//         handler: createPaymentSessionHandler,
//         options: {
//           pre: [
//             { method: authenticate, assign: "user" },
//             { method: authorize(["student"]) }, // only student
//           ],
//         },
//       },

//       // 3️⃣ Confirm Payment
//       {
//         method: "POST",
//         path: "/fees/confirm",
//         handler: confirmPaymentHandler,
//         options: {
//           pre: [
//             { method: authenticate, assign: "user" },
//             { method: authorize(["student"]) }, // only student
//           ],
//         },
//       },
//     ]);
//   },
// };










// new 22
import { Server } from "@hapi/hapi";

import {
  calculateFeesHandler,
  createStripePaymentHandler,
  departmentPaymentHistoryHandler,
  departmentPaymentReportHandler,
  verifyStripePaymentHandler,
} from "./handler";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";

export const feesPaymentRoutes = {

  name: "feesPaymentRoutes",

  register: async function (server: Server) {

    server.route([

      {
        method: "POST",
        path: "/fees/calculate",
        handler: calculateFeesHandler,
        options: {
          pre: [
            { method: authenticate, assign: "user" },
            { method: authorize(["student"]) },
          ],
        },
      },

      {
        method: "POST",
        path: "/fees/payment/create",
        handler: createStripePaymentHandler,
        options: {
          pre: [
            { method: authenticate, assign: "user" },
            { method: authorize(["student"]) },
          ],
        },
      },

      {
        method: "POST",
        path: "/fees/payment/verify",
        handler: verifyStripePaymentHandler,
        options: {
          pre: [
            { method: authenticate, assign: "user" },
            { method: authorize(["student"]) },
          ],
        },
      },
      {
  method: "GET",
  path: "/fees/history",
  handler: departmentPaymentHistoryHandler,
  options: {
    pre: [
      { method: authenticate, assign: "user" },
      { method: authorize(["staff","admin"]) }
    ],
  },
},
{
  method:"GET",
  path:"/fees/report",
  handler:departmentPaymentReportHandler
}

    ]);

  },

};