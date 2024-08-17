import { RequestHandler } from "express";
import { User } from "../models/user";

export const getLogin: RequestHandler = async (req, res, _next) => {
  try {
    // const isLoggedIn = req.get("Cookie")?.split("=")[1].trim();
    res.render("auth/login", {
      pageTitle: "🔐 Login",
      isAuthenticated: false,
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
    const user = await User.findById("6690e25c129cb3961870bdc4");
    if (user) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        if (err) {
          console.log(err);
        }
        res.redirect("/");
      });
    }
  } catch (error) {
    console.error("Invalid credentials.");
    res.status(403).send({ message: "Not Authorized." });
  }
};

export const postLogout: RequestHandler = async (req, res, _next) => {
  try {
    req.session.destroy(() => {
      res.redirect("/");
    });
  } catch (error) {
    console.error("Something went wrong.");
    res.status(500).send({ message: "Internal Server Error." });
  }
};
