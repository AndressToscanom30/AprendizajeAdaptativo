// Script para crear una evaluación de prueba
// Uso: node scripts/crearEvaluacionPrueba.js

import { Sequelize, Op } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  String(process.env.DB_PASSWORD),
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);

async function crearEvaluacionPrueba() {
  try {
    console.log('🔍 Buscando datos necesarios...\n');

    // 1. Buscar profesor
    const [profesor] = await sequelize.query(
      `SELECT id, nombre, email FROM "Users" WHERE email = 'aa@gmail.com' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!profesor) {
      console.error('❌ No se encontró el profesor con email aa@gmail.com');
      process.exit(1);
    }
    console.log(`✅ Profesor encontrado: ${profesor.nombre} (ID: ${profesor.id})`);

    // 2. Buscar curso "Estructura de Datos"
    const [curso] = await sequelize.query(
      `SELECT id, titulo FROM "Courses" WHERE LOWER(titulo) LIKE '%estructura%datos%' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!curso) {
      console.error('❌ No se encontró el curso "Estructura de Datos"');
      console.log('\nCursos disponibles:');
      const cursos = await sequelize.query(
        `SELECT id, titulo FROM "Courses" ORDER BY titulo`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      cursos.forEach(c => console.log(`  - ${c.titulo} (ID: ${c.id})`));
      process.exit(1);
    }
    console.log(`✅ Curso encontrado: ${curso.titulo} (ID: ${curso.id})\n`);

    // 3. Crear la evaluación
    console.log('📝 Creando evaluación de prueba...');
    const [evaluacion] = await sequelize.query(
      `INSERT INTO "Evaluacion" 
        (id, titulo, descripcion, duracion_minutos, comienza_en, termina_en, max_intentos, curso_id, creado_por)
       VALUES 
        (gen_random_uuid(),
         'Evaluación de Prueba - IA', 
         'Evaluación creada automáticamente para probar el sistema de análisis con IA. Incluye preguntas variadas de programación.', 
         30, 
         NOW(), 
         NOW() + INTERVAL '30 days', 
         3,
         $1,
         $2)
       RETURNING id, titulo`,
      { bind: [curso.id, profesor.id], type: Sequelize.QueryTypes.INSERT }
    );

    console.log(`✅ Evaluación creada: "${evaluacion.titulo}" (ID: ${evaluacion.id})\n`);

    // 4. Crear preguntas variadas
    console.log('❓ Creando preguntas...');
    
    const preguntas = [
      {
        texto: '¿Qué imprime el siguiente código?',
        tipo: 'codigo',
        codigo: `let x = 5;
let y = x++;
console.log(x + y);`,
        puntos: 10,
        etiqueta: 'Operadores, Incremento'
      },
      {
        texto: '¿Cuál es la salida de este código?',
        tipo: 'codigo',
        codigo: `const arr = [1, 2, 3];
arr.push(4);
console.log(arr.length);`,
        puntos: 10,
        etiqueta: 'Arrays, Métodos'
      },
      {
        texto: 'El operador === compara valor y tipo de dato',
        tipo: 'verdadero_falso',
        codigo: null,
        puntos: 5,
        etiqueta: 'Operadores, Comparación'
      },
      {
        texto: 'Las variables declaradas con let tienen alcance de bloque',
        tipo: 'verdadero_falso',
        codigo: null,
        puntos: 5,
        etiqueta: 'Variables, Scope'
      },
      {
        texto: '¿Qué método de array devuelve un nuevo array con los elementos que cumplan una condición?',
        tipo: 'opcion_multiple',
        codigo: null,
        puntos: 8,
        etiqueta: 'Arrays, Métodos'
      },
      {
        texto: 'Completa el código para declarar una función arrow que sume dos números',
        tipo: 'completar_blanco',
        codigo: 'const suma = (a, b) ___ a + b;',
        puntos: 7,
        etiqueta: 'Funciones, Arrow Functions'
      }
    ];

    for (let i = 0; i < preguntas.length; i++) {
      const p = preguntas[i];
      
      // Insertar pregunta
      const [pregunta] = await sequelize.query(
        `INSERT INTO "Pregunta" 
          (id, texto, tipo, codigo, dificultad)
         VALUES (gen_random_uuid(), $1, $2, $3, 'media')
         RETURNING id`,
        { bind: [p.texto, p.tipo, p.codigo], type: Sequelize.QueryTypes.INSERT }
      );

      console.log(`  ✓ Pregunta ${i + 1}: ${p.tipo}`);

      // Asociar pregunta con evaluación
      await sequelize.query(
        `INSERT INTO "PreguntaEvaluacions" 
          ("preguntaId", "evaluacionId", puntos)
         VALUES ($1, $2, $3)`,
        { bind: [pregunta.id, evaluacion.id, p.puntos] }
      );

      // Buscar o crear etiqueta
      const [etiqueta] = await sequelize.query(
        `INSERT INTO "Etiqueta" (id, nombre)
         VALUES (gen_random_uuid(), $1)
         ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre
         RETURNING id`,
        { bind: [p.etiqueta], type: Sequelize.QueryTypes.INSERT }
      );

      // Asociar etiqueta con pregunta
      await sequelize.query(
        `INSERT INTO "QuestionTags" 
          ("preguntaId", "etiquetaId")
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        { bind: [pregunta.id, etiqueta.id] }
      );

      // Crear opciones según tipo
      if (p.tipo === 'opcion_multiple') {
        const opciones = [
          { texto: 'map()', es_correcta: false },
          { texto: 'filter()', es_correcta: true },
          { texto: 'reduce()', es_correcta: false },
          { texto: 'forEach()', es_correcta: false }
        ];
        
        for (const opcion of opciones) {
          await sequelize.query(
            `INSERT INTO "OpcionPregunta" 
              (id, texto, es_correcta, "preguntaId")
             VALUES (gen_random_uuid(), $1, $2, $3)`,
            { bind: [opcion.texto, opcion.es_correcta, pregunta.id] }
          );
        }
      } else if (p.tipo === 'verdadero_falso') {
        const esVerdadero = i === 2 || i === 3; // Primera y segunda pregunta V/F son verdaderas
        await sequelize.query(
          `INSERT INTO "OpcionPregunta" 
            (id, texto, es_correcta, "preguntaId")
           VALUES 
            (gen_random_uuid(), 'Verdadero', $1, $2),
            (gen_random_uuid(), 'Falso', $3, $2)`,
          { bind: [esVerdadero, pregunta.id, !esVerdadero] }
        );
      } else if (p.tipo === 'codigo') {
        const respuestas = i === 0 ? '11' : '4';
        await sequelize.query(
          `INSERT INTO "OpcionPregunta" 
            (id, texto, es_correcta, "preguntaId")
           VALUES (gen_random_uuid(), $1, true, $2)`,
          { bind: [respuestas, pregunta.id] }
        );
      } else if (p.tipo === 'completar_blanco') {
        await sequelize.query(
          `INSERT INTO "OpcionPregunta" 
            (id, texto, es_correcta, "preguntaId")
           VALUES (gen_random_uuid(), '=>', true, $1)`,
          { bind: [pregunta.id] }
        );
      }
    }

    console.log(`\n✅ Se crearon ${preguntas.length} preguntas con sus opciones y etiquetas\n`);

    // 5. Buscar estudiantes del curso
    const estudiantes = await sequelize.query(
      `SELECT u.id, u.nombre, u.email 
       FROM "Users" u
       INNER JOIN "CourseStudents" cs ON cs."userId" = u.id
       WHERE cs."courseId" = $1
       LIMIT 5`,
      { bind: [curso.id], type: Sequelize.QueryTypes.SELECT }
    );

    if (estudiantes.length > 0) {
      console.log('👥 Asignando evaluación a estudiantes del curso...');
      
      for (const est of estudiantes) {
        await sequelize.query(
          `INSERT INTO "EvaluacionUsuarios" 
            ("evaluacionId", "userId", fecha_asignacion)
           VALUES ($1, $2, NOW())
           ON CONFLICT DO NOTHING`,
          { bind: [evaluacion.id, est.id] }
        );
        console.log(`  ✓ ${est.nombre} (${est.email})`);
      }
      console.log(`\n✅ Evaluación asignada a ${estudiantes.length} estudiante(s)\n`);
    }

    // Resumen
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 ¡EVALUACIÓN DE PRUEBA CREADA CON ÉXITO!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📚 Curso: ${curso.titulo}`);
    console.log(`📝 Evaluación: "${evaluacion.titulo}" (ID: ${evaluacion.id})`);
    console.log(`❓ Preguntas: ${preguntas.length} (variadas con etiquetas)`);
    console.log(`⏱️  Duración: 30 minutos`);
    console.log(`🔄 Intentos máximos: 3`);
    console.log(`📅 Válida hasta: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
    if (estudiantes.length > 0) {
      console.log(`👥 Asignada a: ${estudiantes.length} estudiante(s)`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('💡 Ahora puedes:');
    console.log('   1. Tomar la evaluación como estudiante');
    console.log('   2. Ver el análisis con IA (debilidades/fortalezas específicas)');
    console.log('   3. Generar test adaptativo basado en el rendimiento\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar
crearEvaluacionPrueba();
