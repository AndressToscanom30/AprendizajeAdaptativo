import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Etiqueta = sequelize.define("Etiqueta", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

export default Etiqueta;