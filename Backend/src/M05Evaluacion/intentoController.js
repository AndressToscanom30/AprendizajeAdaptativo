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
                relacion_par,
                codigo,
                salida_codigo
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
            } else if (pregunta.tipo === "codigo") {
                // Validar pregunta de código
                const metadata = pregunta.opciones[0]?.metadata || {};
                const salidaEsperada = metadata.salida_esperada || '';
                
                // Comparar la salida del código del estudiante con la salida esperada
                // Limpiar espacios en blanco y saltos de línea para comparación
                const salidaEstudianteNormalizada = (salida_codigo || '').trim().replace(/\s+/g, ' ');
                const salidaEsperadaNormalizada = salidaEsperada.trim().replace(/\s+/g, ' ');
                
                es_correcta = salidaEstudianteNormalizada === salidaEsperadaNormalizada;
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
                codigo,
                salida_codigo,
                es_correcta,
                puntos_obtenidos
            }, { transaction: t });

            if (typeof puntos_obtenidos === "number") totalScore += puntos_obtenidos;
        }

        intento.total_puntaje = totalScore;
        intento.status = "enviado";
        intento.finalizado_en = new Date();
        await intento.save({ transaction: t });

        

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

        
        await t.commit();
        
        // Calcular puntaje total DESPUÉS del commit para evitar deadlock
        await calcularPuntajeTotal(intento.id);
        
        
        
        // 🤖 ANÁLISIS AUTOMÁTICO CON IA - No bloqueante
        // Ejecutar en segundo plano sin esperar
        setImmediate(async () => {
            try {
                
                await iaController.analizarYGenerarAutomatico(intento.id, userId);
                
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
        
        const intento = await Intento.findByPk(intentoId, {
            include: [
                {
                    model: IntentoRespuesta,
                    as: "respuestas"
                }
            ]
        });

        if (!intento) {
            
            return 0;
        }
        
        if (!intento.respuestas) {
            
            return 0;
        }

        const total = intento.respuestas.reduce((sum, r) => {
            return sum + (r.puntos_obtenidos || 0);
        }, 0);

        
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

export const obtenerDetallesIntento = async (req, res) => {
    try {
        const { intentoId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.rol;

        const intento = await Intento.findByPk(intentoId, {
            include: [
                {
                    model: Evaluacion,
                    as: "evaluacion",
                    include: [
                        {
                            model: Pregunta,
                            as: "Preguntas",
                            include: [
                                {
                                    model: OpcionPregunta,
                                    as: "opciones",
                                    attributes: ["id", "texto", "es_correcta", "metadata"]
                                }
                            ],
                            through: {
                                model: PreguntaEvaluacion,
                                attributes: ["puntos", "orden"]
                            }
                        }
                    ]
                },
                {
                    model: IntentoRespuesta,
                    as: "respuestas"
                }
            ]
        });

        if (!intento) {
            return res.status(404).json({ message: "Intento no encontrado" });
        }

        // Verificar permisos
        if (userRole === 'estudiante' && intento.userId !== userId) {
            return res.status(403).json({ message: "No tienes permiso para ver este intento" });
        }

        return res.json(intento);
    } catch (error) {
        console.error('Error al obtener detalles del intento:', error);
        return res.status(500).json({ message: "Error al obtener detalles", error: error.message });
    }
};