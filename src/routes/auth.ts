import { Router } from "express";
import { getLogin } from "../controllers/auth";

const router = Router();

// /login => GET
router.get("/login", getLogin);

export default router;