import express from "express";
import cors from "cors";
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express()

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

//Rutas
app.get("/", (req, res) => {
    res.send("Backend corriendo fino...");
});

//Rutas Usuarios
app.use("/api", userRoutes);

//Ruta para Login
app.use("/api/auth", authRoutes)

export default app;