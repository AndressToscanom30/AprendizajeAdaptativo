import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js'; 

const AnalisisIA = sequelize.define('AnalisisIA', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.UUID,  
    allowNull: false,
    field: 'usuario_id'
  },
  intentoId: {
    type: DataTypes.UUID,  
    allowNull: false,
    field: 'intento_id'
  },
  puntuacionGlobal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'puntuacion_global'
  },
  porcentajeTotal: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: 'porcentaje_total'
  },
  debilidades: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  fortalezas: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  categoriasAnalisis: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'categorias_analisis',
    defaultValue: []
  },
  recomendaciones: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  tiempoEstudioSugerido: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'tiempo_estudio_sugerido'
  },
  estado: {
    type: DataTypes.ENUM('procesando', 'completado', 'error'),
    defaultValue: 'procesando'
  }
}, {
  tableName: 'AnalisisIA',
  timestamps: true,
  underscored: false
});

export default AnalisisIA;