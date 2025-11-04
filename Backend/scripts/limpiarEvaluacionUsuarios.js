import sequelize from '../src/config/db.js';

async function limpiarRegistrosNulos() {
    try {
        console.log('🔄 Conectando a la base de datos...');
        await sequelize.authenticate();
        console.log('✅ Conexión exitosa');

        console.log('🧹 Eliminando registros con usuarioId o evaluacionId NULL...');
        
        const [results] = await sequelize.query(`
            DELETE FROM "EvaluacionUsuarios" 
            WHERE "usuarioId" IS NULL OR "evaluacionId" IS NULL
        `);

        console.log(`✅ Eliminados ${results.rowCount || 0} registros con valores NULL`);
        
        console.log('✅ Limpieza completada');
        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error durante la limpieza:', error);
        process.exit(1);
    }
}

limpiarRegistrosNulos();
