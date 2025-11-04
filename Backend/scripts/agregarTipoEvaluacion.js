import sequelize from '../src/config/db.js';

async function agregarColumnasTipo() {
    try {
        console.log('🔧 Conectando a la base de datos...');
        await sequelize.authenticate();
        console.log('✅ Conexión exitosa');

        // Agregar columna 'tipo' si no existe
        await sequelize.query(`
            DO $$ 
            BEGIN
                -- Agregar columna tipo si no existe
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'Evaluacion' AND column_name = 'tipo'
                ) THEN
                    -- Primero crear el tipo ENUM
                    CREATE TYPE "enum_Evaluacion_tipo" AS ENUM ('normal', 'adaptativo', 'diagnostico');
                    
                    -- Luego agregar la columna
                    ALTER TABLE "Evaluacion" 
                    ADD COLUMN "tipo" "enum_Evaluacion_tipo" NOT NULL DEFAULT 'normal';
                    
                    RAISE NOTICE 'Columna tipo agregada exitosamente';
                ELSE
                    RAISE NOTICE 'Columna tipo ya existe';
                END IF;
            END $$;
        `);

        console.log('✅ Migración completada');
        
        // Mostrar resumen
        const [result] = await sequelize.query(`
            SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'Evaluacion' AND column_name = 'tipo';
        `);
        
        console.log('📊 Estado de la columna tipo:', result);
        
    } catch (error) {
        console.error('❌ Error en la migración:', error);
    } finally {
        await sequelize.close();
        console.log('👋 Conexión cerrada');
    }
}

agregarColumnasTipo();
