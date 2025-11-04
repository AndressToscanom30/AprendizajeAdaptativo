import sequelize from '../src/config/db.js';

const runFullMigration = async () => {
    try {
        console.log('🚀 Iniciando migración completa...\n');

        // 1. Agregar tipo 'codigo' al enum
        console.log('📝 Paso 1: Agregando tipo "codigo" al enum...');
        await sequelize.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_enum 
                    WHERE enumlabel = 'codigo' 
                    AND enumtypid = (
                        SELECT oid FROM pg_type WHERE typname = 'enum_Pregunta_tipo'
                    )
                ) THEN
                    ALTER TYPE "enum_Pregunta_tipo" ADD VALUE 'codigo';
                END IF;
            END $$;
        `);
        console.log('✅ Tipo "codigo" agregado\n');

        // 2. Hacer OpcionPregunta.texto nullable
        console.log('📝 Paso 2: Haciendo OpcionPregunta.texto nullable...');
        await sequelize.query(`
            ALTER TABLE "OpcionPregunta" 
            ALTER COLUMN "texto" DROP NOT NULL;
        `);
        console.log('✅ OpcionPregunta.texto ahora es nullable\n');

        // 3. Agregar columnas codigo y salida_codigo a IntentoRespuesta
        console.log('📝 Paso 3: Agregando columnas codigo y salida_codigo...');
        await sequelize.query(`
            ALTER TABLE "IntentoRespuesta" 
            ADD COLUMN IF NOT EXISTS "codigo" TEXT;
        `);
        await sequelize.query(`
            ALTER TABLE "IntentoRespuesta" 
            ADD COLUMN IF NOT EXISTS "salida_codigo" TEXT;
        `);
        console.log('✅ Columnas codigo y salida_codigo agregadas\n');

        // 4. Actualizar campo tiempo_estudio_sugerido a TEXT
        console.log('📝 Paso 4: Actualizando campo tiempo_estudio_sugerido...');
        await sequelize.query(`
            ALTER TABLE "AnalisisIA" 
            ALTER COLUMN "tiempo_estudio_sugerido" TYPE TEXT;
        `);
        console.log('✅ Campo tiempo_estudio_sugerido actualizado a TEXT\n');

        // 5. Limpiar registros huérfanos
        console.log('📝 Paso 5: Limpiando registros huérfanos...');
        await sequelize.query(`
            DELETE FROM "EvaluacionUsuarios" 
            WHERE "evaluacionId" NOT IN (SELECT id FROM "Evaluacion")
            OR "evaluacionId" IS NULL;
        `);
        console.log('✅ Registros huérfanos eliminados\n');

        console.log('🎉 ¡Migración completada exitosamente!');
        console.log('\n📋 Resumen:');
        console.log('   ✓ Tipo "codigo" agregado a enum_Pregunta_tipo');
        console.log('   ✓ OpcionPregunta.texto es nullable');
        console.log('   ✓ IntentoRespuesta tiene columnas codigo y salida_codigo');
        console.log('   ✓ AnalisisIA.tiempo_estudio_sugerido es TEXT (sin límite)');
        console.log('   ✓ Registros huérfanos de EvaluacionUsuarios eliminados');
        console.log('\n💡 Ahora puedes reiniciar el servidor backend');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en la migración:', error);
        console.error('\n🔧 Detalles del error:', error.message);
        process.exit(1);
    }
};

runFullMigration();
