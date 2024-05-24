import { Router } from "express";
import { getPageNotFound } from "../controllers/error";

const router = Router();

router.use(getPageNotFound);

export default router;
