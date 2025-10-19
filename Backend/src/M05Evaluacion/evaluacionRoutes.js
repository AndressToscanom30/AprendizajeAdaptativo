import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js"; // ajusta ruta
import { rolRequerido } from "../middlewares/rolMW.js"
import {
  crearEvaluacion,
  editarEvaluacion,
  borrarEvaluacion,
  obtenerEvaluaciones,
  obtenerEvaluacionPorId,
  agregarPreguntaAEvaluacion,
  removerPreguntaDeEvaluacion
} from "./evaluacionController.js";

const router = Router();

// Profesores (o IA) crean/editar/eliminar
router.post("/", verifyToken, rolRequerido("profesor"), crearEvaluacion);
router.put("/:id", verifyToken, rolRequerido("profesor"), editarEvaluacion);
router.delete("/:id", verifyToken, rolRequerido("profesor"), borrarEvaluacion);

// Obtener lista / detalle
router.get("/", verifyToken, obtenerEvaluaciones);
router.get("/:id", verifyToken, obtenerEvaluacionPorId);

// Agregar / remover preguntas (profesor)
router.post("/:evaluacionId/preguntas", verifyToken, rolRequerido("profesor"), agregarPreguntaAEvaluacion);
router.delete("/:evaluacionId/preguntas/:preguntaId", verifyToken, rolRequerido("profesor"), removerPreguntaDeEvaluacion);

export default router;
