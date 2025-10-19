import EvaluacionUsuario from "./EvaluacionUsuario.js";
import Evaluacion from "./Evaluacion.js";
import User from "../M02Usuarios/User.js";

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
