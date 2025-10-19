import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const OpcionPregunta = sequelize.define("OpcionPregunta", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    preguntaId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Pregunta",
            key: "id"
        },
        onDelete: "CASCADE"
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    es_correcta: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    metadata: {
        type: DataTypes.JSONB,
        allowNull: true
    }
});

export default OpcionPregunta;