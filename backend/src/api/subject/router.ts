// subject/router.ts

import Hapi from "@hapi/hapi";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  createSubjectHandler,
  updateSubjectHandler,
  deleteSubjectHandler,
  getSubjectsHandler,
} from "./handler";

export const subjectRoutes: Hapi.Plugin<undefined> = {
  name: "subject-routes",
  register: async (server: Hapi.Server) => {
    server.route([
      {
        method: "POST",
        path: "/subjects",
        handler: createSubjectHandler,
        options: {
          pre: [
            { method: authenticate ,assign: "user"},
            { method: authorize(["admin", "staff"]) },
          ],
        },
      },
      {
        method: "PUT",
        path: "/subjects/{id}",
        handler: updateSubjectHandler,
        options: {
          pre: [
            { method: authenticate ,assign: "user"},
            { method: authorize(["admin", "staff"]) },
          ],
        },
      },
      {
        method: "DELETE",
        path: "/subjects/{id}",
        handler: deleteSubjectHandler,
        options: {
          pre: [
            { method: authenticate,assign: "user" },
            { method: authorize(["admin", "staff"]) },
          ],
        },
      },
      {
        method: "GET",
        path: "/subjects/student",
        handler: getSubjectsHandler,
        options: {
          pre: [
            { method: authenticate,assign: "user" },
            { method: authorize(["student","staff","admin"]) },
          ],
        },
      },
    ]);
  },
};