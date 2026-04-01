import express from "express";
import type { Router } from "express";
import AuthenticationController from "./controller.js";

const authRouter: Router = express.Router();
const authController = new AuthenticationController();

authRouter.post("/sign-up", authController.handleSignUp.bind(authController));
authRouter.post("/sign-in", authController.handleSingIn.bind(authController));

export default authRouter;
