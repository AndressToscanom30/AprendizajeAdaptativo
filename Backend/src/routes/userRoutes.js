import { Router } from "express";
import { registrarUsuario } from "../controllers/userController.js";

const router = Router();

router.post("/usuarios", registrarUsuario);

export default router;