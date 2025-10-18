import User from "../M02Usuarios/User.js";
import Course from "../M04Curso/Curso.js";

//Acá se indica que un profesor puede tener muchos cursos
User.hasMany(Course, { foreignKey: "profesorId" });
Course.belongsTo(User, { as: "profesor", foreignKey: "profesorId" });

export { User, Course };