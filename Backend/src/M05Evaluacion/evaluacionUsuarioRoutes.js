import express from "express";
import { asignarEvaluacion } from "../M05Evaluacion/evaluacionUsuarioController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { rolRequerido } from "../middlewares/rolMW.js";


const router = express.Router();

router.post("/asignar", verifyToken , rolRequerido(["profesor", "ia"]), asignarEvaluacion);

export default router;