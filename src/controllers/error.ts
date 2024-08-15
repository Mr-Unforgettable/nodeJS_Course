import { RequestHandler } from "express";

export const getPageNotFound: RequestHandler = (req, res, _next) => {
  res.status(404).render("404", {
    pageTitle: "⚠️ 404 - Page Not Found!",
    isAuthenticated: req.session.isLoggedIn,
    path: "/404",
  });
};