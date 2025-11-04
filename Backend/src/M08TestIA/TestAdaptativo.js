import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TestAdaptativo = sequelize.define("TestAdaptativo", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Users",
      key: "id"
    },
    onDelete: "CASCADE"
  },
  tema: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nivel_inicial: {
    type: DataTypes.ENUM("basico", "intermedio", "avanzado"),
    defaultValue: "intermedio"
  },
  nivel_alcanzado: {
    type: DataTypes.ENUM("basico", "intermedio", "avanzado"),
    allowNull: true
  },
  total_preguntas: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  preguntas_respondidas: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  respuestas_correctas: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  puntaje_final: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  tiempo_total_segundos: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  areas_fuertes: {
    type: DataTypes.JSONB, // ["algebra", "geometria"]
    allowNull: true
  },
  areas_debiles: {
    type: DataTypes.JSONB, // ["trigonometria", "calculo"]
    allowNull: true
  },
  recomendaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM("en_progreso", "completado", "abandonado"),
    defaultValue: "en_progreso"
  },
  iniciado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  finalizado_en: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB, // datos adicionales del test
    allowNull: true
  }
}, {
  tableName: "TestAdaptativo",
  timestamps: true
});

export default TestAdaptativo;
