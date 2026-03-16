// login/router.ts

import Hapi from "@hapi/hapi";
import { loginHandler } from "./handler";

export const loginRoutes: Hapi.Plugin<undefined> = {
  name: "login-routes",
  register: async (server: Hapi.Server) => {
    server.route({
      method: "POST",
      path: "/login",
      handler: loginHandler,
    });
  },
};
