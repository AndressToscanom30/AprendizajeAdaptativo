import express from "express";
import iaController from "./iaController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Middleware de autenticación en todas las rutas
router.use(verifyToken);

// Analizar un intento finalizado
router.post("/analizar-intento/:intentoId", iaController.analizarIntento);

// Generar test adaptativo basado en análisis
router.post("/generar-test-adaptativo/:analisisId", iaController.generarTestAdaptativo);

// Obtener todos los análisis del usuario
router.get("/mis-analisis", iaController.obtenerMisAnalisis);

// Obtener un análisis específico
router.get("/analisis/:analisisId", iaController.obtenerAnalisisDetallado);

// Obtener un test adaptativo específico
router.get("/test-adaptativo/:testId", iaController.obtenerTestAdaptativo);

export default router;
