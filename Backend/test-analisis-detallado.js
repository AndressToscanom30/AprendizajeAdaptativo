import dotenv from 'dotenv';
dotenv.config();

import sequelize from './src/config/db.js';
import './src/config/relaciones.js';
import AnalisisIA from './src/M06IA/models/AnalisisIA.js';
import TestAdaptativo from './src/M06IA/models/TestAdaptativo.js';
import Intento from './src/M05Evaluacion/Intento.js';
import Evaluacion from './src/M05Evaluacion/Evaluacion.js';

async function verDetalleCompleto() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la BD\n');

    // Buscar todos los análisis
    const analisis = await AnalisisIA.findAll({
      include: [
        {
          model: Intento,
          as: 'intento',
          include: [{
            model: Evaluacion,
            as: 'evaluacion',
            attributes: ['id', 'titulo', 'curso_id']
          }]
        },
        {
          model: TestAdaptativo,
          as: 'tests',
          required: false
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    console.log(`📊 ENCONTRADOS ${analisis.length} ANÁLISIS:\n`);

    analisis.forEach((a, index) => {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`📋 ANÁLISIS #${index + 1}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`ID: ${a.id}`);
      console.log(`Usuario ID: ${a.usuarioId}`);
      console.log(`Intento ID: ${a.intentoId}`);
      console.log(`Estado: ${a.estado} ${a.estado === 'completado' ? '✅' : a.estado === 'error' ? '❌' : '⏳'}`);
      console.log(`Puntuación Global: ${a.puntuacionGlobal}`);
      console.log(`Porcentaje Total: ${a.porcentajeTotal}%`);
      console.log(`\nEvaluación Original:`);
      console.log(`  - Título: ${a.intento?.evaluacion?.titulo || 'N/A'}`);
      console.log(`  - Curso ID: ${a.intento?.evaluacion?.curso_id || 'null'}`);
      
      console.log(`\n📊 DATOS GENERADOS POR IA:`);
      console.log(`  - Fortalezas: ${a.fortalezas ? `${a.fortalezas.length} items` : '❌ VACÍO'}`);
      if (a.fortalezas && a.fortalezas.length > 0) {
        a.fortalezas.forEach(f => console.log(`    ✓ ${f}`));
      }
      
      console.log(`  - Debilidades: ${a.debilidades ? `${a.debilidades.length} items` : '❌ VACÍO'}`);
      if (a.debilidades && a.debilidades.length > 0) {
        a.debilidades.forEach(d => console.log(`    ✗ ${d}`));
      }
      
      console.log(`  - Recomendaciones: ${a.recomendaciones ? `${a.recomendaciones.length} items` : '❌ VACÍO'}`);
      if (a.recomendaciones && a.recomendaciones.length > 0) {
        a.recomendaciones.forEach((r, i) => console.log(`    ${i+1}. ${r}`));
      }
      
      console.log(`  - Tiempo Estudio: ${a.tiempoEstudioSugerido || '❌ VACÍO'}`);
      
      console.log(`\n🎯 TEST ADAPTATIVO:`);
      if (a.tests && a.tests.length > 0) {
        const test = a.tests[0];
        console.log(`  ✅ Test ID: ${test.id}`);
        console.log(`  - Estado: ${test.estado}`);
        console.log(`  - Evaluación ID: ${test.evaluacionId || 'No convertido'}`);
        console.log(`  - Preguntas: ${test.preguntas?.length || 0}`);
      } else {
        console.log(`  ❌ NO HAY TEST GENERADO`);
      }
      
      console.log(`\nCreado: ${a.createdAt}`);
      console.log(`Actualizado: ${a.updatedAt}`);
    });

    console.log(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`🔍 RESUMEN DE PROBLEMAS:`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    const enError = analisis.filter(a => a.estado === 'error');
    const enProcesando = analisis.filter(a => a.estado === 'procesando');
    const vacios = analisis.filter(a => a.porcentajeTotal === 0 && a.puntuacionGlobal === 0);
    const sinFortalezas = analisis.filter(a => !a.fortalezas || a.fortalezas.length === 0);
    const sinTest = analisis.filter(a => !a.tests || a.tests.length === 0);
    
    console.log(`❌ En estado ERROR: ${enError.length}`);
    console.log(`⏳ En estado PROCESANDO: ${enProcesando.length}`);
    console.log(`📊 Con datos vacíos (0%): ${vacios.length}`);
    console.log(`💭 Sin fortalezas/debilidades: ${sinFortalezas.length}`);
    console.log(`🎯 Sin test adaptativo: ${sinTest.length}`);

    if (vacios.length > 0) {
      console.log(`\n⚠️  HAY ${vacios.length} ANÁLISIS VACÍOS - La IA no generó datos`);
      console.log(`   Solución: Reintentar el análisis con /api/ia/reintentar-analisis`);
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

verDetalleCompleto();
