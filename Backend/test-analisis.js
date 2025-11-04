import dotenv from 'dotenv';
dotenv.config();

import sequelize from './src/config/db.js';
import './src/config/relaciones.js';
import Intento from './src/M05Evaluacion/Intento.js';
import AnalisisIA from './src/M06IA/models/AnalisisIA.js';
import TestAdaptativo from './src/M06IA/models/TestAdaptativo.js';
import Evaluacion from './src/M05Evaluacion/Evaluacion.js';

async function diagnosticar() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la BD\n');

    // 1. Últimos intentos
    console.log('📋 Últimos 5 intentos enviados:');
    const intentos = await Intento.findAll({
      where: { status: 'enviado' },
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'userId', 'evaluacionId', 'total_puntaje', 'createdAt']
    });
    
    intentos.forEach(i => {
      console.log(`   - Intento ${i.id} | User: ${i.userId} | Puntaje: ${i.total_puntaje} | ${i.createdAt}`);
    });

    // 2. Análisis generados
    console.log('\n🧠 Análisis IA generados:');
    const analisis = await AnalisisIA.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'intentoId', 'usuarioId', 'estado', 'porcentajeTotal', 'createdAt']
    });
    
    if (analisis.length === 0) {
      console.log('   ⚠️  NO HAY ANÁLISIS GENERADOS');
    } else {
      analisis.forEach(a => {
        console.log(`   - Análisis ${a.id} | Intento: ${a.intentoId} | Estado: ${a.estado} | ${a.porcentajeTotal}%`);
      });
    }

    // 3. Tests adaptativos
    console.log('\n🎯 Tests adaptativos generados:');
    const tests = await TestAdaptativo.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'analisisId', 'estado', 'evaluacionId', 'createdAt']
    });
    
    if (tests.length === 0) {
      console.log('   ⚠️  NO HAY TESTS ADAPTATIVOS GENERADOS');
    } else {
      tests.forEach(t => {
        console.log(`   - Test ${t.id} | Análisis: ${t.analisisId} | Estado: ${t.estado} | EvalId: ${t.evaluacionId || 'N/A'}`);
      });
    }

    // 4. Evaluaciones adaptativas
    console.log('\n📝 Evaluaciones adaptativas (tipo="adaptativo"):');
    const evaluaciones = await Evaluacion.findAll({
      where: { tipo: 'adaptativo' },
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'titulo', 'creado_por', 'createdAt']
    });
    
    if (evaluaciones.length === 0) {
      console.log('   ⚠️  NO HAY EVALUACIONES ADAPTATIVAS');
    } else {
      evaluaciones.forEach(e => {
        console.log(`   - Eval ${e.id} | "${e.titulo}" | Creado por: ${e.creado_por}`);
      });
    }

    // 5. Diagnóstico
    console.log('\n🔍 DIAGNÓSTICO:');
    console.log(`   - Intentos enviados: ${intentos.length}`);
    console.log(`   - Análisis generados: ${analisis.length}`);
    console.log(`   - Tests adaptativos: ${tests.length}`);
    console.log(`   - Evaluaciones adaptativas: ${evaluaciones.length}`);
    
    if (intentos.length > 0 && analisis.length === 0) {
      console.log('\n❌ PROBLEMA: Hay intentos pero NO se generaron análisis');
      console.log('   Solución: El análisis automático no se está ejecutando');
    }
    
    if (analisis.length > 0 && tests.length === 0) {
      console.log('\n❌ PROBLEMA: Hay análisis pero NO se generaron tests adaptativos');
      console.log('   Solución: La generación de tests está fallando');
    }
    
    if (tests.length > 0 && evaluaciones.length === 0) {
      console.log('\n❌ PROBLEMA: Hay tests pero NO se convirtieron a evaluaciones');
      console.log('   Solución: La conversión a evaluación está fallando');
    }
    
    if (intentos.length > 0 && analisis.length > 0 && tests.length > 0 && evaluaciones.length > 0) {
      console.log('\n✅ TODO PARECE CORRECTO - El flujo está funcionando');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

diagnosticar();
