import { Router } from "express";
import { 
    registrarUsuario,
    recuperarPassword,
    verifyCode,
    resetPassword
} from "../controllers/userController.js";

const router = Router();

router.post("/usuarios", registrarUsuario);
router.post("/recover", recuperarPassword);
router.post("/verify-code", verifyCode);
router.post("/reset-password", resetPassword);

export default router;