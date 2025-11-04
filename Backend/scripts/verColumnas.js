import dotenv from 'dotenv';
import sequelize from '../src/config/db.js';

dotenv.config();

const [cols] = await sequelize.query(
  "SELECT column_name FROM information_schema.columns WHERE table_name = 'CourseStudents' ORDER BY ordinal_position"
);

console.log('📋 Columnas de CourseStudents:\n');
cols.forEach(c => console.log(`  - ${c.column_name}`));

process.exit(0);
