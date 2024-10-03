import { RequestHandler } from "express";


export const isAuth: RequestHandler = async (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  next();
};
