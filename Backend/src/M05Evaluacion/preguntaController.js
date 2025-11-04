import Pregunta from "./Pregunta.js";
import OpcionPregunta from "./OpcionPregunta.js";
import PreguntaEvaluacion from "./PreguntaEvaluacion.js";
import sequelize from "../config/db.js";

export const crearPregunta = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            texto,
            tipo,
            dificultad,
            puntos,
            tiempo_sugerido,
            metadata,
            explicacion,
            opciones,
            evaluacion_id
        } = req.body;
        const creado_por = req.user.id;

        // Crear la pregunta
        const pregunta = await Pregunta.create({
            texto,
            tipo,
            dificultad,
            puntos,
            tiempo_sugerido,
            metadata,
            explicacion,
            creado_por
        }, { transaction: t });

        // Crear las opciones si existen
        if (opciones && Array.isArray(opciones) && opciones.length > 0) {
            const opcionesData = opciones.map(opcion => ({
                preguntaId: pregunta.id,
                texto: opcion.texto,
                es_correcta: opcion.es_correcta || false,
                metadata: opcion.metadata || null
            }));
            
            await OpcionPregunta.bulkCreate(opcionesData, { transaction: t });
        }

        // Asociar con evaluación si se proporciona
        if (evaluacion_id) {
            await PreguntaEvaluacion.create({
                evaluacionId: evaluacion_id,
                preguntaId: pregunta.id,
                puntos: puntos || 1,
                orden: 0 // Puedes ajustar esto según necesites
            }, { transaction: t });
        }

        await t.commit();

        // Recargar con opciones para retornar
        const preguntaCompleta = await Pregunta.findByPk(pregunta.id, {
            include: [{
                model: OpcionPregunta,
                as: "opciones"
            }]
        });

        return res.status(201).json(preguntaCompleta);
    } catch (error) {
        await t.rollback();
        console.error(error);
        return res.status(500).json({ message: "Error al crear pregunta", error: error.message });
    }
};

export const editarPregunta = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const {
            texto,
            tipo,
            dificultad,
            puntos,
            tiempo_sugerido,
            metadata,
            explicacion,
            opciones
        } = req.body;

        const pregunta = await Pregunta.findByPk(id, { transaction: t });
        if (!pregunta) {
            await t.rollback();
            return res.status(404).json({ message: "Pregunta no encontrada" });
        }

        // Actualizar pregunta
        await pregunta.update({
            texto,
            tipo,
            dificultad,
            puntos,
            tiempo_sugerido,
            metadata,
            explicacion
        }, { transaction: t });

        // Actualizar opciones si se proporcionan
        if (opciones && Array.isArray(opciones)) {
            // Eliminar opciones existentes
            await OpcionPregunta.destroy({
                where: { preguntaId: id },
                transaction: t
            });

            // Crear nuevas opciones
            if (opciones.length > 0) {
                const opcionesData = opciones.map(opcion => ({
                    preguntaId: id,
                    texto: opcion.texto,
                    es_correcta: opcion.es_correcta || false,
                    metadata: opcion.metadata || null
                }));
                
                await OpcionPregunta.bulkCreate(opcionesData, { transaction: t });
            }
        }

        await t.commit();

        // Recargar con opciones
        const preguntaCompleta = await Pregunta.findByPk(id, {
            include: [{
                model: OpcionPregunta,
                as: "opciones"
            }]
        });

        return res.json(preguntaCompleta);
    } catch (error) {
        await t.rollback();
        console.error(error);
        return res.status(500).json({ message: "Error al editar pregunta", error: error.message });
    }
};

export const eliminarPregunta = async (req, res) => {
    try {
        const { id } = req.params;
        const pregunta = await Pregunta.findByPk(id);
        if (!pregunta) return res.status(404).json({ message: "Pregunta no encontrada" });

        await pregunta.destroy();
        return res.json({ message: "Pregunta eliminada" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al eliminar pregunta", error: error.message });
    }
};

//Opciones también

export const crearOpcion = async (req, res) => {
    try {
        const { preguntaId } = req.params;
        const { texto, es_correcta = false, metadata } = req.body;

        const opcion = await OpcionPregunta.create({
            preguntaId,
            texto,
            es_correcta,
            metadata
        });

        return res.status(201).json(opcion);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear opción", error: error.message });
    }
};

export const editarOpcion = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;

        const opcion = await OpcionPregunta.findByPk(id);
        if (!opcion) return res.status(404).json({ message: "Opción no encontrada" });

        await opcion.update(payload);
        return res.json(opcion);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al editar opción", error: error.message });
    }
};

export const eliminarOpcion = async (req, res) => {
  try {
    const { id } = req.params;
    const opcion = await OpcionPregunta.findByPk(id);
    if (!opcion) return res.status(404).json({ message: "Opción no encontrada" });

    await opcion.destroy();
    return res.json({ message: "Opción eliminada" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar opción", error: error.message });
  }
};