import Pregunta from "./Pregunta.js";
import OpcionPregunta from "./OpcionPregunta.js";

export const crearPregunta = async (req, res) => {
    try {
        const {
            texto,
            tipo,
            dificultad,
            metadata,
            explicacion
        } = req.body;
        const creado_por = req.user.id;

        const pregunta = await Pregunta.create(({
            texto,
            tipo,
            dificultad,
            metadata,
            explicacion,
            creado_por
        }));
        return res.status(201).json(pregunta);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear pregunta", error: error.message });
    }
};

export const editarPregunta = async (req, res) => {
    try {
        const { id } = req.body;
        const pregunta = await Pregunta.findByPk(id);
        if (!pregunta) return res.status(404).json({ message: "Pregunta no encontrada" });

        await pregunta.update(payload);
        return res.json(pregunta);
    } catch (error) {
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