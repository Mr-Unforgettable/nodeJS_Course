import { RequestHandler } from "express";

export const getLogin: RequestHandler = async (req, res, _next) => {
  try {
    const isLoggedIn = req.get("Cookie")?.split("=")[1].trim();
    res.render("auth/login", {
      pageTitle: "🔐 Login",
      isAuthenticated: isLoggedIn,
      path: "/login",
    });
  } catch (error) {
    console.error("failed to open the login page.");
    res.status(500).send({ message: "Internal Server Error." });
  }
};

export const postLogin: RequestHandler = async (req, res, _next) => {
  try {
  //  res.setHeader("Set-Cookie", "isLoggedIn=true; HttpOnly");
    req.session.isLoggedIn = true;
    res.redirect("/");
  } catch (error) {
    console.error("Invalid credentials.");
    res.status(403).send({ message: "Not Authorized." });
  }
};
