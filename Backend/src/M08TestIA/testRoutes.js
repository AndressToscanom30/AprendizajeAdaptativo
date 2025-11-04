import { Router } from "express";
import {
  iniciarTest,
  responderPregunta,
  obtenerResultados,
  obtenerHistorialTests
} from "./testController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { rolRequerido } from "../middlewares/rolMW.js";

const router = Router();

// Todas las rutas requieren autenticación de estudiante

// Iniciar un nuevo test adaptativo
router.post("/iniciar", verifyToken, rolRequerido("estudiante"), iniciarTest);

// Responder una pregunta del test
router.post("/:testId/responder", verifyToken, rolRequerido("estudiante"), responderPregunta);

// Obtener resultados de un test
router.get("/:testId/resultados", verifyToken, rolRequerido("estudiante"), obtenerResultados);

// Obtener historial de tests del estudiante
router.get("/historial", verifyToken, rolRequerido("estudiante"), obtenerHistorialTests);

export default router;
