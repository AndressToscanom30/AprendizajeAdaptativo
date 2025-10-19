import sequelize from '../src/config/db.js';  // ✅ Ajusta la ruta
import '../src/config/relaciones.js';  // ✅ Ajusta la ruta


const syncDatabase = async () => {
  try {
    console.log('🔄 Verificando conexión a base de datos...');
    
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    console.log('🔄 Sincronizando modelos de IA...');
    
    // alter: true → Actualiza las tablas sin borrar datos
    await sequelize.sync({ alter: true });
    
    console.log('✅ Tablas sincronizadas correctamente:');
    console.log('   📊 AnalisisIA');
    console.log('   📝 TestsAdaptativos');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sincronizar base de datos');
    console.error('Mensaje:', error.message);
    
    if (error.parent) {
      console.error('Detalle SQL:', error.parent.message);
    }
    
    process.exit(1);
  }
};

syncDatabase();