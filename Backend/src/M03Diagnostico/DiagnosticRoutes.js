import express from "express";
import { crearDiagnostico } from "./diagnosticoController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, crearDiagnostico);

export default router;
