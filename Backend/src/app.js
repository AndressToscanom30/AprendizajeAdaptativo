import express from "express";
import cors from "cors";
import userRoutes from './M02Usuarios/userRoutes.js';
import authRoutes from './M01Auth/authRoutes.js';
import diagnosticoRoutes from "./M03Diagnostico/DiagnosticRoutes.js";
import evaluacionRoutes from "./M05Evaluacion/evaluacionRoutes.js";
import preguntaRoutes from "./M05Evaluacion/preguntaRoutes.js";
import intentoRoutes from "./M05Evaluacion/intentoRoutes.js";

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

//Rutas Diagnostico
app.use("/api/diagnostico", diagnosticoRoutes);

//Rutas evaluaciones
app.use("/api/evaluaciones", evaluacionRoutes);
app.use("/api/preguntas", preguntaRoutes);
app.use("/api/intentos", intentoRoutes);

export default app;