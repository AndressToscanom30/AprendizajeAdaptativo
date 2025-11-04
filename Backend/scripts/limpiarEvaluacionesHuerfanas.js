import sequelize from '../src/config/db.js';
import EvaluacionUsuario from '../src/M05Evaluacion/EvaluacionUsuario.js';
import Evaluacion from '../src/M05Evaluacion/Evaluacion.js';

async function limpiarEvaluacionesHuerfanas() {
    try {
        await sequelize.authenticate();
        console.log('✓ Conexión a BD exitosa');

        // Buscar todas las asignaciones
        const asignaciones = await EvaluacionUsuario.findAll();
        
        let eliminados = 0;
        
        for (const asignacion of asignaciones) {
            // Verificar si la evaluación existe
            const evaluacion = await Evaluacion.findByPk(asignacion.evaluacionId);
            
            if (!evaluacion) {
                console.log(`Eliminando asignación huérfana: EvaluacionUsuario ID ${asignacion.id} (evaluacionId: ${asignacion.evaluacionId})`);
                await asignacion.destroy();
                eliminados++;
            }
        }

        console.log(`\n✓ Limpieza completada: ${eliminados} registros huérfanos eliminados`);
        console.log(`✓ Total de asignaciones válidas: ${asignaciones.length - eliminados}`);
        
        process.exit(0);
    } catch (error) {
        console.error('✗ Error:', error);
        process.exit(1);
    }
}

limpiarEvaluacionesHuerfanas();
