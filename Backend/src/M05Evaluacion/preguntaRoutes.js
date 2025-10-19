import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { rolRequerido } from "../middlewares/rolMW.js";
import {
  crearPregunta,
  editarPregunta,
  eliminarPregunta,
  crearOpcion,
  editarOpcion,
  eliminarOpcion
} from "./preguntaController.js";

const router = Router();

//Preguntas (CRUD) — profesor
router.post("/", verifyToken, rolRequerido("profesor"), crearPregunta);
router.put("/:id", verifyToken, rolRequerido("profesor"), editarPregunta);
router.delete("/:id", verifyToken, rolRequerido("profesor"), eliminarPregunta);

//Opciones de pregunta
router.post("/:preguntaId/opciones", verifyToken, rolRequerido("profesor"), crearOpcion);
router.put("/opciones/:id", verifyToken, rolRequerido("profesor"), editarOpcion);
router.delete("/opciones/:id", verifyToken, rolRequerido("profesor"), eliminarOpcion);

export default router;