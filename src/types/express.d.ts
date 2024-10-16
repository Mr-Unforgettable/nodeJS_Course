import "express";
import { User } from "../models/user";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      csrfToken?: () => string;
    }

    // type csrfToken = {
    //   csrfToken: () => string;
    // };
  }
}
