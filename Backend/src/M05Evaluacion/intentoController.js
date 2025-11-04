import Intento from "./Intento.js";
import IntentoRespuesta from "./IntentoRespuesta.js";
import Evaluacion from "./Evaluacion.js";
import Pregunta from "./Pregunta.js";
import OpcionPregunta from "./OpcionPregunta.js";
import PreguntaEvaluacion from "./PreguntaEvaluacion.js";
import EvaluacionUsuario from "./EvaluacionUsuario.js";
import sequelize from "../config/db.js";
import { Op } from "sequelize";
import iaController from "../M06IA/iaController.js";

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

        // 🆕 PRIMERO: Buscar si hay un intento en progreso
        const intentoEnProgreso = await Intento.findOne({
            where: {
                userId,
                evaluacionId,
                status: 'progreso'
            },
            transaction: t
        });

        if (intentoEnProgreso) {
            await t.commit();
            console.log(`✅ Reanudando intento en progreso: ${intentoEnProgreso.id}`);
            return res.status(200).json(intentoEnProgreso);
        }

        // Verificar intentos disponibles (solo contar intentos enviados)
        const contador = await Intento.count({ 
            where: { 
                userId, 
                evaluacionId,
                status: {
                    [Op.in]: ['enviado', 'calificado', 'revisado']
                }
            },
            transaction: t 
        });
        
        console.log(`Usuario ${userId} - Evaluación ${evaluacionId}`);
        console.log(`Intentos completados: ${contador}, Máximo permitido: ${evaluacion.max_intentos}`);

        if (evaluacion.max_intentos !== null && contador >= evaluacion.max_intentos) {
            await t.rollback();
            return res.status(403).json({ 
                message: "No quedan intentos disponibles",
                intentos_realizados: contador,
                max_intentos: evaluacion.max_intentos
            });
        }

        // Crear nuevo intento
        const intento = await Intento.create({
            userId,
            evaluacionId,
            iniciado_en: new Date(),
            status: "progreso"
        }, { transaction: t });

        // Actualizar estado de EvaluacionUsuario a "en_progreso"
        await EvaluacionUsuario.update(
            { estado: "en_progreso" },
            { 
                where: { evaluacionId, usuarioId: userId },
                transaction: t 
            }
        );

        await t.commit();
        console.log(`🆕 Nuevo intento creado: ${intento.id}`);
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
        console.log('📝 INICIANDO enviarRespuestas');
        const userId = req.user.id;
        const { intentoId } = req.params;
        const { respuestas } = req.body;

        console.log(`🔍 Intento ID: ${intentoId}, User ID: ${userId}`);
        console.log(`📊 Respuestas recibidas: ${respuestas?.length || 0}`);

        const intento = await Intento.findByPk(intentoId, { transaction: t });
        if (!intento) {
            console.log('❌ Intento no encontrado');
            await t.rollback();
            return res.status(404).json({ message: "Intento no encontrado" });
        }
        if (intento.userId !== userId && req.user.role !== "profesor") {
            console.log('❌ Usuario no autorizado');
            await t.rollback();
            return res.status(403).json({ message: "No puedes enviar este inteto" });
        }

        console.log('✅ Intento válido, procesando respuestas...');
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

        intento.total_puntaje = totalScore;
        intento.status = "enviado";
        intento.finalizado_en = new Date();
        await intento.save({ transaction: t });

        console.log(`💾 Guardando intento con puntaje: ${totalScore}`);

        // Actualizar estado de EvaluacionUsuario a "completada"
        await EvaluacionUsuario.update(
            { 
                estado: "completada",
                puntaje: totalScore,
                terminado_en: new Date()
            },
            { 
                where: { evaluacionId: intento.evaluacionId, usuarioId: userId },
                transaction: t 
            }
        );

        console.log('✅ Haciendo commit de la transacción...');
        await t.commit();
        
        // Calcular puntaje total DESPUÉS del commit para evitar deadlock
        await calcularPuntajeTotal(intento.id);
        
        console.log(`🎉 INTENTO ENVIADO EXITOSAMENTE - Puntaje: ${totalScore}`);
        
        // 🤖 ANÁLISIS AUTOMÁTICO CON IA - No bloqueante
        // Ejecutar en segundo plano sin esperar
        setImmediate(async () => {
            try {
                console.log(`🚀 Iniciando análisis IA en segundo plano para intento ${intento.id}`);
                await iaController.analizarYGenerarAutomatico(intento.id, userId);
                console.log(`✅ Análisis IA completado para intento ${intento.id}`);
            } catch (error) {
                console.error(`⚠️ Error en análisis IA (no crítico):`, error.message);
                // No afecta la respuesta al usuario
            }
        });
        
        return res.json({ 
            intentoId: intento.id, 
            totalScore,
            mensaje: "Intento enviado. Tu test adaptativo se está generando..." 
        });
    } catch (error) {
        console.error('💥 ERROR en enviarRespuestas:', error);
        await t.rollback();
        return res.status(500).json({ message: "Error al enviar respuestas", error: error.message });
    }
};

const calcularPuntajeTotal = async (intentoId) => {
    try {
        console.log(`📊 Calculando puntaje total para intento: ${intentoId}`);
        const intento = await Intento.findByPk(intentoId, {
            include: [
                {
                    model: IntentoRespuesta,
                    as: "respuestas"
                }
            ]
        });

        if (!intento) {
            console.log('⚠️ Intento no encontrado en calcularPuntajeTotal');
            return 0;
        }
        
        if (!intento.respuestas) {
            console.log('⚠️ No hay respuestas en el intento');
            return 0;
        }

        const total = intento.respuestas.reduce((sum, r) => {
            return sum + (r.puntos_obtenidos || 0);
        }, 0);

        console.log(`✅ Puntaje recalculado: ${total}`);
        intento.total_puntaje = total;
        await intento.save();
        return total;
    } catch (error) {
        console.error('❌ Error en calcularPuntajeTotal:', error);
        return 0;
    }
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