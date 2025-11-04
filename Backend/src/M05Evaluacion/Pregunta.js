import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "../M02Usuarios/User.js";

const Pregunta = sequelize.define("Pregunta", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM(
            "opcion_multiple",
            "seleccion_multiple",
            "verdadero_falso",
            "respuesta_corta",
            "respuesta_larga",
            "completar_blanco",
            "relacion_par",
            "codigo"
        ),
        allowNull: false
    },
    dificultad: {
        type: DataTypes.ENUM("facil", "media", "dificil"),
        allowNull: true
    },
    explicacion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    creado_por: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Users",
            key: "id"
        },
        onDelete: "CASCADE"
    }
});

Pregunta.belongsTo(User, { 
    as: "creator",
    foreignKey: "creado_por"
});

export default Pregunta;