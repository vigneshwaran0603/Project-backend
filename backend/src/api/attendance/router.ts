// attendacne/router.ts

import { Server } from "@hapi/hapi";
import {
  getStudentsHandler,
  markAttendanceHandler,
  getStudentAttendanceHandler,
  getAttendancePercentageHandler,
  getEligibilityHandler,
} from "./handler";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";

export const attendanceRoutes = {
  name: "attendanceRoutes",
  register: async function (server: Server) {
    server.route([
      // 1️⃣ Get Students (Staff Only)
      {
        method: "GET",
        path: "/attendance/students",
        options: {
          pre: [
            { method: authenticate, assign: "user" },
            { method: authorize(["staff"]) },
          ],
        },
        handler: getStudentsHandler,
      },

      // 2️⃣ Mark Attendance (Staff Only)
      {
        method: "POST",
        path: "/attendance/mark",
        options: {
          pre: [
            { method: authenticate ,assign: "user"},
            { method: authorize(["staff"]) },
          ],
        },
        handler: markAttendanceHandler,
      },

      // 3️⃣ Get Student Attendance (Staff or Student)
      {
        method: "GET",
        path: "/attendance/student/{id}",
        options: {
          pre: [
            { method: authenticate,assign: "user" },
            { method: authorize(["staff", "student"]) },
          ],
        },
        handler: getStudentAttendanceHandler,
      },

      // 4️⃣ Get Attendance Percentage
      {
        method: "GET",
        path: "/attendance/percentage/{id}",
        options: {
          pre: [
            { method: authenticate,assign: "user" },
            { method: authorize(["staff", "student"]) },
          ],
        },
        handler: getAttendancePercentageHandler,
      },

      // 5️⃣ Hall Ticket Eligibility
      {
        method: "GET",
        path: "/attendance/eligibility/{id}",
        options: {
          pre: [
            { method: authenticate ,assign: "user"},
            { method: authorize(["staff", "student"]) },
          ],
        },
        handler: getEligibilityHandler,
      },
    ]);
  },
};