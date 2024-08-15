import { Router } from "express";
import { getLogin, postLogin } from "../controllers/auth";

const router = Router();

// /login => GET
router.get("/login", getLogin);

// /login => POST
router.post("/login", postLogin);

export default router;