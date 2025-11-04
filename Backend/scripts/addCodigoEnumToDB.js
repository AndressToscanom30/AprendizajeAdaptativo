import sequelize from '../src/config/db.js';

async function addCodigoToEnum() {
    try {
        console.log('🔄 Agregando tipo "codigo" al enum enum_Pregunta_tipo...');
        
        // Agregar el nuevo valor al enum existente
        await sequelize.query(`
            ALTER TYPE "enum_Pregunta_tipo" ADD VALUE IF NOT EXISTS 'codigo';
        `);
        
        console.log('✅ Tipo "codigo" agregado exitosamente al enum!');
        console.log('📋 Valores actuales del enum: opcion_multiple, seleccion_multiple, verdadero_falso, respuesta_corta, respuesta_larga, completar_blanco, relacion_par, codigo');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al agregar tipo al enum:', error);
        process.exit(1);
    }
}

addCodigoToEnum();
