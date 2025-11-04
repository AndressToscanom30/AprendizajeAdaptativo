import sequelize from '../src/config/db.js';

const fixAnalisisIA = async () => {
    try {
        console.log('🔧 Actualizando campo tiempo_estudio_sugerido en AnalisisIA...');

        // Cambiar tipo de VARCHAR(100) a TEXT
        await sequelize.query(`
            ALTER TABLE "AnalisisIA" 
            ALTER COLUMN "tiempo_estudio_sugerido" TYPE TEXT;
        `);
        
        console.log('✅ Campo tiempo_estudio_sugerido actualizado a TEXT');

        console.log('\n🧹 Limpiando registros huérfanos de EvaluacionUsuarios...');
        
        // Eliminar registros de EvaluacionUsuarios que apuntan a evaluaciones inexistentes
        const [result] = await sequelize.query(`
            DELETE FROM "EvaluacionUsuarios" 
            WHERE "evaluacionId" NOT IN (SELECT id FROM "Evaluacion")
            OR "evaluacionId" IS NULL;
        `);
        
        console.log(`✅ Eliminados ${result.rowCount || 0} registros huérfanos de EvaluacionUsuarios`);

        console.log('\n🎉 Migración completada exitosamente!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en la migración:', error);
        process.exit(1);
    }
};

fixAnalisisIA();
