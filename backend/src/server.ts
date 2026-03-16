import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./database/mongo";

import { applicationRoutes } from "./api/application/router";
import { loginRoutes } from "./api/login/router";
import { staffRoutes } from "./api/admin/createStaff/router";
import { studentRoutes } from "./api/staff/createStudent/router";
import { attendanceRoutes } from "./api/attendance/router";
import { subjectRoutes } from "./api/subject/router";
import { feeStructureRoutes } from "./api/feesStructure/router";
import { feesPaymentRoutes } from "./api/fees payment/router";
import { hallticketRoutes } from "./api/hallticket/router";

const init = async () => {

  await connectDB();

  const server = Hapi.server({
    port: 4000,
    host: "localhost",

    routes: {
      cors: {
        origin: ["*"], // allow all origins (frontend access)
        credentials: true,
      },
    },
  });

  // Register Routes
  await server.register(applicationRoutes);
  await server.register(staffRoutes);
  await server.register(studentRoutes);
  await server.register(loginRoutes);
  await server.register(attendanceRoutes);
  await server.register(subjectRoutes);
  await server.register(feesPaymentRoutes);
  await server.register(feeStructureRoutes);
  await server.register(hallticketRoutes);

  await server.start();

  console.log("✅ Server running at:", server.info.uri);
};

init();