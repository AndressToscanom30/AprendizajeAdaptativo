import { Router } from "express";
import { 
    registrarUsuario,
    recuperarPassword,
    resetPassword
} from "../controllers/userController.js";

const router = Router();

router.post("/usuarios", registrarUsuario);
router.post("/recover", recuperarPassword);
router.post("/reset-password", resetPassword);

export default router;