import sequelize from '../src/config/db.js';

async function migrarEvaluacion() {
    try {
        console.log('🔄 Iniciando migración de tabla Evaluacion...');

        // Agregar campo 'activa' si no existe
        await sequelize.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='Evaluacion' AND column_name='activa'
                ) THEN
                    ALTER TABLE "Evaluacion" ADD COLUMN activa BOOLEAN DEFAULT true;
                    RAISE NOTICE 'Campo activa agregado';
                ELSE
                    RAISE NOTICE 'Campo activa ya existe';
                END IF;
            END $$;
        `);

        // Agregar campo 'curso_id' si no existe
        await sequelize.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='Evaluacion' AND column_name='curso_id'
                ) THEN
                    ALTER TABLE "Evaluacion" ADD COLUMN curso_id UUID;
                    RAISE NOTICE 'Campo curso_id agregado';
                ELSE
                    RAISE NOTICE 'Campo curso_id ya existe';
                END IF;
            END $$;
        `);

        // Actualizar evaluaciones existentes para que estén activas por defecto
        await sequelize.query(`
            UPDATE "Evaluacion" 
            SET activa = true 
            WHERE activa IS NULL;
        `);

        console.log('✅ Migración completada exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en la migración:', error);
        process.exit(1);
    }
}

migrarEvaluacion();
