import express, { type Application } from "express";
import authRouter from "./auth/route.js";
import { authMiddleware } from "./middleware/auth.middleware.js";

export function createExppressApp(): Application {
  const app = express();

  // middleware
  app.use(express.json());
  app.use(authMiddleware());

  // routes
  app.use("/auth", authRouter);

  return app;
}
