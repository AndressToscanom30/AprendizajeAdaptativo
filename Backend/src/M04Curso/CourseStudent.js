import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CourseStudent = sequelize.define("CourseStudent", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Courses",
      key: "id"
    }
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Users",
      key: "id"
    }
  },
  inscrito_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  estado: {
    type: DataTypes.ENUM("activo", "inactivo", "completado"),
    defaultValue: "activo"
  }
}, {
  timestamps: true,
});

export default CourseStudent;
