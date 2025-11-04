import sequelize from './src/config/db.js';
import Intento from './src/M05Evaluacion/Intento.js';
import IntentoRespuesta from './src/M05Evaluacion/IntentoRespuesta.js';

async function limpiarIntentos() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión establecida');

        // Obtener el ID de la evaluación que quieres limpiar
        // Cambia este ID por el de tu evaluación
        const evaluacionId = process.argv[2];
        
        if (!evaluacionId) {
            console.log('❌ Debes proporcionar el ID de la evaluación');
            console.log('Uso: node limpiar-intentos.js <evaluacionId>');
            process.exit(1);
        }

        // Encontrar todos los intentos de esa evaluación
        const intentos = await Intento.findAll({
            where: { evaluacionId }
        });

        console.log(`📊 Encontrados ${intentos.length} intentos para la evaluación ${evaluacionId}`);

        // Eliminar respuestas y luego intentos
        for (const intento of intentos) {
            await IntentoRespuesta.destroy({ where: { intentoId: intento.id } });
            await intento.destroy();
            console.log(`🗑️  Intento ${intento.id} eliminado`);
        }

        console.log('✅ Intentos limpiados correctamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

limpiarIntentos();
