import express from "express";
import userRoutes from './routes/userRoutes.js'

const app = express()

app.use(express.json());

//Rutas
app.get("/", (req, res) => {
    res.send("Backend corriendo fino...");
});

//Rutas Usuarios
app.use("/api", userRoutes);

export default app;