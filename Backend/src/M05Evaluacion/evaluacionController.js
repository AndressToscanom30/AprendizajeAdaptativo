import {
    Evaluacion,
    Pregunta,
    PreguntaEvaluacion,
    Intento,
    OpcionPregunta,
    User
} from "../config/relaciones.js";
import EvaluacionUsuario from "./EvaluacionUsuario.js";

export const crearEvaluacion = async (req, res) => {
    try {
        const {
            titulo,
            descripcion,
            duracion_minutos,
            comienza_en,
            termina_en,
            preguntas_revueltas,
            max_intentos,
            configuracion,
            profesor_id,
            curso_id,
            activa
        } = req.body;
        const creado_por = req.body.profesor_id || req.user.id;

        const nueva = await Evaluacion.create({
            titulo, 
            descripcion, 
            duracion_minutos, 
            comienza_en, 
            termina_en,
            preguntas_revueltas, 
            max_intentos, 
            creado_por, 
            configuracion,
            curso_id,
            activa: activa !== undefined ? activa : true
        });

        return res.status(201).json(nueva);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear la evaluación", error: error.message });
    }
}

export const editarEvaluacion = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;

        const evaluacion = await Evaluacion.findByPk(id);
        if (!evaluacion) return res.status(404).json({ messsage: "Evaluación no encontrada." });

        if (req.user.role !== "profesor" && req.user.role !== "ia") {
            return res.status(403).json({ message: "No tienes permisos para crear evaluaciones." });
        }

        await evaluacion.update(payload);
        return res.json(evaluacion);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al editar evaluación", error: error.message });
    }
};

export const borrarEvaluacion = async (req, res) => {
    try {
        const { id } = req.params;
        const evaluacion = await Evaluacion.findByPk(id);
        if (!evaluacion) return res.status(404).json({ message: "Evaluación no encontrada" });

        await evaluacion.destroy();
        return res.json({ message: "Evaluación eliminada" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al eliminar evaluación", error: error.message });
    }
};

export const obtenerEvaluaciones = async (req, res) => {
    try {
        const rol = req.user.rol;

        if (rol === "profesor" || rol === "ia") {
            const evaluaciones = await Evaluacion.findAll();
            return res.json(evaluaciones);
        }

        if (rol === "estudiante") {
            const evaluaciones = await Evaluacion.findAll({
                attributes: [
                    "id",
                    "titulo",
                    "descripcion",
                    "duracion_minutos",
                    "comienza_en",
                    "termina_en",
                    "preguntas_revueltas"
                ],
            });
            return res.json(evaluaciones);
        }

        return res.status(403).json({ message: "Rol no permitido" });

    } catch (error) {
        console.error("Error al obtener evaluaciones:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const obtenerEvaluacionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.rol;

    const evaluacion = await Evaluacion.findByPk(id, {
      include: [
        {
          model: Pregunta,
          as: "Preguntas",
          include: [
            {
              model: OpcionPregunta,
              as: "opciones",
              attributes: ["id", "texto", "es_correcta"]
            }
          ],
          through: {
            model: PreguntaEvaluacion,
            attributes: ["puntos", "orden"]
          }
        }
      ]
    });

    if (!evaluacion) {
      return res.status(404).json({ message: "Evaluación no encontrada" });
    }

    if (userRole === "profesor" || userRole === "ia") {
      return res.json(evaluacion);
    }

    if (userRole === "estudiante") {
      // Verificar si el estudiante tiene asignada esta evaluación
      const asignacion = await EvaluacionUsuario.findOne({
        where: { 
          usuarioId: userId,
          evaluacionId: id
        }
      });
      
      if (!asignacion) {
        return res.status(403).json({ message: "No tienes permiso para ver esta evaluación." });
      }

      const intentos = await Intento.count({
        where: { userId, evaluacionId: id }
      });

      const haAlcanzadoMax = intentos >= evaluacion.max_intentos;

      evaluacion.Preguntas.forEach((pregunta) => {
        pregunta.opciones = pregunta.opciones.map((op) => ({
          id: op.id,
          texto: op.texto,
          ...(userRole !== "estudiante" || haAlcanzadoMax ? { es_correcta: op.es_correcta } : {})
        }));
      });

      return res.json({
        ...evaluacion.toJSON(),
        intentosRealizados: intentos,
        puedeVerRespuestas: haAlcanzadoMax
      });
    }

    return res.status(403).json({ message: "No tienes permiso para ver esta evaluación." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la evaluación." });
  }
};

export const agregarPreguntaAEvaluacion = async (req, res) => {
    try {
        const { evaluacionId } = req.params;
        const { preguntaId, puntos = 0, orden = null } = req.body;

        const evaluacion = await Evaluacion.findByPk(evaluacionId);
        if (!evaluacion) return res.status(404).json({ message: "Evaluación no encontrada" });

        const pregunta = await Pregunta.findByPk(preguntaId);
        if (!pregunta) return res.status(404).json({ message: "Pregunta no encontrada" });

        const relacion = await PreguntaEvaluacion.create({
            evaluacionId,
            preguntaId,
            puntos: puntos,
            orden
        });

        return res.status(201).json(relacion);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al agregar pregunta", error: error.message });
    }
};

export const removerPreguntaDeEvaluacion = async (req, res) => {
    try {
        const { evaluacionId, preguntaId } = req.params;

        const eliminado = await PreguntaEvaluacion.destroy({
            where: { evaluacionId, preguntaId }
        });

        if (!eliminado) return res.status(404).json({ message: "Relación no encontrada" });

        return res.json({ message: "Pregunta removida de la evaluación" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al remover pregunta", error: error.message });
    }
};

export const obtenerEvaluacionesProfesor = async (req, res) => {
    try {
        console.log('Usuario autenticado:', req.user);
        const profesorId = req.params.id;

        if (req.user.rol !== "profesor" && req.user.rol !== "ia") {
            return res.status(403).json({ message: "No tienes permisos para ver estas evaluaciones." });
        }

        const evaluaciones = await Evaluacion.findAll({
            where: { creado_por: profesorId },
            order: [['created_at', 'DESC']]
        });

        res.json(evaluaciones);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error al obtener evaluaciones' });
    }
};

// Asignar evaluación a estudiantes
export const asignarEvaluacion = async (req, res) => {
    try {
        const { evaluacionId, estudiantesIds } = req.body;
        const profesorId = req.user.id;

        // Verificar que la evaluación pertenece al profesor
        const evaluacion = await Evaluacion.findOne({
            where: { id: evaluacionId, creado_por: profesorId }
        });

        if (!evaluacion) {
            return res.status(404).json({ message: "Evaluación no encontrada o no tienes permiso" });
        }

        // Asignar a cada estudiante
        const asignaciones = await Promise.all(
            estudiantesIds.map(estudianteId =>
                EvaluacionUsuario.findOrCreate({
                    where: { evaluacionId, usuarioId: estudianteId },
                    defaults: { estado: "pendiente" }
                })
            )
        );

        return res.json({ 
            message: "Evaluación asignada exitosamente",
            asignaciones: asignaciones.length
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al asignar evaluación", error: error.message });
    }
};

// Obtener evaluaciones asignadas a un estudiante
export const obtenerEvaluacionesEstudiante = async (req, res) => {
    try {
        const estudianteId = req.user.id;

        const evaluacionesAsignadas = await EvaluacionUsuario.findAll({
            where: { usuarioId: estudianteId },
            include: [
                {
                    model: Evaluacion,
                    as: "evaluacion",
                    where: { activa: true },
                    required: true
                }
            ]
        });

        const evaluaciones = evaluacionesAsignadas.map(ea => ({
            ...ea.evaluacion.toJSON(),
            asignacion: {
                estado: ea.estado,
                puntaje: ea.puntaje,
                iniciado_en: ea.iniciado_en,
                terminado_en: ea.terminado_en
            }
        }));

        return res.json(evaluaciones);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener evaluaciones", error: error.message });
    }
};

// Obtener estudiantes con una evaluación asignada
export const obtenerEstudiantesConEvaluacion = async (req, res) => {
    try {
        const { id } = req.params;
        const profesorId = req.user.id;

        // Verificar que la evaluación pertenece al profesor
        const evaluacion = await Evaluacion.findOne({
            where: { id, creado_por: profesorId }
        });

        if (!evaluacion) {
            return res.status(404).json({ message: "Evaluación no encontrada" });
        }

        const asignaciones = await EvaluacionUsuario.findAll({
            where: { evaluacionId: id },
            include: [
                {
                    model: User,
                    as: "usuario",
                    attributes: ["id", "nombre", "email"]
                }
            ]
        });

        return res.json(asignaciones);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener estudiantes", error: error.message });
    }
};