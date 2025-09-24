import express from "express";
import cors from "cors";

const app = express()

app.use(cors());
app.use(express.json());

//Rutas
app.get("/", (req, res) => {
    res.send("Backend corriendo fino...");
});

export default app;