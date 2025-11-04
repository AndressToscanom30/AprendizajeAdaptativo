import EvaluacionUsuario from "./EvaluacionUsuario.js";
import Evaluacion from "./Evaluacion.js";
import User from "../M02Usuarios/User.js";
import Intento from "./Intento.js";
import { Op } from "sequelize";

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

        const intentosRealizados = await Intento.count({
          where: {
            evaluacionId: asignacion.evaluacionId,
            userId: estudianteId
          }
        });

        const mejorIntento = await Intento.findOne({
          where: {
            evaluacionId: asignacion.evaluacionId,
            userId: estudianteId
          },
          order: [["total_puntaje", "DESC"]]
        });

        const ahora = new Date();
        const terminaEn = asignacion.evaluacion.termina_en ? new Date(asignacion.evaluacion.termina_en) : null;
        const diasRestantes = terminaEn ? Math.ceil((terminaEn - ahora) / (1000 * 60 * 60 * 24)) : null;

        return {
          ...asignacion.toJSON(),
          intentos_realizados: intentosRealizados,
          mejor_calificacion: mejorIntento?.total_puntaje || 0,
          dias_restantes: diasRestantes,
          tiempo_agotado: terminaEn ? ahora > terminaEn : false,
          puede_realizar: !terminaEn || ahora <= terminaEn
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

    // Obtener intentos previos
    const intentos = await Intento.findAll({
      where: {
        evaluacionId: id,
        userId: estudianteId
      },
      order: [["iniciado_en", "DESC"]]
    });

    const ahora = new Date();
    const terminaEn = asignacion.evaluacion.termina_en ? new Date(asignacion.evaluacion.termina_en) : null;
    const puedeRealizar = 
      (!terminaEn || ahora <= terminaEn) && 
      intentos.length < asignacion.evaluacion.max_intentos;

    res.json({
      ...asignacion.toJSON(),
      intentos_realizados: intentos,
      puede_realizar: puedeRealizar,
      intentos_restantes: asignacion.evaluacion.max_intentos - intentos.length,
      tiempo_agotado: terminaEn ? ahora > terminaEn : false
    });
  } catch (error) {
    console.error("Error al obtener detalle de evaluación:", error);
    res.status(500).json({ message: "Error al obtener detalles.", error: error.message });
  }
};
