// application/router.ts
import Hapi from "@hapi/hapi";
import {
  submitApplication,
  getAllApplicationsHandler,
  updateApplicationStatusHandler,
} from "./handler";
export const applicationRoutes: Hapi.Plugin<undefined> = {
  name: "application-routes",
  register: async (server: Hapi.Server) => {
    server.route({
      method: "POST",
      path: "/application",
      options: {
        payload: {
          output: "stream",
          parse: true,
          multipart: true,
          maxBytes: 10 * 1024 * 1024, // 10MB
        },
      },
      handler: submitApplication,
    });
// get the applications
    server.route({
      method: "GET",
      path: "/application",
      options: {
        auth: false, // frontend access
      },
      handler: getAllApplicationsHandler,
    });


    server.route({
        method: "PUT",
        path: "/application/{applicationNo}/stat",
        // options: {
        //     auth: false, // later replace with staff auth (JWT)
        // },
        handler: updateApplicationStatusHandler,
    });
  },
};