import { Router } from "express";
import { getLogin, postLogin, postLogout } from "../controllers/auth";

const router = Router();

// /login => GET
router.get("/login", getLogin);

// /login => POST
router.post("/login", postLogin);

// /logout => POST
router.post("/logout", postLogout);
export default router;