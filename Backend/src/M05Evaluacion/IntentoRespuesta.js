import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const IntentoRespuesta = sequelize.define("IntentoRespuesta", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    intentoId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Intento",
            key: "id"
        },
        onDelete: "CASCADE"
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
    opcionSeleccionadaId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    opcion_seleccionadaIds: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    texto_respuesta: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    relacion_par: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    codigo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    salida_codigo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    es_correcta: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    puntos_obtenidos: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    feedback: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

export default IntentoRespuesta;