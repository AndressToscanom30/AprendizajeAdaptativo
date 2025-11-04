import sequelize from '../src/config/db.js';

async function runAllMigrations() {
    console.log('🚀 Iniciando migración completa de la base de datos...\n');
    
    try {
        // 1. Agregar tipo "codigo" al enum
        console.log('📝 Paso 1: Agregando tipo "codigo" al enum enum_Pregunta_tipo...');
        await sequelize.query(`
            ALTER TYPE "enum_Pregunta_tipo" ADD VALUE IF NOT EXISTS 'codigo';
        `);
        console.log('✅ Tipo "codigo" agregado al enum\n');

        // 2. Permitir NULL en columna texto de OpcionPregunta
        console.log('📝 Paso 2: Actualizando columna "texto" de OpcionPregunta...');
        await sequelize.query(`
            ALTER TABLE "OpcionPregunta" 
            ALTER COLUMN "texto" DROP NOT NULL;
        `);
        console.log('✅ Columna "texto" ahora permite NULL\n');

        console.log('🎉 ¡Migración completada exitosamente!\n');
        console.log('📋 Resumen de cambios:');
        console.log('   ✓ Enum "enum_Pregunta_tipo" incluye: opcion_multiple, seleccion_multiple,');
        console.log('     verdadero_falso, respuesta_corta, respuesta_larga, completar_blanco,');
        console.log('     relacion_par, codigo');
        console.log('   ✓ Tabla "OpcionPregunta" - columna "texto" permite NULL');
        console.log('   ✓ Preguntas de código usan campo "metadata" (JSONB) para almacenar:');
        console.log('     - codigo_inicial');
        console.log('     - solucion');
        console.log('     - salida_esperada');
        console.log('     - pistas (array)');
        console.log('     - lenguaje\n');
        console.log('💡 Ahora puedes reiniciar el servidor backend y crear preguntas de código!');
        
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error durante la migración:', error.message);
        console.error('\n💡 Posibles causas:');
        console.log('   - El valor "codigo" ya existe en el enum (esto es normal, ignóralo)');
        console.log('   - La columna "texto" ya permite NULL (esto es normal, ignóralo)');
        console.log('   - Problemas de conexión con la base de datos');
        console.log('\n🔍 Si el error menciona que el valor ya existe, la migración ya se aplicó correctamente.');
        process.exit(1);
    }
}

runAllMigrations();
