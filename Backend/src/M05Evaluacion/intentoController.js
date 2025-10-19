import Intento from "./Intento.js";
import IntentoRespuesta from "./IntentoRespuesta.js";
import Evaluacion from "./Evaluacion.js";
import Pregunta from "./Pregunta.js";
import OpcionPregunta from "./OpcionPregunta.js";
import PreguntaEvaluacion from "./PreguntaEvaluacion.js";
import sequelize from "../config/db.js";

export const iniciarIntento = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = req.user.id;
        const { evaluacionId } = req.params;

        const evaluacion = await Evaluacion.findByPk(evaluacionId, { transaction: t });
        if (!evaluacion) {
            await t.rollback();
            return res.status(404).json({ message: "Evaluación no encontrada" });
        }

        if (evaluacion.max_intentos !== null && evaluacion.max_intentos >= 0) {
            const contador = await Intento.count({ where: { userId, evaluacionId } });
            if (contador >= evaluacion.max_intentos) {
                await t.rollback();
                return res.status(403).json({ message: "No quedan intentos disponibles" });
            }
        }

        const intento = await Intento.create({
            userId,
            evaluacionId,
            startedAt: new Date(),
            status: "progreso"
        }, { transaction: t });

        await t.commit();
        return res.status(201).json(intento);
    } catch (error) {
        console.error(error);
        await t.rollback();
        return res.status(500).json({ message: "Error al iniciar intento", error: error.message });
    }
}

export const enviarRespuestas = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = req.user.id;
        const { intentoId } = req.params;
        const { respuestas } = req.body;

        const intento = await Intento.findByPk(intentoId, { transaction: t });
        if (!intento) {
            await t.rollback();
            return res.status(404).json({ message: "Intento no encontrado" });
        }
        if (intento.userId !== userId && req.user.role !== "profesor") {
            await t.rollback();
            return res.status(403).json({ message: "No puedes enviar este inteto" });
        }

        let totalScore = 0;

        for (const r of respuestas) {
            const {
                preguntaId,
                opcionSeleccionadaId,
                opcion_seleccionadaIds,
                texto_respuesta,
                relacion_par
            } = r;

            const existente = await IntentoRespuesta.findOne({
                where: { intentoId, preguntaId },
                transaction: t
            });
            if (existente) continue;

            const pregunta = await Pregunta.findByPk(preguntaId, {
                include: [{ model: OpcionPregunta, as: "opciones" }],
                transaction: t
            });
            if (!pregunta) continue;

            let es_correcta = null;
            let puntos_obtenidos = 0;

            const via = await PreguntaEvaluacion.findOne({
                where: { evaluacionId: intento.evaluacionId, preguntaId },
                transaction: t
            });
            const pointsForQuestion = via ? via.puntos : 1;

            if (["opcion_multiple", "verdadero_falso"].includes(pregunta.tipo)) {
                const opcion = pregunta.opciones.find(o => o.id === opcionSeleccionadaId);
                es_correcta = !!(opcion && opcion.es_correcta);
                puntos_obtenidos = es_correcta ? pointsForQuestion : 0;
            } else if (pregunta.tipo === "seleccion_multiple") {
                const correctIds = pregunta.opciones.filter(o => o.es_correcta).map(o => o.id).sort();
                const selected = (opcion_seleccionadaIds || []).sort();
                es_correcta = JSON.stringify(correctIds) === JSON.stringify(selected);
                puntos_obtenidos = es_correcta ? pointsForQuestion : 0;
            } else if (pregunta.tipo === "relacion_par") {
                const correctPairs = pregunta.metadata?.correctPairs || [];
                es_correcta = JSON.stringify(correctPairs) === JSON.stringify(relacion_par || []);
                puntos_obtenidos = es_correcta ? pointsForQuestion : 0;
            } else {
                es_correcta = null;
                puntos_obtenidos = null;
            }

            await IntentoRespuesta.create({
                intentoId,
                preguntaId,
                opcionSeleccionadaId,
                opcion_seleccionadaIds,
                texto_respuesta,
                relacion_par,
                es_correcta,
                puntos_obtenidos
            }, { transaction: t });

            if (typeof puntos_obtenidos === "number") totalScore += puntos_obtenidos;
        }

        intento.puntos_obtenidos = totalScore;
        intento.status = "enviado";
        intento.finalizado_en = new Date();
        await intento.save({ transaction: t });

        await calcularPuntajeTotal(intento.id);

        await t.commit();
        return res.json({ intentoId: intento.id, totalScore });
    } catch (error) {
        console.error(error);
        await t.rollback();
        return res.status(500).json({ message: "Error al enviar respuestas", error: error.message });
    }
};

const calcularPuntajeTotal = async (intentoId) => {
    const intento = await Intento.findByPk(intentoId, {
        include: [
            {
                model: IntentoRespuesta,
                as: "respuestas"
            }
        ]
    });

    if (!intento || !intento.respuestas) return 0;

    const total = intento.respuestas.reduce((sum, r) => {
        return sum + (r.puntos_obtenidos || 0);
    }, 0);

    intento.total_puntaje = total;
    await intento.save();
    return total;
};

export const obtenerResultadoIntento = async (req, res) => {
    try {
        const { intentoId } = req.params;
        const intento = await Intento.findByPk(intentoId, {
            include: [{ model: IntentoRespuesta, as: "respuestas" }]
        });
        if (req.user.id !== intento.userId && req.user.rol !== "profesor") {
            return res.status(403).json({ message: "Acceso denegado" });
        }
        return res.json(intento);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener resultado", error: error.message });
    }
};

export const listarIntentosPorEvaluacion = async (req, res) => {
    try {
        const { evaluacionId } = req.params;
        const intentos = await Intento.findAll({ where: { evaluacionId } });
        return res.json(intentos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al listar intentos", error: error.message });
    }
};