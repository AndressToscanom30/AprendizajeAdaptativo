// Script simplificado para crear evaluación de prueba usando modelos Sequelize
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

async function crearEvaluacionPrueba() {
  try {
    console.log('🔍 Buscando datos necesarios...\n');

    // 1. Buscar profesor
    const profesor = await User.findOne({
      where: { email: 'aa@gmail.com' }
    });

    if (!profesor) {
      console.error('❌ No se encontró el profesor con email aa@gmail.com');
      process.exit(1);
    }
    console.log(`✅ Profesor encontrado: ${profesor.nombre} (${profesor.email})`);

    // 2. Buscar curso
    const curso = await Course.findOne({
      where: { titulo: 'Estructura de Datos' }
    });

    if (!curso) {
      console.error('❌ No se encontró el curso "Estructura de Datos"');
      const cursos = await Course.findAll();
      console.log('\nCursos disponibles:');
      cursos.forEach(c => console.log(`  - ${c.titulo}`));
      process.exit(1);
    }
    console.log(`✅ Curso encontrado: ${curso.titulo}\n`);

    // 3. Crear evaluación
    console.log('📝 Creando evaluación...');
    const evaluacion = await Evaluacion.create({
      titulo: 'Evaluación de Prueba - IA',
      descripcion: 'Evaluación creada automáticamente para probar el sistema de análisis con IA. Incluye preguntas variadas de programación.',
      duracion_minutos: 30,
      comienza_en: new Date(),
      termina_en: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      max_intentos: 3,
      curso_id: curso.id,
      creado_por: profesor.id,
      activa: true,
      tipo: 'normal'
    });

    console.log(`✅ Evaluación creada: "${evaluacion.titulo}"\n`);

    // 4. Crear preguntas
    console.log('❓ Creando preguntas...\n');
    
    const preguntasData = [
      {
        texto: '¿Qué imprime el siguiente código?',
        tipo: 'codigo',
        codigo: `let x = 5;\nlet y = x++;\nconsole.log(x + y);`,
        puntos: 10,
        etiquetas: ['Operadores', 'Incremento']
      },
      {
        texto: '¿Cuál es la salida de este código?',
        tipo: 'codigo',
        codigo: `const arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr.length);`,
        puntos: 10,
        etiquetas: ['Arrays', 'Métodos']
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

    for (const [idx, pData] of preguntasData.entries()) {
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

      // Crear opciones
      if (pData.tipo === 'opcion_multiple' && pData.opciones) {
        for (const opc of pData.opciones) {
          await OpcionPregunta.create({
            texto: opc.texto,
            es_correcta: opc.correcta,
            preguntaId: pregunta.id
          });
        }
      } else if (pData.tipo === 'verdadero_falso') {
        await OpcionPregunta.bulkCreate([
          { texto: 'Verdadero', es_correcta: pData.respuestaVF, preguntaId: pregunta.id },
          { texto: 'Falso', es_correcta: !pData.respuestaVF, preguntaId: pregunta.id }
        ]);
      } else if (pData.tipo === 'codigo') {
        const respuesta = idx === 0 ? '11' : '4';
        await OpcionPregunta.create({
          texto: respuesta,
          es_correcta: true,
          preguntaId: pregunta.id
        });
      }
    }

    console.log(`\n✅ Se crearon ${preguntasData.length} preguntas\n`);

    // 5. Buscar estudiantes del curso y asignar evaluación
    console.log('👥 Buscando estudiantes del curso...\n');
    
    const [estudiantes] = await sequelize.query(
      `SELECT u.id, u.nombre, u.email 
       FROM "Users" u
       INNER JOIN "CourseStudents" cs ON cs."studentId" = u.id
       WHERE cs."courseId" = :cursoId`,
      {
        replacements: { cursoId: curso.id },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (estudiantes && estudiantes.length > 0) {
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
    } else {
      console.log('⚠️  No se encontraron estudiantes en el curso "Estructura de Datos"\n');
      console.log('💡 Inscribe estudiantes al curso primero o asigna manualmente desde el panel de profesor\n');
    }

    // Resumen
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 EVALUACIÓN CREADA CON ÉXITO!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📚 Curso: ${curso.titulo}`);
    console.log(`📝 Evaluación: "${evaluacion.titulo}"`);
    console.log(`❓ Preguntas: ${preguntasData.length}`);
    console.log(`⏱️  Duración: 30 minutos`);
    console.log(`🔄 Intentos: 3`);
    if (estudiantes && estudiantes.length > 0) {
      console.log(`� Asignada a: ${estudiantes.length} estudiante(s)`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

crearEvaluacionPrueba();
