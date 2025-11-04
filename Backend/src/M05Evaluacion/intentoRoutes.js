import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { rolRequerido } from "../middlewares/rolMW.js";
import {
  iniciarIntento,
  enviarRespuestas,
  obtenerResultadoIntento,
  listarIntentosPorEvaluacion,
  obtenerDetallesIntento
} from "./intentoController.js";

const router = Router();

// Estudiante inicia intento
router.post("/evaluacion/:evaluacionId", verifyToken, rolRequerido("estudiante"), iniciarIntento);

// Enviar respuestas (propietario del intento o profesor)
router.post("/:intentoId/submit", verifyToken, enviarRespuestas);

// Obtener detalles completos del intento (con preguntas y respuestas)
router.get("/:intentoId/detalles", verifyToken, obtenerDetallesIntento);

// Obtener resultado de intento
router.get("/:intentoId", verifyToken, obtenerResultadoIntento);

// Listar intentos por evaluación (profesor)
router.get("/evaluacion/:evaluacionId/list", verifyToken, rolRequerido("profesor"), listarIntentosPorEvaluacion);

export default router;
