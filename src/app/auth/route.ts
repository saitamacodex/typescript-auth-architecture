import express from "express";
import type { Router } from "express";
import AuthenticationController from "./controller.js";
import { restrictToAuthUser } from "../middleware/auth.middleware.js";

const authRouter: Router = express.Router();
const authController = new AuthenticationController();

authRouter.post("/sign-up", authController.handleSignUp.bind(authController));
authRouter.post("/sign-in", authController.handleSingIn.bind(authController));
authRouter.get(
  "/me",
  restrictToAuthUser(),
  authController.getMe.bind(authController),
);

export default authRouter;
