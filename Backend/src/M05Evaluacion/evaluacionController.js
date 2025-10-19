import {
    Evaluacion,
    Pregunta,
    PreguntaEvaluacion,
    Intento
} from "../config/relaciones.js";
import { Op } from "sequelize";

export const crearEvaluacion = async (req, res) => {
    try {
        const {
            titulo,
            descripcion,
            duracion_minutos,
            comineza_en,
            termina_en,
            preguntas_revueltas,
            max_intentos,
            configuracion
        } = req.body;
        const creado_por = req.user.id;

        const nueva = await Evaluacion.create({
            titulo, descripcion, duracion_minutos, comineza_en, termina_en,
            preguntas_revueltas, max_intentos, creado_por, configuracion
        });

        return res.status(201).json(nueva);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ messsage: "Error al crear la evaluación", error: error.messsage });
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
        const {
            creador,
            q,
            disponible
        } = req.query;
        const where = {};

        if (creador) where.creado_por = creador;
        if (q) where.titulo = { [Op.iLike]: `%${q}%` };
        if (disponible === "true") {
            const now = new Date();
            where[Op.and] = [
                { [Op.or]: [{ comineza_en: null }, { comineza_en: { [Op.lte]: now } }] },
                { [Op.or]: [{ termina_en: null }, { termina_en: { [Op.gte]: now } }] }
            ];
        }
        const list = await Evaluacion.findAll({ where });
        return res.json(list);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener evaluaciones", error: error.message });
    }
};

export const obtenerEvaluacionPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const evaluacion = await Evaluacion.findByPk(id, {
            include: [
                {
                    model: Pregunta,
                    as: "Preguntas",
                    include: [
                        {
                            model: OpcionPregunta,
                            as: "opciones",
                            attributes: ["id", "texto", "es_correcto"]
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
            const intentos = await Intento.count({
                where: { userId, evaluacionId: id }
            });

            const haAlcanzadoMax = intentos >= evaluacion.max_intentos;

            if (!haAlcanzadoMax) {
                evaluacion.Preguntas.forEach((pregunta) => {
                    pregunta.opciones = pregunta.opciones.map((op) => ({
                        id: op.id,
                        texto: op.texto
                    }));
                });
            }

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