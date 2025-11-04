import { Op } from "sequelize";
import sequelize from "../config/db.js";
import User from "../M02Usuarios/User.js";
import Course from "../M04Curso/Curso.js";
import CourseStudent from "../M04Curso/CourseStudent.js";
import Evaluacion from "../M05Evaluacion/Evaluacion.js";
import Intento from "../M05Evaluacion/Intento.js";
import EvaluacionUsuario from "../M05Evaluacion/EvaluacionUsuario.js";
import TestAdaptativo from "../M08TestIA/TestAdaptativo.js";

/**
 * Obtener progreso general del estudiante
 */
export const obtenerProgresoGeneral = async (req, res) => {
  try {
    const estudianteId = req.user.id;

    // Cursos inscritos
    const cursos = await CourseStudent.findAll({
      where: { studentId: estudianteId }
    });

    // Evaluaciones asignadas
    const evaluacionesAsignadas = await EvaluacionUsuario.findAll({
      where: { usuarioId: estudianteId }
    });

    // Intentos realizados
    const intentos = await Intento.findAll({
      where: { userId: estudianteId }
    });

    // Tests adaptativos completados
    const tests = await TestAdaptativo.findAll({
      where: { userId: estudianteId, estado: "completado" }
    });

    // Calcular promedios
    const intentosCalificados = intentos.filter(i => i.total_puntaje !== null);
    const promedio_evaluaciones = intentosCalificados.length > 0
      ? intentosCalificados.reduce((sum, i) => sum + i.total_puntaje, 0) / intentosCalificados.length
      : 0;

    const testsCalificados = tests.filter(t => t.puntaje_final !== null);
    const promedio_tests = testsCalificados.length > 0
      ? testsCalificados.reduce((sum, t) => sum + t.puntaje_final, 0) / testsCalificados.length
      : 0;

    const promedio_general = (promedio_evaluaciones + promedio_tests) / 2;

    // Evaluaciones completadas vs asignadas
    const evaluaciones_completadas = evaluacionesAsignadas.filter(
      ev => ev.estado === "completada"
    ).length;

    const porcentaje_completado = evaluacionesAsignadas.length > 0
      ? (evaluaciones_completadas / evaluacionesAsignadas.length) * 100
      : 0;

    return res.json({
      progreso: {
        cursos_activos: cursos.length,
        evaluaciones_asignadas: evaluacionesAsignadas.length,
        evaluaciones_completadas,
        porcentaje_completado: porcentaje_completado.toFixed(2),
        tests_realizados: tests.length,
        promedio_general: promedio_general.toFixed(2),
        promedio_evaluaciones: promedio_evaluaciones.toFixed(2),
        promedio_tests: promedio_tests.toFixed(2)
      }
    });

  } catch (error) {
    console.error("Error al obtener progreso general:", error);
    return res.status(500).json({ 
      message: "Error al obtener progreso", 
      error: error.message 
    });
  }
};

/**
 * Obtener estadísticas para el dashboard del estudiante
 */
export const obtenerEstadisticasDashboard = async (req, res) => {
  try {
    const estudianteId = req.user.id;

    // Cursos con información completa
    const estudiante = await User.findByPk(estudianteId, {
      include: [
        {
          model: Course,
          as: "cursosInscritos",
          include: [
            {
              model: User,
              as: "profesor",
              attributes: ["id", "nombre", "email"]
            }
          ],
          through: { attributes: ["inscrito_en", "estado"] }
        }
      ]
    });

    // Evaluaciones pendientes (asignadas pero no completadas)
    const evaluacionesPendientes = await EvaluacionUsuario.findAll({
      where: {
        usuarioId: estudianteId,
        estado: { [Op.ne]: "completada" }
      },
      include: [
        {
          model: Evaluacion,
          as: "evaluacion",
          attributes: ["id", "titulo", "descripcion", "termina_en", "duracion_minutos"]
        }
      ],
      order: [["createdAt", "DESC"]],
      limit: 5
    });

    // Últimos intentos de evaluaciones
    const ultimosIntentos = await Intento.findAll({
      where: { userId: estudianteId },
      include: [
        {
          model: Evaluacion,
          as: "evaluacion",
          attributes: ["id", "titulo"]
        }
      ],
      order: [["finalizado_en", "DESC"]],
      limit: 5
    });

    // Tests adaptativos recientes
    const testsRecientes = await TestAdaptativo.findAll({
      where: { userId: estudianteId },
      order: [["finalizado_en", "DESC"]],
      limit: 5,
      attributes: [
        "id", "tema", "puntaje_final", "nivel_alcanzado", 
        "estado", "finalizado_en"
      ]
    });

    // Rendimiento por mes (últimos 6 meses)
    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);

    const intentosPorMes = await Intento.findAll({
      where: {
        userId: estudianteId,
        finalizado_en: { [Op.gte]: seisMesesAtras }
      },
      attributes: [
        [sequelize.fn("DATE_TRUNC", "month", sequelize.col("finalizado_en")), "mes"],
        [sequelize.fn("AVG", sequelize.col("total_puntaje")), "promedio"],
        [sequelize.fn("COUNT", sequelize.col("id")), "total"]
      ],
      group: [sequelize.fn("DATE_TRUNC", "month", sequelize.col("finalizado_en"))],
      order: [[sequelize.fn("DATE_TRUNC", "month", sequelize.col("finalizado_en")), "ASC"]],
      raw: true
    });

    return res.json({
      cursos: estudiante.cursosInscritos || [],
      evaluaciones_pendientes: evaluacionesPendientes
        .filter(ev => ev.evaluacion !== null) // Filtrar evaluaciones eliminadas
        .map(ev => ({
          id: ev.evaluacion.id,
          titulo: ev.evaluacion.titulo,
          descripcion: ev.evaluacion.descripcion,
          termina_en: ev.evaluacion.termina_en,
          duracion_minutos: ev.evaluacion.duracion_minutos,
          estado: ev.estado
        })),
      ultimos_intentos: ultimosIntentos
        .filter(i => i.evaluacion !== null) // Filtrar intentos de evaluaciones eliminadas
        .map(i => ({
          id: i.id,
          evaluacion_titulo: i.evaluacion?.titulo,
        puntaje: i.total_puntaje,
        status: i.status,
        finalizado_en: i.finalizado_en
      })),
      tests_recientes: testsRecientes,
      rendimiento_mensual: intentosPorMes
    });

  } catch (error) {
    console.error("Error al obtener estadísticas dashboard:", error);
    return res.status(500).json({ 
      message: "Error al obtener estadísticas", 
      error: error.message 
    });
  }
};

/**
 * Obtener progreso en un curso específico
 */
export const obtenerProgresoCurso = async (req, res) => {
  try {
    const { cursoId } = req.params;
    const estudianteId = req.user.id;

    // Verificar que el estudiante esté inscrito
    const inscripcion = await CourseStudent.findOne({
      where: {
        studentId: estudianteId,
        courseId: cursoId
      }
    });

    if (!inscripcion) {
      return res.status(404).json({ message: "No estás inscrito en este curso" });
    }

    // Información del curso
    const curso = await Course.findByPk(cursoId, {
      include: [
        {
          model: User,
          as: "profesor",
          attributes: ["id", "nombre", "email"]
        }
      ]
    });

    // Evaluaciones del curso
    const evaluaciones = await Evaluacion.findAll({
      where: { curso_id: cursoId }
    });

    // Intentos del estudiante en evaluaciones del curso
    const intentos = await Intento.findAll({
      where: {
        userId: estudianteId,
        evaluacionId: { [Op.in]: evaluaciones.map(e => e.id) }
      },
      include: [
        {
          model: Evaluacion,
          as: "evaluacion",
          attributes: ["id", "titulo", "duracion_minutos"]
        }
      ]
    });

    // Calcular progreso
    const evaluaciones_completadas = new Set(
      intentos.filter(i => i.status === "calificado").map(i => i.evaluacionId)
    ).size;

    const porcentaje_progreso = evaluaciones.length > 0
      ? (evaluaciones_completadas / evaluaciones.length) * 100
      : 0;

    const intentosCalificados = intentos.filter(i => i.total_puntaje !== null);
    const promedio_curso = intentosCalificados.length > 0
      ? intentosCalificados.reduce((sum, i) => sum + i.total_puntaje, 0) / intentosCalificados.length
      : 0;

    return res.json({
      curso: {
        id: curso.id,
        titulo: curso.titulo,
        descripcion: curso.descripcion,
        profesor: curso.profesor
      },
      inscripcion: {
        inscrito_en: inscripcion.inscrito_en,
        estado: inscripcion.estado
      },
      progreso: {
        evaluaciones_totales: evaluaciones.length,
        evaluaciones_completadas,
        porcentaje_progreso: porcentaje_progreso.toFixed(2),
        promedio_curso: promedio_curso.toFixed(2),
        intentos_realizados: intentos.length
      },
      intentos: intentos.map(i => ({
        id: i.id,
        evaluacion: i.evaluacion?.titulo,
        puntaje: i.total_puntaje,
        status: i.status,
        finalizado_en: i.finalizado_en
      }))
    });

  } catch (error) {
    console.error("Error al obtener progreso del curso:", error);
    return res.status(500).json({ 
      message: "Error al obtener progreso del curso", 
      error: error.message 
    });
  }
};

/**
 * Obtener evaluaciones pendientes con countdown
 */
export const obtenerEvaluacionesPendientes = async (req, res) => {
  try {
    const estudianteId = req.user.id;
    const ahora = new Date();

    const evaluacionesPendientes = await EvaluacionUsuario.findAll({
      where: {
        usuarioId: estudianteId,
        estado: { [Op.in]: ["pendiente", "en_progreso"] }
      },
      include: [
        {
          model: Evaluacion,
          as: "evaluacion",
          where: {
            activa: true,
            termina_en: { [Op.gt]: ahora } // Solo las que no han expirado
          },
          attributes: [
            "id", "titulo", "descripcion", "duracion_minutos", 
            "max_intentos", "comienza_en", "termina_en"
          ]
        }
      ],
      order: [["evaluacion", "termina_en", "ASC"]]
    });

    const pendientes = evaluacionesPendientes.map(ev => {
      const evaluacion = ev.evaluacion;
      const tiempo_restante_ms = new Date(evaluacion.termina_en) - ahora;
      const dias_restantes = Math.floor(tiempo_restante_ms / (1000 * 60 * 60 * 24));
      const horas_restantes = Math.floor((tiempo_restante_ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      return {
        id: evaluacion.id,
        titulo: evaluacion.titulo,
        descripcion: evaluacion.descripcion,
        duracion_minutos: evaluacion.duracion_minutos,
        max_intentos: evaluacion.max_intentos,
        comienza_en: evaluacion.comienza_en,
        termina_en: evaluacion.termina_en,
        estado: ev.estado,
        tiempo_restante: {
          dias: dias_restantes,
          horas: horas_restantes,
          urgente: dias_restantes < 2
        }
      };
    });

    return res.json({
      total: pendientes.length,
      evaluaciones: pendientes
    });

  } catch (error) {
    console.error("Error al obtener evaluaciones pendientes:", error);
    return res.status(500).json({ 
      message: "Error al obtener evaluaciones pendientes", 
      error: error.message 
    });
  }
};

/**
 * Obtener actividad reciente del estudiante
 */
export const obtenerActividadReciente = async (req, res) => {
  try {
    const estudianteId = req.user.id;
    const ultimoMes = new Date();
    ultimoMes.setMonth(ultimoMes.getMonth() - 1);

    // Intentos recientes
    const intentosRecientes = await Intento.findAll({
      where: {
        userId: estudianteId,
        createdAt: { [Op.gte]: ultimoMes }
      },
      include: [
        {
          model: Evaluacion,
          as: "evaluacion",
          attributes: ["id", "titulo"]
        }
      ],
      order: [["createdAt", "DESC"]],
      limit: 10
    });

    // Tests recientes
    const testsRecientes = await TestAdaptativo.findAll({
      where: {
        userId: estudianteId,
        createdAt: { [Op.gte]: ultimoMes }
      },
      order: [["createdAt", "DESC"]],
      limit: 10,
      attributes: ["id", "tema", "estado", "puntaje_final", "createdAt"]
    });

    // Combinar y ordenar toda la actividad
    const actividad = [
      ...intentosRecientes.map(i => ({
        tipo: "evaluacion",
        id: i.id,
        titulo: i.evaluacion?.titulo || "Evaluación",
        puntaje: i.total_puntaje,
        status: i.status,
        fecha: i.createdAt
      })),
      ...testsRecientes.map(t => ({
        tipo: "test_adaptativo",
        id: t.id,
        titulo: `Test: ${t.tema}`,
        puntaje: t.puntaje_final,
        status: t.estado,
        fecha: t.createdAt
      }))
    ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 15);

    return res.json({
      total: actividad.length,
      actividad
    });

  } catch (error) {
    console.error("Error al obtener actividad reciente:", error);
    return res.status(500).json({ 
      message: "Error al obtener actividad", 
      error: error.message 
    });
  }
};
