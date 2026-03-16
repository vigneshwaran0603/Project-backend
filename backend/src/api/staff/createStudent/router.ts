// staff/createStudent/router.ts

import Hapi from "@hapi/hapi";
import {
  createStudentHandler,
  getAllStudentsHandler,
  getStudentByRegisterNoHandler,
  getStudentsByDepartmentHandler,
  updateStudentHandler,
  deleteStudentHandler,
} from "./handler";

import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";

export const studentRoutes: Hapi.Plugin<undefined> = {
  name: "student-routes",
  register: async (server: Hapi.Server) => {

    // 🔹 CREATE STUDENT
    server.route({
      method: "POST",
      path: "/staff/create-student",
      options: {
        pre: [
          { method: authenticate,assign: "user" },
          { method: authorize(["staff"]) },
        ],
      },
      handler: createStudentHandler,
    });

    // 🔹 GET ALL STUDENTS
    server.route({
      method: "GET",
      path: "/staff/students",
      options: {
        pre: [
          { method: authenticate ,assign: "user"},
          { method: authorize(["staff","admin"]) },
        ],
      },
      handler: getAllStudentsHandler,
    });

    // 🔹 GET STUDENT BY REGISTER NO
    server.route({
      method: "GET",
      path: "/staff/students/registerNo/{registerNo}",
      options: {
        pre: [
          { method: authenticate ,assign: "user"},
          { method: authorize(["staff","admin"]) },
        ],
      },
      handler: getStudentByRegisterNoHandler,
    });

    // 🔹 GET STUDENT BY DEPARTMENT
    server.route({
      method: "GET",
      path: "/staff/students/department/{department}",
      options: {
        pre: [
          { method: authenticate ,assign: "user"},
          { method: authorize(["staff","admin"]) },
        ],
      },
      handler: getStudentsByDepartmentHandler,
    });

    // 🔹 UPDATE STUDENT
    server.route({
      method: "PUT",
      path: "/staff/students/{registerNo}",
      options: {
        pre: [
          { method: authenticate ,assign: "user"},
          { method: authorize(["staff","admin"]) },
        ],
      },
      handler: updateStudentHandler,
    });

    // 🔹 DELETE STUDENT
    server.route({
      method: "DELETE",
      path: "/staff/students/{registerNo}",
      options: {
        pre: [
          { method: authenticate ,assign: "user"},
          { method: authorize(["staff","admin"]) },
        ],
      },
      handler: deleteStudentHandler,
    });

  },
};
