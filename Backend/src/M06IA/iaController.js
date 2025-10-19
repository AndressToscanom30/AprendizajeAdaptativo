import groqService from "./services/groqService.js";
import AnalisisIA from "./models/AnalisisIA.js";
import TestAdaptativo from "./models/TestAdaptativo.js";
import Intento from "../M05Evaluacion/intento.js";
import IntentoRespuesta from "../M05Evaluacion/IntentoRespuesta.js";
import Evaluacion from "../M05Evaluacion/Evaluacion.js";
import Pregunta from "../M05Evaluacion/Pregunta.js";
import OpcionPregunta from "../M05Evaluacion/OpcionPregunta.js";

class IAController {
  /**
   * POST /api/ia/analizar-intento/:intentoId
   * Analiza un intento finalizado y genera recomendaciones
   */
  async analizarIntento(req, res) {
    try {
      const { intentoId } = req.params;
      const userId = req.user.id;

      // 1. Verificar que el intento existe y pertenece al usuario
      const intento = await Intento.findByPk(intentoId, {
        include: [
          {
            model: Evaluacion,
            as: "evaluacion",
            attributes: ["id", "titulo", "descripcion"],
          },
          {
            model: IntentoRespuesta,
            as: "respuestas",
            include: [
              {
                model: Pregunta,
                as: "pregunta",
                attributes: ["id", "text", "tipo", "dificultad"],
                include: [
                  {
                    model: OpcionPregunta,
                    as: "opciones",
                    attributes: ["id", "texto", "es_correcta"],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!intento) {
        return res.status(404).json({
          success: false,
          error: "Intento no encontrado",
        });
      }

      if (intento.usuarioId !== userId) {
        return res.status(403).json({
          success: false,
          error: "No tienes permiso para acceder a este intento",
        });
      }

      if (intento.estado !== "finalizado") {
        return res.status(400).json({
          success: false,
          error: "El intento debe estar finalizado para analizarlo",
        });
      }

      // 2. Verificar si ya existe un análisis
      const analisisExistente = await AnalisisIA.findOne({
        where: { intento_id: intentoId },
      });

      if (analisisExistente) {
        return res.json({
          success: true,
          mensaje: "Ya existe un análisis para este intento",
          analisis: analisisExistente,
        });
      }

      // 3. Preparar datos para la IA
      const datosAnalisis = this.prepararDatosParaIA(intento);

      // 4. Crear registro de análisis (estado: procesando)
      const analisis = await AnalisisIA.create({
        usuario_id: userId,
        intento_id: intentoId,
        puntuacion_global: 0,
        porcentaje_total: 0,
        estado: "procesando",
      });

      // 5. Llamar a Groq API (asíncrono)
      try {
        const resultadoIA = await groqService.analizarDiagnostico(
          datosAnalisis.resultados,
          datosAnalisis.preguntas
        );

        // 6. Actualizar análisis con resultados
        await analisis.update({
          puntuacion_global: resultadoIA.puntuacion_global,
          porcentaje_total: resultadoIA.porcentaje_total,
          debilidades: resultadoIA.debilidades,
          fortalezas: resultadoIA.fortalezas,
          categorias_analisis: resultadoIA.categorias,
          recomendaciones: resultadoIA.recomendaciones,
          tiempo_estudio_sugerido: resultadoIA.tiempo_estudio_sugerido,
          estado: "completado",
        });

        return res.json({
          success: true,
          mensaje: "Análisis completado exitosamente",
          analisis: {
            id: analisis.id,
            puntuacion_global: resultadoIA.puntuacion_global,
            porcentaje_total: resultadoIA.porcentaje_total,
            debilidades: resultadoIA.debilidades,
            fortalezas: resultadoIA.fortalezas,
            categorias: resultadoIA.categorias,
            recomendaciones: resultadoIA.recomendaciones,
            tiempo_estudio_sugerido: resultadoIA.tiempo_estudio_sugerido,
          },
        });
      } catch (errorIA) {
        // Error en la IA - marcar análisis como error
        await analisis.update({ estado: "error" });

        throw errorIA;
      }
    } catch (error) {
      console.error("Error al analizar intento:", error);
      return res.status(500).json({
        success: false,
        error: "Error al analizar el intento",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * POST /api/ia/generar-test-adaptativo/:analisisId
   * Genera preguntas adaptativas basadas en el análisis
   */
  async generarTestAdaptativo(req, res) {
    try {
      const { analisisId } = req.params;
      const userId = req.user.id;

      // 1. Obtener el análisis
      const analisis = await AnalisisIA.findByPk(analisisId, {
        include: [
          {
            model: Intento,
            as: "intento",
            include: [{ model: Evaluacion }],
          },
        ],
      });

      if (!analisis) {
        return res.status(404).json({
          success: false,
          error: "Análisis no encontrado",
        });
      }

      if (analisis.usuario_id !== userId) {
        return res.status(403).json({
          success: false,
          error: "No tienes permiso para acceder a este análisis",
        });
      }

      if (analisis.estado !== "completado") {
        return res.status(400).json({
          success: false,
          error: "El análisis debe estar completado",
        });
      }

      // 2. Verificar si ya existe test adaptativo
      const testExistente = await TestAdaptativo.findOne({
        where: { analisis_id: analisisId },
      });

      if (testExistente) {
        return res.json({
          success: true,
          mensaje: "Ya existe un test adaptativo para este análisis",
          test: testExistente,
        });
      }

      // 3. Generar test con IA
      const testGenerado = await groqService.generarTestAdaptativo({
        debilidades: analisis.debilidades,
        fortalezas: analisis.fortalezas,
        categorias: analisis.categorias_analisis,
        evaluacion_original: analisis.intento.Evaluacion.titulo,
      });

      // 4. Guardar test adaptativo
      const testAdaptativo = await TestAdaptativo.create({
        usuario_id: userId,
        analisis_id: analisisId,
        preguntas: testGenerado.preguntas,
        enfoque: testGenerado.enfoque,
        estado: "generado",
      });

      return res.json({
        success: true,
        mensaje: "Test adaptativo generado exitosamente",
        test: {
          id: testAdaptativo.id,
          total_preguntas: testGenerado.preguntas.length,
          preguntas: testGenerado.preguntas,
          enfoque: testGenerado.enfoque,
        },
      });
    } catch (error) {
      console.error("Error al generar test adaptativo:", error);
      return res.status(500).json({
        success: false,
        error: "Error al generar test adaptativo",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * GET /api/ia/mis-analisis
   * Obtiene todos los análisis del usuario autenticado
   */
  async obtenerMisAnalisis(req, res) {
    try {
      const userId = req.user.id;

      const analisis = await AnalisisIA.findAll({
        where: { usuario_id: userId },
        include: [
          {
            model: Intento,
            as: "intento",
            include: [
              {
                model: Evaluacion,
                attributes: ["id", "titulo", "descripcion"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: 20,
      });

      return res.json({
        success: true,
        total: analisis.length,
        analisis,
      });
    } catch (error) {
      console.error("Error al obtener análisis:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener análisis",
      });
    }
  }

  /**
   * GET /api/ia/analisis/:analisisId
   * Obtiene un análisis específico con detalles completos
   */
  async obtenerAnalisisDetallado(req, res) {
    try {
      const { analisisId } = req.params;
      const userId = req.user.id;

      const analisis = await AnalisisIA.findByPk(analisisId, {
        include: [
          {
            model: Intento,
            as: "intento",
            include: [
              {
                model: Evaluacion,
                attributes: ["id", "titulo", "descripcion", "duracion_minutos"],
              },
            ],
          },
        ],
      });

      if (!analisis) {
        return res.status(404).json({
          success: false,
          error: "Análisis no encontrado",
        });
      }

      if (analisis.usuario_id !== userId) {
        return res.status(403).json({
          success: false,
          error: "No tienes permiso para ver este análisis",
        });
      }

      return res.json({
        success: true,
        analisis,
      });
    } catch (error) {
      console.error("Error al obtener análisis detallado:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener análisis",
      });
    }
  }

  /**
   * GET /api/ia/test-adaptativo/:testId
   * Obtiene un test adaptativo específico
   */
  async obtenerTestAdaptativo(req, res) {
    try {
      const { testId } = req.params;
      const userId = req.user.id;

      const test = await TestAdaptativo.findByPk(testId, {
        include: [
          {
            model: AnalisisIA,
            as: "analisis",
            include: [
              {
                model: Intento,
                as: "intento",
                include: [
                  {
                    model: Evaluacion,
                    attributes: ["titulo"],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!test) {
        return res.status(404).json({
          success: false,
          error: "Test adaptativo no encontrado",
        });
      }

      if (test.usuario_id !== userId) {
        return res.status(403).json({
          success: false,
          error: "No tienes permiso para ver este test",
        });
      }

      return res.json({
        success: true,
        test,
      });
    } catch (error) {
      console.error("Error al obtener test adaptativo:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener test adaptativo",
      });
    }
  }

  /**
   * Método auxiliar: Preparar datos del intento para enviar a la IA
   */
  prepararDatosParaIA(intento) {
    const resultados = {
      puntuacion: intento.puntaje_total,
      total_preguntas: intento.IntentoRespuestas.length,
      respuestas: intento.IntentoRespuestas.map((respuesta) => {
        const pregunta = respuesta.Pregunta;
        const esCorrecta = this.evaluarRespuesta(respuesta, pregunta);

        return {
          pregunta_id: pregunta.id,
          categoria: pregunta.categoria || "General",
          tipo: pregunta.tipo,
          dificultad: pregunta.dificultad,
          es_correcta: esCorrecta,
          respuesta_usuario: respuesta.respuesta,
        };
      }),
    };

    const preguntas = intento.IntentoRespuestas.map((respuesta) => ({
      id: respuesta.Pregunta.id,
      categoria: respuesta.Pregunta.categoria || "General",
      tipo: respuesta.Pregunta.tipo,
      dificultad: respuesta.Pregunta.dificultad,
      texto: respuesta.Pregunta.text,
    }));

    return { resultados, preguntas };
  }

  /**
   * Método auxiliar: Evaluar si una respuesta es correcta
   */
  evaluarRespuesta(intentoRespuesta, pregunta) {
    const respuesta = intentoRespuesta.respuesta;

    switch (pregunta.tipo) {
      case "opcion_multiple":
      case "verdadero_falso":
        const opcionCorrecta = pregunta.opciones.find((o) => o.es_correcta);
        return respuesta.opcionSeleccionada === opcionCorrecta?.id;

      case "seleccion_multiple":
        const correctas = pregunta.opciones
          .filter((o) => o.es_correcta)
          .map((o) => o.id)
          .sort();
        const seleccionadas = (respuesta.opcionesSeleccionadas || []).sort();
        return JSON.stringify(correctas) === JSON.stringify(seleccionadas);

      case "respuesta_corta":
      case "completar_blanco":
        return (
          respuesta.texto?.trim().toLowerCase() ===
          pregunta.respuesta_correcta?.trim().toLowerCase()
        );

      default:
        return false; // Por defecto
    }
  }
}

export default new IAController();
