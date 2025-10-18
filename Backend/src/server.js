import app from "./app.js";
import dotenv from "dotenv";
import sequelize from './config/db.js'

dotenv.config();
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a BD exitosa.");

    await sequelize.sync({ alter: true }); 

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
  }
})();