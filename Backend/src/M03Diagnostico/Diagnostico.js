import { DataTypes } from "sequelize";
import sequelize from '../config/db.js';
import User from '../M02Usuarios/User.js';

const Diagnostico = sequelize.define("Diagnostico", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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
    respuestas: {
        type: DataTypes.JSON, 
        allowNull: false
    },
    puntaje: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nivel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

Diagnostico.belongsTo(User, { foreignKey: "userId" });

export default Diagnostico;