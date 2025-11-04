import express from "express";
import { 
  asignarEvaluacion,
  obtenerEvaluacionesAsignadas,
  obtenerDetalleEvaluacion
} from "../M05Evaluacion/evaluacionUsuarioController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { rolRequerido } from "../middlewares/rolMW.js";


const router = express.Router();

// Rutas para profesores
router.post("/asignar", verifyToken , rolRequerido(["profesor", "ia"]), asignarEvaluacion);

// Rutas para estudiantes
router.get("/estudiante/asignadas", verifyToken, rolRequerido(["estudiante"]), obtenerEvaluacionesAsignadas);
router.get("/:id/estudiante", verifyToken, rolRequerido(["estudiante"]), obtenerDetalleEvaluacion);

export default router;