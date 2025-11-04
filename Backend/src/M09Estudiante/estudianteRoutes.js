import { Router } from "express";
import { 
  obtenerProgresoGeneral,
  obtenerEstadisticasDashboard,
  obtenerProgresoCurso,
  obtenerEvaluacionesPendientes,
  obtenerActividadReciente
} from "./estudianteController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { rolRequerido } from "../middlewares/rolMW.js";

const router = Router();

// Todas las rutas requieren autenticación de estudiante

// Progreso general del estudiante
router.get("/progreso", verifyToken, rolRequerido("estudiante"), obtenerProgresoGeneral);

// Estadísticas para el dashboard
router.get("/estadisticas", verifyToken, rolRequerido("estudiante"), obtenerEstadisticasDashboard);

// Progreso en un curso específico
router.get("/cursos/:cursoId/progreso", verifyToken, rolRequerido("estudiante"), obtenerProgresoCurso);

// Evaluaciones pendientes
router.get("/evaluaciones/pendientes", verifyToken, rolRequerido("estudiante"), obtenerEvaluacionesPendientes);

// Actividad reciente
router.get("/actividad", verifyToken, rolRequerido("estudiante"), obtenerActividadReciente);

export default router;
