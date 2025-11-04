import { Router } from "express";
import {
  generarBusquedas,
  buscarVideos,
  generarRecomendaciones,
  analizarVideo,
} from "./recursosController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

// Generar búsquedas inteligentes con Groq
router.post("/generar-busquedas", verifyToken, generarBusquedas);

// Buscar videos en YouTube
router.get("/videos", verifyToken, buscarVideos);

// Generar recomendaciones personalizadas
router.post("/recomendaciones", verifyToken, generarRecomendaciones);

// Analizar un video específico
router.post("/analizar-video", verifyToken, analizarVideo);

export default router;
