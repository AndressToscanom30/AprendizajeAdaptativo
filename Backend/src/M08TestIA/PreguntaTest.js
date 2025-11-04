import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PreguntaTest = sequelize.define("PreguntaTest", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
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
  orden: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  enunciado: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM("opcion_multiple", "verdadero_falso", "completar", "respuesta_corta"),
    defaultValue: "opcion_multiple"
  },
  opciones: {
    type: DataTypes.JSONB, // [{ id: "A", texto: "...", correcta: true }]
    allowNull: true
  },
  respuesta_correcta: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  explicacion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  nivel_dificultad: {
    type: DataTypes.ENUM("basico", "intermedio", "avanzado"),
    defaultValue: "intermedio"
  },
  area_conocimiento: {
    type: DataTypes.STRING, // "algebra", "geometria", etc.
    allowNull: true
  },
  tiempo_estimado_segundos: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  },
  puntos: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: "PreguntaTest",
  timestamps: true
});

export default PreguntaTest;
