import Diagnostico from './Diagnostico.js';

export const crearDiagnostico = async (req, res) => {
  try {
    const { userId, puntaje, nivel, respuestas } = req.body;

    // Validar campos obligatorios
    if (!userId || !puntaje || !nivel || !respuestas) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Crear el registro en la BD
    const nuevoDiagnostico = await Diagnostico.create({
      userId,
      puntaje,
      nivel,
      respuestas
    });

    res.status(201).json({
      message: "Diagnóstico registrado exitosamente",
      diagnostico: nuevoDiagnostico
    });
  } catch (error) {
    console.error("Error al registrar diagnóstico:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
