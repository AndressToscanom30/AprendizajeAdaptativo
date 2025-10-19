import User from "../M02Usuarios/User.js";
import Course from "../M04Curso/Curso.js";
import Etiqueta from "../M05Evaluacion/Etiqueta.js";
import Evaluacion from "../M05Evaluacion/Evaluacion.js";
import Intento from "../M05Evaluacion/Intento.js";
import IntentoRespuesta from "../M05Evaluacion/IntentoRespuesta.js";
import OpcionPregunta from "../M05Evaluacion/OpcionPregunta.js";
import Pregunta from "../M05Evaluacion/Pregunta.js";
import PreguntaEvaluacion from "../M05Evaluacion/PreguntaEvaluacion.js";
import PreguntaEtiqueta from "../M05Evaluacion/PreguntaEtiqueta.js";


//Acá se indica que un profesor puede tener muchos cursos
User.hasMany(Course, { foreignKey: "profesorId" });
Course.belongsTo(User, { as: "profesor", foreignKey: "profesorId" });

//EValuacion <--> pregunta
Evaluacion.belongsToMany(Pregunta, {
    through: PreguntaEvaluacion,
    foreignKey: "evaluacionId",
    as: "Preguntas"
});
Pregunta.belongsToMany(Evaluacion, {
    through: PreguntaEvaluacion,
    foreignKey: "preguntaId",
    otherKey: "evaluacionId",
    as: "Evaluaciones"
});

//Pregunta <--> Opciones
Pregunta.hasMany(OpcionPregunta, { foreignKey: "preguntaId", as: "opciones" });
OpcionPregunta.belongsTo(Pregunta, { foreignKey: "preguntaId", as: "pregunta"});

//Evaluación <--> Intentos
Evaluacion.hasMany(Intento, { foreignKey: "evaluacionId", as: "intentos" });
Intento.belongsTo(Evaluacion, { foreignKey: "evaluacionId", as: "evaluacion" });

//Intento <--> Respuestas
Intento.hasMany(IntentoRespuesta, { foreignKey: "intentoId", as: "respuestas" });
IntentoRespuesta.belongsTo(Intento, { foreignKey: "intentoId", as: "intento" });

//Pregunta <--> Respuesta
Pregunta.hasMany(IntentoRespuesta, { foreignKey: "preguntaId", as: "respuestas" });
IntentoRespuesta.belongsTo(Pregunta, { foreignKey: "preguntaId", as: "pregunta" });

//Etiquetas <--> Preguntas
Pregunta.belongsToMany(PreguntaEtiqueta, {
  through: PreguntaEtiqueta,
  foreignKey: "preguntaId",
  otherKey: "etiquetaId",
  as: "etiquetas"
});
Etiqueta.belongsToMany(Pregunta, {
  through: PreguntaEtiqueta,
  foreignKey: "etiquetaId",
  otherKey: "preguntaId",
  as: "preguntas"
});

// Exportar modelos para usarlos en el resto de la aplicación
export { User, Course, Etiqueta, Evaluacion, Intento, IntentoRespuesta, OpcionPregunta, Pregunta, PreguntaEvaluacion };