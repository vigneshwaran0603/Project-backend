  import { Server } from "@hapi/hapi";
  import {
    downloadMyHallticketHandler,
    generateHallticketHandler,
    getMyHallticketHandler,
  } from "./handler";

  import { authenticate } from "../../middleware/authenticate";
  import { authorize } from "../../middleware/authorize";

  export const hallticketRoutes = {
    name: "hallticketRoutes",

    register: async function (server: Server) {
      server.route([
        {
          method: "POST",
          path: "/hallticket/download",
          handler: generateHallticketHandler,
          options: {
            pre: [
              { method: authenticate, assign: "user" },
              { method: authorize(["student"]) },
            ],
          },
        },

        {
          method: "GET",
          path: "/hallticket/me",
          handler: getMyHallticketHandler,
          options: {
            pre: [
              { method: authenticate, assign: "user" },
              { method: authorize(["student"]) },
            ],
          },
        },

        {
  method: "GET",
  path: "/hallticket/download",
  handler: downloadMyHallticketHandler,
  options: {
    pre: [
      { method: authenticate, assign: "user" },
      { method: authorize(["student"]) },
    ],
  },
},
      ]);
    },
  };