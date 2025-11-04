import EvaluacionUsuario from "./EvaluacionUsuario.js";
import Evaluacion from "./Evaluacion.js";
import User from "../M02Usuarios/User.js";
import Intento from "./Intento.js";
import PreguntaEvaluacion from "./PreguntaEvaluacion.js";
import { Op } from "sequelize";
import sequelize from "../config/db.js";

export const asignarEvaluacion = async (req, res) => {
  try {
    const { evaluacionId, usuarioId } = req.body;

    const evaluacion = await Evaluacion.findByPk(evaluacionId);
    const usuario = await User.findByPk(usuarioId);

    if (!evaluacion || !usuario)
      return res.status(404).json({ message: "Evaluación o usuario no encontrado." });

    await EvaluacionUsuario.create({ evaluacionId, usuarioId });

    res.json({ message: "Evaluación asignada correctamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al asignar evaluación." });
  }
};

/**
 * Obtener todas las evaluaciones asignadas a un estudiante
 */
export const obtenerEvaluacionesAsignadas = async (req, res) => {
  try {
    const estudianteId = req.user.id;
    const { estado } = req.query; // Filtro opcional: pendiente, en_progreso, completada

    const whereClause = { usuarioId: estudianteId };
    if (estado) {
      whereClause.estado = estado;
    }

    const evaluacionesAsignadas = await EvaluacionUsuario.findAll({
      where: whereClause,
      include: [
        {
          model: Evaluacion,
          as: "evaluacion",
          include: [
            {
              model: User,
              as: "creator",
              attributes: ["id", "nombre", "email"]
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    // Calcular información adicional para cada evaluación
    const evaluacionesConInfo = await Promise.all(
      evaluacionesAsignadas.map(async (asignacion) => {
        // Validar que la evaluación exista
        if (!asignacion.evaluacion) {
          console.warn(`EvaluacionUsuario ${asignacion.id} tiene evaluacionId null o evaluación eliminada`);
          return null;
        }

        // Contar solo intentos completados (enviado, calificado, revisado)
        const intentosRealizados = await Intento.count({
          where: {
            evaluacionId: asignacion.evaluacionId,
            userId: estudianteId,
            status: {
              [Op.in]: ["enviado", "calificado", "revisado"]
            }
          }
        });

        // Mejor intento solo de los completados
        const mejorIntento = await Intento.findOne({
          where: {
            evaluacionId: asignacion.evaluacionId,
            userId: estudianteId,
            status: {
              [Op.in]: ["enviado", "calificado", "revisado"]
            }
          },
          order: [["total_puntaje", "DESC"]]
        });

        const ahora = new Date();
        const terminaEn = asignacion.evaluacion.termina_en ? new Date(asignacion.evaluacion.termina_en) : null;
        const diasRestantes = terminaEn ? Math.ceil((terminaEn - ahora) / (1000 * 60 * 60 * 24)) : null;
        const maxIntentos = asignacion.evaluacion.max_intentos || 1;

        return {
          ...asignacion.toJSON(),
          intentos_realizados: intentosRealizados,
          max_intentos: maxIntentos,
          intentos_restantes: Math.max(0, maxIntentos - intentosRealizados),
          mejor_calificacion: mejorIntento?.total_puntaje || 0,
          dias_restantes: diasRestantes,
          tiempo_agotado: terminaEn ? ahora > terminaEn : false,
          puede_realizar: (!terminaEn || ahora <= terminaEn) && intentosRealizados < maxIntentos
        };
      })
    );

    // Filtrar nulls (evaluaciones que no existen)
    const evaluacionesValidas = evaluacionesConInfo.filter(ev => ev !== null);

    res.json(evaluacionesValidas);
  } catch (error) {
    console.error("Error al obtener evaluaciones asignadas:", error);
    res.status(500).json({ message: "Error al obtener evaluaciones.", error: error.message });
  }
};

/**
 * Obtener detalles de una evaluación específica para el estudiante
 */
export const obtenerDetalleEvaluacion = async (req, res) => {
  try {
    const { id } = req.params;
    const estudianteId = req.user.id;

    // Verificar que la evaluación esté asignada al estudiante
    const asignacion = await EvaluacionUsuario.findOne({
      where: {
        evaluacionId: id,
        usuarioId: estudianteId
      },
      include: [
        {
          model: Evaluacion,
          as: "evaluacion",
          include: [
            {
              model: User,
              as: "creator",
              attributes: ["id", "nombre", "email"]
            }
          ]
        }
      ]
    });

    if (!asignacion) {
      return res.status(404).json({ message: "Evaluación no encontrada o no asignada." });
    }

    // Calcular el puntaje total de la evaluación usando Sequelize
    const preguntasEvaluacion = await PreguntaEvaluacion.findAll({
      where: { evaluacionId: id },
      attributes: ['puntos']
    });

    const puntajeTotal = preguntasEvaluacion.reduce((sum, pe) => sum + (pe.puntos || 0), 0);

    // 🆕 Limpiar intentos abandonados (más de 24 horas en progreso)
    const hace24Horas = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await Intento.destroy({
      where: {
        evaluacionId: id,
        userId: estudianteId,
        status: 'progreso',
        iniciado_en: {
          [Op.lt]: hace24Horas
        }
      }
    });

    // Obtener intentos previos
    const intentos = await Intento.findAll({
      where: {
        evaluacionId: id,
        userId: estudianteId
      },
      order: [["iniciado_en", "DESC"]]
    });

    // Contar solo intentos completados para validación
    const intentosCompletados = intentos.filter(
      i => i.status === "enviado" || i.status === "calificado" || i.status === "revisado"
    ).length;

    const ahora = new Date();
    const terminaEn = asignacion.evaluacion.termina_en ? new Date(asignacion.evaluacion.termina_en) : null;
    const puedeRealizar = 
      (!terminaEn || ahora <= terminaEn) && 
      intentosCompletados < asignacion.evaluacion.max_intentos;

    res.json({
      ...asignacion.toJSON(),
      intentos_realizados: intentos,
      puede_realizar: puedeRealizar,
      intentos_restantes: asignacion.evaluacion.max_intentos - intentosCompletados,
      tiempo_agotado: terminaEn ? ahora > terminaEn : false,
      puntaje_total: puntajeTotal
    });
  } catch (error) {
    console.error("Error al obtener detalle de evaluación:", error);
    res.status(500).json({ message: "Error al obtener detalles.", error: error.message });
  }
};
