import { Router } from "express";
import { getLogin, postLogin, getSignup, postSignup, postLogout } from "../controllers/auth";

const router = Router();

// /login => GET
router.get("/login", getLogin);

// /login => POST
router.post("/login", postLogin);

// /signup => GET
router.get("/signup", getSignup);

// /signup => POST
router.post("/signup", postSignup);

// /logout => POST
router.post("/logout", postLogout);
export default router;
