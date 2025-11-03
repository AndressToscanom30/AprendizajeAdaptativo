import { Router } from "express";
import { 
    registrarUsuario,
    recuperarPassword,
    resetPassword,
    obtenerUsuarios,
    obtenerEstudiantesConProfesores,
    obtenerProfesoresConEstudiantes,
    verificarRelacionEstudianteProfesor
} from "./userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.post("/usuarios", registrarUsuario);
router.post("/recover", recuperarPassword);
router.post("/reset-password", resetPassword);

// Obtener todos los usuarios
router.get("/", verifyToken, obtenerUsuarios);

// Rutas para gestión de relaciones estudiante-profesor
router.get("/estudiantes-profesores", verifyToken, obtenerEstudiantesConProfesores);
router.get("/profesores-estudiantes", verifyToken, obtenerProfesoresConEstudiantes);
router.get("/verificar-relacion", verifyToken, verificarRelacionEstudianteProfesor);

export default router;