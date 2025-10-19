import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "../M02Usuarios/User.js";

const Evaluacion = sequelize.define('Evaluacion', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
    },
    duracion_minutos: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    comienza_en: {
        type: DataTypes.DATE,
        allowNull: true
    },
    termina_en: {
        type: DataTypes.DATE,
        allowNull: true
    },
    preguntas_revueltas: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    max_intentos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    creado_por: {
        type: DataTypes.UUID,
        allowNull: false
    },
    configuracion: {
        type: DataTypes.JSONB,
        allowNull: true
    }
}, {
    tableName: "Evaluacion",
    underscored: true
});

Evaluacion.belongsTo(User, {
    as: "creator",
    foreignKey: "creado_por"
});

export default Evaluacion;