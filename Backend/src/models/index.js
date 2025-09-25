import User from "./User.js";
import Course from "./Curso.js";

//Acá se indica que un profesor puede tener muchos cursos
User.hasMany(Course, { foreignKey: "profesorId" });
Course.belongsTo(User, { as: "profesor", foreignKey: "profesorId" });

export { User, Course };