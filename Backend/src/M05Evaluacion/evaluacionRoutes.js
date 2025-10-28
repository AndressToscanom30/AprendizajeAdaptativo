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
    agregarPreguntaAEvaluacion,  // Añadimos esta importación
    removerPreguntaDeEvaluacion
} from './evaluacionController.js';

const router = Router();

// Rutas básicas
router.post('/', verifyToken, rolRequerido("profesor"), crearEvaluacion);
router.put('/:id', verifyToken, rolRequerido("profesor"), editarEvaluacion);
router.delete('/:id', verifyToken, rolRequerido("profesor"), borrarEvaluacion);
router.get('/', verifyToken, obtenerEvaluaciones);
router.get('/:id', verifyToken, obtenerEvaluacionPorId);
router.get('/profesor/:id', verifyToken, obtenerEvaluacionesProfesor);

// Rutas para manejar preguntas
router.post("/:evaluacionId/preguntas", verifyToken, rolRequerido("profesor"), agregarPreguntaAEvaluacion);
router.delete("/:evaluacionId/preguntas/:preguntaId", verifyToken, rolRequerido("profesor"), removerPreguntaDeEvaluacion);

export default router;
