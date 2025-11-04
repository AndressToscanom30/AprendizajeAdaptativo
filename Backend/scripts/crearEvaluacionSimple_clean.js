/**
 * Script para crear evaluación de prueba con datos de ejemplo
 * Útil para desarrollo y testing del sistema de análisis con IA
 * 
 * @usage node scripts/crearEvaluacionSimple_clean.js
 */
import dotenv from 'dotenv';
dotenv.config();

import Evaluacion from '../src/M05Evaluacion/Evaluacion.js';
import Pregunta from '../src/M05Evaluacion/Pregunta.js';
import OpcionPregunta from '../src/M05Evaluacion/OpcionPregunta.js';
import Etiqueta from '../src/M05Evaluacion/Etiqueta.js';
import PreguntaEvaluacion from '../src/M05Evaluacion/PreguntaEvaluacion.js';
import EvaluacionUsuario from '../src/M05Evaluacion/EvaluacionUsuario.js';
import User from '../src/M02Usuarios/User.js';
import Course from '../src/M04Curso/Curso.js';
import sequelize from '../src/config/db.js';
import '../src/config/relaciones.js';

// ========================
// CONSTANTES DE CONFIGURACIÓN
// ========================

const PROFESOR_EMAIL = 'aa@gmail.com';
const CURSO_TITULO = 'Estructura de Datos';

const EVALUACION_CONFIG = {
  titulo: 'Evaluación de Prueba - IA',
  descripcion: 'Evaluación creada automáticamente para probar el sistema de análisis con IA. Incluye preguntas variadas de programación.',
  duracion_minutos: 30,
  dias_disponible: 30,
  max_intentos: 3,
  tipo: 'normal'
};

const PREGUNTAS_DATA = [
  {
    texto: '¿Qué imprime el siguiente código?',
    tipo: 'codigo',
    codigo: `let x = 5;\nlet y = x++;\nconsole.log(x + y);`,
    puntos: 10,
    etiquetas: ['Operadores', 'Incremento'],
    respuesta: '11'
  },
  {
    texto: '¿Cuál es la salida de este código?',
    tipo: 'codigo',
    codigo: `const arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr.length);`,
    puntos: 10,
    etiquetas: ['Arrays', 'Métodos'],
    respuesta: '4'
  },
  {
    texto: 'El operador === compara valor y tipo de dato',
    tipo: 'verdadero_falso',
    codigo: null,
    puntos: 5,
    etiquetas: ['Operadores', 'Comparación'],
    respuestaVF: true
  },
  {
    texto: 'Las variables declaradas con let tienen alcance de bloque',
    tipo: 'verdadero_falso',
    codigo: null,
    puntos: 5,
    etiquetas: ['Variables', 'Scope'],
    respuestaVF: true
  },
  {
    texto: '¿Qué método de array devuelve un nuevo array con los elementos que cumplan una condición?',
    tipo: 'opcion_multiple',
    codigo: null,
    puntos: 8,
    etiquetas: ['Arrays', 'Métodos'],
    opciones: [
      { texto: 'map()', correcta: false },
      { texto: 'filter()', correcta: true },
      { texto: 'reduce()', correcta: false },
      { texto: 'forEach()', correcta: false }
    ]
  }
];

// ========================
// FUNCIONES AUXILIARES
// ========================

/**
 * Busca al profesor en la base de datos
 * @returns {Promise<Object>} El profesor encontrado
 * @throws {Error} Si el profesor no existe
 */
async function buscarProfesor() {
  const profesor = await User.findOne({
    where: { email: PROFESOR_EMAIL }
  });

  if (!profesor) {
    throw new Error(`No se encontró el profesor con email ${PROFESOR_EMAIL}`);
  }

  console.log(`✅ Profesor encontrado: ${profesor.nombre} (${profesor.email})`);
  return profesor;
}

/**
 * Busca el curso en la base de datos
 * @returns {Promise<Object>} El curso encontrado
 * @throws {Error} Si el curso no existe, mostrando cursos disponibles
 */
async function buscarCurso() {
  const curso = await Course.findOne({
    where: { titulo: CURSO_TITULO }
  });

  if (!curso) {
    const cursos = await Course.findAll();
    const listaCursos = cursos.map(c => `  - ${c.titulo}`).join('\n');
    throw new Error(`No se encontró el curso "${CURSO_TITULO}"\n\nCursos disponibles:\n${listaCursos}`);
  }

  console.log(`✅ Curso encontrado: ${curso.titulo}\n`);
  return curso;
}

/**
 * Crea la evaluación base
 * @param {Object} curso - El curso al que pertenece la evaluación
 * @param {Object} profesor - El profesor que crea la evaluación
 * @returns {Promise<Object>} La evaluación creada
 */
async function crearEvaluacion(curso, profesor) {
  const fechaInicio = new Date();
  const fechaFin = new Date(Date.now() + EVALUACION_CONFIG.dias_disponible * 24 * 60 * 60 * 1000);

  const evaluacion = await Evaluacion.create({
    titulo: EVALUACION_CONFIG.titulo,
    descripcion: EVALUACION_CONFIG.descripcion,
    duracion_minutos: EVALUACION_CONFIG.duracion_minutos,
    comienza_en: fechaInicio,
    termina_en: fechaFin,
    max_intentos: EVALUACION_CONFIG.max_intentos,
    curso_id: curso.id,
    creado_por: profesor.id,
    activa: true,
    tipo: EVALUACION_CONFIG.tipo
  });

  console.log(`✅ Evaluación creada: "${evaluacion.titulo}"\n`);
  return evaluacion;
}

/**
 * Crea las opciones para una pregunta de tipo código
 * @param {string} respuesta - La respuesta correcta
 * @param {number} preguntaId - ID de la pregunta
 */
async function crearOpcionesCodigo(respuesta, preguntaId) {
  await OpcionPregunta.create({
    texto: respuesta,
    es_correcta: true,
    preguntaId
  });
}

/**
 * Crea las opciones para una pregunta de verdadero/falso
 * @param {boolean} respuestaVF - La respuesta correcta
 * @param {number} preguntaId - ID de la pregunta
 */
async function crearOpcionesVerdaderoFalso(respuestaVF, preguntaId) {
  await OpcionPregunta.bulkCreate([
    { texto: 'Verdadero', es_correcta: respuestaVF, preguntaId },
    { texto: 'Falso', es_correcta: !respuestaVF, preguntaId }
  ]);
}

/**
 * Crea las opciones para una pregunta de opción múltiple
 * @param {Array} opciones - Array de opciones con texto y correcta
 * @param {number} preguntaId - ID de la pregunta
 */
async function crearOpcionesMultiples(opciones, preguntaId) {
  for (const opc of opciones) {
    await OpcionPregunta.create({
      texto: opc.texto,
      es_correcta: opc.correcta,
      preguntaId
    });
  }
}

/**
 * Crea una pregunta con sus opciones y etiquetas
 * @param {Object} pData - Datos de la pregunta
 * @param {Object} evaluacion - La evaluación a la que pertenece
 * @param {Object} profesor - El profesor que crea la pregunta
 * @param {number} idx - Índice de la pregunta
 */
async function crearPregunta(pData, evaluacion, profesor, idx) {
  const pregunta = await Pregunta.create({
    texto: pData.texto,
    tipo: pData.tipo,
    codigo: pData.codigo,
    dificultad: 'media',
    creado_por: profesor.id
  });

  console.log(`  ✓ Pregunta ${idx + 1}: ${pData.tipo}`);

  // Asociar con evaluación
  await PreguntaEvaluacion.create({
    preguntaId: pregunta.id,
    evaluacionId: evaluacion.id,
    puntos: pData.puntos
  });

  // Crear/asociar etiquetas
  for (const nombreEtiqueta of pData.etiquetas) {
    const [etiqueta] = await Etiqueta.findOrCreate({
      where: { nombre: nombreEtiqueta }
    });
    await pregunta.addEtiqueta(etiqueta);
  }

  // Crear opciones según el tipo de pregunta
  switch (pData.tipo) {
    case 'codigo':
      await crearOpcionesCodigo(pData.respuesta, pregunta.id);
      break;
    case 'verdadero_falso':
      await crearOpcionesVerdaderoFalso(pData.respuestaVF, pregunta.id);
      break;
    case 'opcion_multiple':
      await crearOpcionesMultiples(pData.opciones, pregunta.id);
      break;
  }
}

/**
 * Busca los estudiantes inscritos en el curso
 * @param {number} cursoId - ID del curso
 * @returns {Promise<Array>} Lista de estudiantes
 */
async function buscarEstudiantes(cursoId) {
  const [estudiantes] = await sequelize.query(
    `SELECT u.id, u.nombre, u.email 
     FROM "Users" u
     INNER JOIN "CourseStudents" cs ON cs."studentId" = u.id
     WHERE cs."courseId" = :cursoId`,
    {
      replacements: { cursoId },
      type: sequelize.QueryTypes.SELECT
    }
  );

  return estudiantes || [];
}

/**
 * Asigna la evaluación a los estudiantes del curso
 * @param {Object} evaluacion - La evaluación a asignar
 * @param {number} cursoId - ID del curso
 * @returns {Promise<number>} Número de estudiantes asignados
 */
async function asignarEvaluacionAEstudiantes(evaluacion, cursoId) {
  const estudiantes = await buscarEstudiantes(cursoId);

  if (estudiantes.length === 0) {
    console.log('⚠️  No se encontraron estudiantes en el curso "Estructura de Datos"\n');
    console.log('💡 Inscribe estudiantes al curso primero o asigna manualmente desde el panel de profesor\n');
    return 0;
  }

  console.log(`Encontrados ${estudiantes.length} estudiante(s). Asignando evaluación...\n`);
  
  for (const est of estudiantes) {
    await EvaluacionUsuario.create({
      evaluacionId: evaluacion.id,
      userId: est.id,
      fecha_asignacion: new Date()
    });
    console.log(`  ✓ ${est.nombre} (${est.email})`);
  }

  console.log(`\n✅ Evaluación asignada a ${estudiantes.length} estudiante(s)\n`);
  return estudiantes.length;
}

/**
 * Muestra un resumen de la evaluación creada
 * @param {Object} curso - El curso
 * @param {Object} evaluacion - La evaluación creada
 * @param {number} numEstudiantes - Número de estudiantes asignados
 */
function mostrarResumen(curso, evaluacion, numEstudiantes) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 EVALUACIÓN CREADA CON ÉXITO!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📚 Curso: ${curso.titulo}`);
  console.log(`📝 Evaluación: "${evaluacion.titulo}"`);
  console.log(`❓ Preguntas: ${PREGUNTAS_DATA.length}`);
  console.log(`⏱️  Duración: ${EVALUACION_CONFIG.duracion_minutos} minutos`);
  console.log(`🔄 Intentos: ${EVALUACION_CONFIG.max_intentos}`);
  if (numEstudiantes > 0) {
    console.log(`👥 Asignada a: ${numEstudiantes} estudiante(s)`);
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// ========================
// FUNCIÓN PRINCIPAL
// ========================

/**
 * Función principal que ejecuta todo el proceso de creación de evaluación
 */
async function crearEvaluacionPrueba() {
  try {
    console.log('🔍 Buscando datos necesarios...\n');

    const profesor = await buscarProfesor();
    const curso = await buscarCurso();

    console.log('📝 Creando evaluación...');
    const evaluacion = await crearEvaluacion(curso, profesor);

    console.log('❓ Creando preguntas...\n');
    for (const [idx, pData] of PREGUNTAS_DATA.entries()) {
      await crearPregunta(pData, evaluacion, profesor, idx);
    }
    console.log(`\n✅ Se crearon ${PREGUNTAS_DATA.length} preguntas\n`);

    console.log('👥 Buscando estudiantes del curso...\n');
    const numEstudiantes = await asignarEvaluacionAEstudiantes(evaluacion, curso.id);

    mostrarResumen(curso, evaluacion, numEstudiantes);

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
    process.exit(1);
  }
}

// Ejecutar el script
crearEvaluacionPrueba();
