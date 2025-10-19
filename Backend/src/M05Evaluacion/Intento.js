import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "../M02Usuarios/User.js";

const Intento = sequelize.define("Intento", {
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
    evaluacionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Evaluacion",
            key: "id"
        },
        onDelete: "CASCADE"
    },
    iniciado_en: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    finalizado_en: {
        type: DataTypes.DATE,
        allowNull: true
    },
    total_puntaje: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM("progreso", "enviado", "calificado", "revisado"),
        defaultValue: "progreso"
    },
    metadata: {
        type: DataTypes.JSONB,
        allowNull: true
    }
}, {
    tableName: "Intento",
    underscored: true
});

Intento.belongsTo(User, {
    as: "user",
    foreignKey: "userId"
});

export default Intento;