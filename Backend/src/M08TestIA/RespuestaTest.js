import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const RespuestaTest = sequelize.define("RespuestaTest", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  preguntaId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "PreguntaTest",
      key: "id"
    },
    onDelete: "CASCADE"
  },
  testId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "TestAdaptativo",
      key: "id"
    },
    onDelete: "CASCADE"
  },
  respuesta_usuario: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  es_correcta: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  tiempo_respuesta_segundos: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  puntos_obtenidos: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  respondida_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: "RespuestaTest",
  timestamps: true
});

export default RespuestaTest;
