import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { rolRequerido } from '../middlewares/rolMW.js';
import {
    crearCurso,
    obtenerCursosProfesor,
    obtenerCursosEstudiante,
    inscribirEstudiante,
    obtenerEstudiantesCurso,
    eliminarEstudianteCurso
} from './cursoController.js';

const router = Router();

// Rutas para profesores
router.post('/', verifyToken, rolRequerido("profesor"), crearCurso);
router.get('/profesor', verifyToken, rolRequerido("profesor"), obtenerCursosProfesor);
router.get('/:id/estudiantes', verifyToken, rolRequerido("profesor"), obtenerEstudiantesCurso);
router.post('/inscribir', verifyToken, rolRequerido("profesor"), inscribirEstudiante);
router.delete('/:cursoId/estudiantes/:estudianteId', verifyToken, rolRequerido("profesor"), eliminarEstudianteCurso);

// Rutas para estudiantes
router.get('/estudiante', verifyToken, rolRequerido("estudiante"), obtenerCursosEstudiante);

export default router;
