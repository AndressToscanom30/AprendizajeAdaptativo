import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "../M02Usuarios/User.js";
import Evaluacion from "./Evaluacion.js";

const EvaluacionUsuario = sequelize.define("EvaluacionUsuario", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  estado: {
    type: DataTypes.ENUM("pendiente", "en_progreso", "completada"),
    defaultValue: "pendiente",
  },
  puntaje: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  iniciado_en: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  terminado_en: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

// Relaciones belongsTo para poder hacer includes
EvaluacionUsuario.belongsTo(User, { foreignKey: "usuarioId", as: "usuario" });
EvaluacionUsuario.belongsTo(Evaluacion, { foreignKey: "evaluacionId", as: "evaluacion" });

User.belongsToMany(Evaluacion, {
  through: EvaluacionUsuario,
  as: "EvaluacionesAsignadas",
  foreignKey: "usuarioId",
});

Evaluacion.belongsToMany(User, {
  through: EvaluacionUsuario,
  as: "UsuariosAsignados",
  foreignKey: "evaluacionId",
});

export default EvaluacionUsuario;
