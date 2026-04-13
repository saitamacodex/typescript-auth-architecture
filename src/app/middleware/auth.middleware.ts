import type { Request, Response, NextFunction } from "express";
import { verifyUserToken } from "../auth/utils/token.js";

export const authMiddleware = () => {
  return function (req: Request, res: Response, next: NextFunction) {
    const header = req.headers["authorization"];

    if (!header) return next(); // if not authrixation header pass it - do not restrict anything
    if (!header?.startsWith("Bearer")) {
      return res.status(400).json({
        error: "authorization header must starts with Bearer",
      });
    }
    // if user is passing token then do validation
    const token = header.split(" ")[1];
    if (!token) {
      return res.status(400).json({
        error: "Not Authenticated",
      });
    }
    // verify token
    try {
      const user = verifyUserToken(token);
      // if no user found with the provied token
      if (!user) {
        return res.status(401).json({
          error: "Invalid or expired token",
        });
      }
      // @ts-ignore
      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({
        error: "Invalid or expired token",
      });
    }
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
