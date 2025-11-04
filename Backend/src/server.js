import dotenv from "dotenv";
// ⚠️ IMPORTANTE: cargar .env ANTES de cualquier otro import
dotenv.config();

import app from "./app.js";
import sequelize from './config/db.js'
import "./config/relaciones.js";

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