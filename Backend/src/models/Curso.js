import { DataTypes } from "sequelize";
import sequelize from "../db/config/config.js";

const Course = sequelize.define("Course", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
  }
}, {
  timestamps: true,
});

export default Course;
