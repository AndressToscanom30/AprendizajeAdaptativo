import { Router } from "express";
import { 
    registrarUsuario,
    recuperarPassword,
    resetPassword,
    obtenerUsuarios,
    obtenerEstudiantesConProfesores,
    obtenerProfesoresConEstudiantes,
    verificarRelacionEstudianteProfesor,
    actualizarPerfil,
    cambiarPassword
} from "./userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { rolRequerido } from "../middlewares/rolMW.js";

const router = Router();

router.post("/usuarios", registrarUsuario);
router.post("/recover", recuperarPassword);
router.post("/reset-password", resetPassword);

// Obtener todos los usuarios (solo admin y profesores para sus cursos)
router.get("/", verifyToken, rolRequerido(["profesor", "admin"]), obtenerUsuarios);

// Rutas para gestión de relaciones estudiante-profesor (SOLO ADMIN)
router.get("/estudiantes-profesores", verifyToken, rolRequerido(["admin"]), obtenerEstudiantesConProfesores);
router.get("/profesores-estudiantes", verifyToken, rolRequerido(["admin"]), obtenerProfesoresConEstudiantes);
router.get("/verificar-relacion", verifyToken, rolRequerido(["admin"]), verificarRelacionEstudianteProfesor);

// Actualizar perfil y cambiar contraseña
router.put("/:id", verifyToken, actualizarPerfil);
router.post("/change-password", verifyToken, cambiarPassword);

export default router;