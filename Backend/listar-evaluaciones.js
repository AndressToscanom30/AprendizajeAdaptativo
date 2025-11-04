import sequelize from './src/config/db.js';
import Evaluacion from './src/M05Evaluacion/Evaluacion.js';
import Intento from './src/M05Evaluacion/Intento.js';

async function listarEvaluaciones() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión establecida\n');

        const evaluaciones = await Evaluacion.findAll({
            attributes: ['id', 'titulo', 'descripcion'],
            order: [['createdAt', 'DESC']]
        });

        console.log('📚 EVALUACIONES DISPONIBLES:\n');
        
        for (const evaluacion of evaluaciones) {
            const intentos = await Intento.count({ where: { evaluacionId: evaluacion.id } });
            
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`📝 ${evaluacion.titulo}`);
            console.log(`🆔 ID: ${evaluacion.id}`);
            console.log(`📋 Descripción: ${evaluacion.descripcion || 'Sin descripción'}`);
            console.log(`🔢 Intentos registrados: ${intentos}`);
            console.log('');
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('💡 Para limpiar intentos usa:');
        console.log('   node limpiar-intentos.js <ID_DE_LA_EVALUACION>\n');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

listarEvaluaciones();
