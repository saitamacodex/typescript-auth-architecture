import type { Request, Response, NextFunction } from "express";
import { verifyUserToken } from "../auth/utils/token.js";

export const authMiddleware = () => {
  return function (req: Request, res: Response, next: NextFunction) {
    const header = req.headers["authorization"];
    if (!header) next(); // if not authrixation header pass it - do not restrict anything
    if (!header?.startsWith("Bearer")) {
      return res.status(400).json({
        error: "authorization header must starts with Bearer",
      });
    }
    const token = header.split(" ")[1];
    if (!token) {
      return res.status(400).json({
        error: "Not Authenticated",
      });
    }
    const user = verifyUserToken(token);
    // @ts-ignore
    req.user = user;

    next();
  };
};

export function restrictToAuthUser() {
  return function (req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    if (!req.user) {
      return res.status(401).json({
        error: "Authention required",
      });
    }
    return next();
  };
}
