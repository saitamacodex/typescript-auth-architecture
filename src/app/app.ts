import express, { type Application } from "express";
import authRouter from "./auth/route.js";

export function createExppressApp(): Application {
  const app = express();

  // middleware
  app.use(express.json());

  // routes
  app.use("/auth", authRouter);

  return app;
}
