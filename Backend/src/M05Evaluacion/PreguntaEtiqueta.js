import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PreguntaEtiqueta = sequelize.define("QuestionTag", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    preguntaId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    etiquetaId: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

export default PreguntaEtiqueta;
