import dotenv from 'dotenv';
dotenv.config();

import sequelize from './src/config/db.js';
import './src/config/relaciones.js';
import TestAdaptativo from './src/M06IA/models/TestAdaptativo.js';
import AnalisisIA from './src/M06IA/models/AnalisisIA.js';
import Intento from './src/M05Evaluacion/Intento.js';
import Evaluacion from './src/M05Evaluacion/Evaluacion.js';

async function verDetalle() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la BD\n');

    // Buscar el test pendiente
    const test = await TestAdaptativo.findOne({
      where: { estado: 'generado' },
      include: [
        {
          model: AnalisisIA,
          as: 'analisis',
          include: [
            {
              model: Intento,
              as: 'intento',
              include: [
                {
                  model: Evaluacion,
                  as: 'evaluacion',
                  attributes: ['id', 'titulo', 'curso_id']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!test) {
      console.log('❌ No se encontró ningún test en estado "generado"');
      process.exit(0);
    }

    console.log('📋 DETALLES DEL TEST PENDIENTE:');
    console.log(JSON.stringify({
      testId: test.id,
      usuarioId: test.usuarioId,
      analisisId: test.analisisId,
      estado: test.estado,
      evaluacionId: test.evaluacionId,
      analisis: {
        id: test.analisis?.id,
        usuarioId: test.analisis?.usuarioId,
        intentoId: test.analisis?.intentoId,
        estado: test.analisis?.estado
      },
      intento: {
        id: test.analisis?.intento?.id,
        userId: test.analisis?.intento?.userId,
        evaluacionId: test.analisis?.intento?.evaluacionId
      },
      evaluacionOriginal: {
        id: test.analisis?.intento?.evaluacion?.id,
        titulo: test.analisis?.intento?.evaluacion?.titulo,
        curso_id: test.analisis?.intento?.evaluacion?.curso_id
      },
      preguntas: test.preguntas?.length || 0,
      enfoque: test.enfoque
    }, null, 2));

    // Verificar si tiene curso_id
    const cursoId = test.analisis?.intento?.evaluacion?.curso_id;
    console.log('\n🔍 VALIDACIÓN:');
    console.log(`   - ¿Tiene curso_id? ${cursoId ? '✅ Sí (' + cursoId + ')' : '❌ NO'}`);
    console.log(`   - ¿Tiene preguntas? ${test.preguntas ? '✅ Sí (' + test.preguntas.length + ')' : '❌ NO'}`);
    console.log(`   - ¿Tiene usuarioId? ${test.usuarioId ? '✅ Sí (' + test.usuarioId + ')' : '❌ NO'}`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

verDetalle();
