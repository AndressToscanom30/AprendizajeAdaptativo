import sequelize from '../src/config/db.js';

async function updateOpcionPreguntaTexto() {
    try {
        console.log('🔄 Actualizando columna "texto" de OpcionPregunta para permitir NULL...');
        
        // Permitir NULL en la columna texto
        await sequelize.query(`
            ALTER TABLE "OpcionPregunta" 
            ALTER COLUMN "texto" DROP NOT NULL;
        `);
        
        console.log('✅ Columna "texto" actualizada exitosamente!');
        console.log('📋 Ahora la columna "texto" puede ser NULL para preguntas de código');
        console.log('💡 Los datos de código se almacenarán en el campo "metadata" (JSONB)');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al actualizar columna:', error);
        process.exit(1);
    }
}

updateOpcionPreguntaTexto();
