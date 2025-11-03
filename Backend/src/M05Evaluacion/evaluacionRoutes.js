import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { rolRequerido } from '../middlewares/rolMW.js';
import { 
    crearEvaluacion, 
    editarEvaluacion, 
    borrarEvaluacion, 
    obtenerEvaluaciones,
    obtenerEvaluacionPorId,
    obtenerEvaluacionesProfesor,
    agregarPreguntaAEvaluacion,
    removerPreguntaDeEvaluacion,
    asignarEvaluacion,
    obtenerEvaluacionesEstudiante,
    obtenerEstudiantesConEvaluacion
} from './evaluacionController.js';

const router = Router();

// Rutas básicas
router.post('/', verifyToken, rolRequerido("profesor"), crearEvaluacion);
router.put('/:id', verifyToken, rolRequerido("profesor"), editarEvaluacion);
router.delete('/:id', verifyToken, rolRequerido("profesor"), borrarEvaluacion);

// Rutas específicas ANTES de las genéricas
router.get('/profesor/:id', verifyToken, obtenerEvaluacionesProfesor);
router.get('/estudiante/asignadas', verifyToken, rolRequerido("estudiante"), obtenerEvaluacionesEstudiante);
router.get('/:id/estudiantes', verifyToken, rolRequerido("profesor"), obtenerEstudiantesConEvaluacion);
router.post('/asignar', verifyToken, rolRequerido("profesor"), asignarEvaluacion);

// Rutas genéricas
router.get('/', verifyToken, obtenerEvaluaciones);
router.get('/:id', verifyToken, obtenerEvaluacionPorId);

// Rutas para manejar preguntas
router.post("/:evaluacionId/preguntas", verifyToken, rolRequerido("profesor"), agregarPreguntaAEvaluacion);
router.delete("/:evaluacionId/preguntas/:preguntaId", verifyToken, rolRequerido("profesor"), removerPreguntaDeEvaluacion);

export default router;
