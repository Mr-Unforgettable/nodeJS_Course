import { RequestHandler } from "express";

export const getLogin: RequestHandler = async (_req, res, _next) => {
  try {
    res.render("auth/login", {
      pageTitle: "🔐 Login",
      path: "/login",
    });
  } catch (error) {
    console.error("failed to open the login page.");
    res.status(500).send({ message: "Internal Server Error." });
  }
};
