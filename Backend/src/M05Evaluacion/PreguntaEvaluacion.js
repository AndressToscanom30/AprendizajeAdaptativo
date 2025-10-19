import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PreguntaEvaluacion = sequelize.define("PreguntaEvaluacion", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    evaluacionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Evaluaciones",
            key: "id"
        },
        onDelete: "CASCADE"
    },
    preguntaId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Preguntas",
            key: "id"
        },
        onDelete: "CASCADE"
    },
    puntos: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    orden: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

export default PreguntaEvaluacion;