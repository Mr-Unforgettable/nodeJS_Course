import { RequestHandler } from "express";

export const getPageNotFound: RequestHandler = (_req, res, _next) => {
  res.status(404).render("404", {
    pageTitle: "⚠️ 404 - Page Not Found!",
    path: "/404",
  });
};