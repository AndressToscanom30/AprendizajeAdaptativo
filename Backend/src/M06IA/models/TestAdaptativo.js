import { DataTypes } from "sequelize";
import sequelize from '../../config/db.js';

const TestAdaptativo = sequelize.define(
  "TestAdaptativo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuarioId: {
      type: DataTypes.UUID, 
      allowNull: false,
      field: "usuario_id",
    },
    analisisId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "analisis_id",
    },
    preguntas: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    enfoque: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    evaluacionId: {
      type: DataTypes.UUID, 
      allowNull: true,
      field: "evaluacion_id",
    },
    estado: {
      type: DataTypes.ENUM(
        "generado",
        "en_uso",
        "completado",
        "convertido_evaluacion"
      ),
      defaultValue: "generado",
    },
  },
  {
    tableName: "TestsAdaptativos",
    timestamps: true,
    underscored: false,
  }
);

export default TestAdaptativo;
