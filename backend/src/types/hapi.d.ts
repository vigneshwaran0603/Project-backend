import "@hapi/hapi";

declare module "@hapi/hapi" {
  interface RequestApplicationState {
    user?: {
      _id: string;
      role: "student" | "staff" | "admin";
    };
  }
}