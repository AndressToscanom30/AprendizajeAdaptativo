import { Router } from "express";
import { login, refreshToken } from './authController.js';

const router = Router();

router.post("/login", login);
router.post("/refresh",  refreshToken)

export default router;