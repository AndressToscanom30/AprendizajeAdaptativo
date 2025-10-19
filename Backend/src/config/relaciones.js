import User from "../M02Usuarios/User.js";
import Course from "../M04Curso/Curso.js";
import Etiqueta from "../M05Evaluacion/Etiqueta.js";
import Evaluacion from "../M05Evaluacion/Evaluacion.js";
import Intento from "../M05Evaluacion/intento.js";
import IntentoRespuesta from "../M05Evaluacion/IntentoRespuesta.js";
import OpcionPregunta from "../M05Evaluacion/OpcionPregunta.js";
import Pregunta from "../M05Evaluacion/Pregunta.js";
import PreguntaEvaluacion from "../M05Evaluacion/PreguntaEvaluacion.js";
import PreguntaEtiqueta from "../M05Evaluacion/PreguntaEtiqueta.js";

// ✅ Importar modelos de IA
import AnalisisIA from "../M06IA/models/AnalisisIA.js";
import TestAdaptativo from "../M06IA/models/TestAdaptativo.js";

// ===== RELACIONES EXISTENTES =====

User.hasMany(Course, { foreignKey: "profesorId" });
Course.belongsTo(User, { as: "profesor", foreignKey: "profesorId" });

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

Pregunta.hasMany(OpcionPregunta, { foreignKey: "preguntaId", as: "opciones" });
OpcionPregunta.belongsTo(Pregunta, { foreignKey: "preguntaId", as: "pregunta"});

Evaluacion.hasMany(Intento, { foreignKey: "evaluacionId", as: "intentos" });
Intento.belongsTo(Evaluacion, { foreignKey: "evaluacionId", as: "evaluacion" });

Intento.hasMany(IntentoRespuesta, { foreignKey: "intentoId", as: "respuestas" });
IntentoRespuesta.belongsTo(Intento, { foreignKey: "intentoId", as: "intento" });

Pregunta.hasMany(IntentoRespuesta, { foreignKey: "preguntaId", as: "respuestas" });
IntentoRespuesta.belongsTo(Pregunta, { foreignKey: "preguntaId", as: "pregunta" });

Pregunta.belongsToMany(Etiqueta, {
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

// ===== NUEVAS RELACIONES DE IA =====

// Usuario <--> AnalisisIA
User.hasMany(AnalisisIA, { 
  foreignKey: "usuarioId",  // ✅ camelCase en el modelo
  as: "analisis" 
});
AnalisisIA.belongsTo(User, { 
  foreignKey: "usuarioId", 
  as: "usuario" 
});

// Intento <--> AnalisisIA (uno a uno)
Intento.hasOne(AnalisisIA, { 
  foreignKey: "intentoId", 
  as: "analisis" 
});
AnalisisIA.belongsTo(Intento, { 
  foreignKey: "intentoId", 
  as: "intento" 
});

// Usuario <--> TestAdaptativo
User.hasMany(TestAdaptativo, { 
  foreignKey: "usuarioId", 
  as: "testsAdaptativos" 
});
TestAdaptativo.belongsTo(User, { 
  foreignKey: "usuarioId", 
  as: "usuario" 
});

// AnalisisIA <--> TestAdaptativo (uno a uno)
AnalisisIA.hasOne(TestAdaptativo, { 
  foreignKey: "analisisId", 
  as: "testAdaptativo" 
});
TestAdaptativo.belongsTo(AnalisisIA, { 
  foreignKey: "analisisId", 
  as: "analisis" 
});

// TestAdaptativo <--> Evaluacion (opcional)
TestAdaptativo.belongsTo(Evaluacion, { 
  foreignKey: "evaluacionId", 
  as: "evaluacion" 
});
Evaluacion.hasMany(TestAdaptativo, { 
  foreignKey: "evaluacionId", 
  as: "testsAdaptativos" 
});

// Exportar todos los modelos
export { 
  User, 
  Course, 
  Etiqueta, 
  Evaluacion, 
  Intento, 
  IntentoRespuesta, 
  OpcionPregunta, 
  Pregunta, 
  PreguntaEvaluacion,
  PreguntaEtiqueta,
  AnalisisIA,
  TestAdaptativo
};