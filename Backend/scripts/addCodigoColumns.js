import sequelize from '../src/config/db.js';

const addCodigoColumns = async () => {
    try {
        console.log('🔧 Agregando columnas codigo y salida_codigo a IntentoRespuesta...');

        // Agregar columna codigo
        await sequelize.query(`
            ALTER TABLE "IntentoRespuesta" 
            ADD COLUMN IF NOT EXISTS "codigo" TEXT;
        `);
        console.log('✅ Columna codigo agregada');

        // Agregar columna salida_codigo
        await sequelize.query(`
            ALTER TABLE "IntentoRespuesta" 
            ADD COLUMN IF NOT EXISTS "salida_codigo" TEXT;
        `);
        console.log('✅ Columna salida_codigo agregada');

        console.log('🎉 Migración completada exitosamente!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en la migración:', error);
        process.exit(1);
    }
};

addCodigoColumns();
