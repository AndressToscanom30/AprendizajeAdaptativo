import express from "express";
import iaController from "./iaController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import EvaluacionUsuario from "../M05Evaluacion/EvaluacionUsuario.js";
import Evaluacion from "../M05Evaluacion/Evaluacion.js";

const router = express.Router();

// Middleware de autenticación en todas las rutas
router.use(verifyToken);

// 🤖 ANÁLISIS Y GENERACIÓN AUTOMÁTICA
// Analizar un intento finalizado
router.post("/analizar-intento/:intentoId", (req, res) => iaController.analizarIntento(req, res));

// Generar test adaptativo basado en análisis
router.post("/generar-test-adaptativo/:analisisId", (req, res) => iaController.generarTestAdaptativo(req, res));

// 📊 CONSULTAS DEL ESTUDIANTE
// Obtener todos los análisis del usuario
router.get("/mis-analisis", (req, res) => iaController.obtenerMisAnalisis(req, res));

// Obtener un análisis específico
router.get("/analisis/:analisisId", (req, res) => iaController.obtenerAnalisisDetallado(req, res));

// Obtener un test adaptativo específico
router.get("/test-adaptativo/:testId", (req, res) => iaController.obtenerTestAdaptativo(req, res));

// 🎯 NUEVAS RUTAS PARA EVALUACIONES ADAPTATIVAS
// Obtener todas las evaluaciones adaptativas del estudiante
router.get("/mis-evaluaciones-adaptativas", async (req, res) => {
  try {
    const evaluaciones = await EvaluacionUsuario.findAll({
      where: { 
        usuarioId: req.user.id 
      },
      include: [{
        model: Evaluacion,
        as: 'evaluacion',
        where: { tipo: 'adaptativo' },
        required: true
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      total: evaluaciones.length,
      evaluaciones: evaluaciones.map(ev => ({
        id: ev.id,
        evaluacion: ev.evaluacion,
        estado: ev.estado,
        puntaje: ev.puntaje,
        fecha_asignacion: ev.fecha_asignacion
      }))
    });
  } catch (error) {
    console.error('Error obteniendo evaluaciones adaptativas:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔄 REINTENTAR CONVERSIÓN DE TESTS PENDIENTES
router.post("/reintentar-conversion", (req, res) => iaController.reintentarConversionPendiente(req, res));

// 🔄 REGENERAR ANÁLISIS EN ERROR
router.post("/regenerar-analisis-error", (req, res) => iaController.regenerarAnalisisError(req, res));

export default router;
