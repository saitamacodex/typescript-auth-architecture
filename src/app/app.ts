import express, { type Application } from "express";

export function createExppressApp(): Application {
  const app = express();

  // middleware

  // routes
  app.get("/", (req, res) => {
    res.json({
      message: "welcome to AUTH arch.",
    });
  });

  return app;
}
