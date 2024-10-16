import "express";
import { User } from "../models/user";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }

    type csrfToken = {
      csrfToken: () => string;
    };
  }
}
