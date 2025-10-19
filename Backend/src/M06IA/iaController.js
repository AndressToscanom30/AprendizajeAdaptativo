import groqService from "./services/groqService.js";
import AnalisisIA from "./models/AnalisisIA.js";
import TestAdaptativo from "./models/TestAdaptativo.js";
import Intento from "../M05Evaluacion/intento.js";
import IntentoRespuesta from "../M05Evaluacion/IntentoRespuesta.js";
import Evaluacion from "../M05Evaluacion/Evaluacion.js";
import Pregunta from "../M05Evaluacion/Pregunta.js";
import OpcionPregunta from "../M05Evaluacion/OpcionPregunta.js";

class IAController {
  async analizarIntento(req, res) {
    try {
      const { intentoId } = req.params;
      const userId = req.user.id;

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

      if (String(intento.userId) !== String(userId)) {
        return res.status(403).json({
          success: false,
          error: "No tienes permiso para acceder a este intento",
        });
      }

      const estadosValidos = ["calificado", "revisado"];
      if (!estadosValidos.includes(intento.status)) {
        return res.status(400).json({
          success: false,
          error: "El intento debe estar calificado o revisado para analizarlo",
          estadoActual: intento.status,
          estadosValidos: estadosValidos,
        });
      }

      const analisisExistente = await AnalisisIA.findOne({
        where: { intentoId: intentoId },
      });

      if (analisisExistente) {
        // ✅ Si está en error, lo borramos y reintentamos
        if (analisisExistente.estado === "error") {
          console.log("⚠️  Análisis anterior falló, reintentando...");
          await analisisExistente.destroy();
          // Continúa con el flujo normal
        }
        // Si está completado, lo devolvemos
        else if (analisisExistente.estado === "completado") {
          return res.json({
            success: true,
            mensaje: "Ya existe un análisis completado para este intento",
            analisis: analisisExistente,
          });
        }
        // Si está procesando, informamos
        else {
          return res.json({
            success: true,
            mensaje: "El análisis está siendo procesado",
            analisis: analisisExistente,
          });
        }
      }

      // ✅ CAMBIADO: this.prepararDatosParaIA → IAController.prepararDatosParaIA
      const datosAnalisis = IAController.prepararDatosParaIA(intento);

      const analisis = await AnalisisIA.create({
        usuarioId: userId,
        intentoId: intentoId,
        puntuacionGlobal: 0,
        porcentajeTotal: 0,
        estado: "procesando",
      });

      try {
        console.log("🤖 Llamando a Groq API...");

        const resultadoIA = await groqService.analizarDiagnostico(
          datosAnalisis.resultados,
          datosAnalisis.preguntas
        );

        console.log("✅ Respuesta de Groq recibida");

        await analisis.update({
          puntuacionGlobal: resultadoIA.puntuacion_global,
          porcentajeTotal: resultadoIA.porcentaje_total,
          debilidades: resultadoIA.debilidades,
          fortalezas: resultadoIA.fortalezas,
          categoriasAnalisis: resultadoIA.categorias,
          recomendaciones: resultadoIA.recomendaciones,
          tiempoEstudioSugerido: resultadoIA.tiempo_estudio_sugerido,
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
        console.error("❌ Error en Groq API:", errorIA);
        await analisis.update({ estado: "error" });
        throw errorIA;
      }
    } catch (error) {
      console.error("❌ Error al analizar intento:", error);
      return res.status(500).json({
        success: false,
        error: "Error al analizar el intento",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  async generarTestAdaptativo(req, res) {
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
                as: "evaluacion",
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

      if (String(analisis.usuarioId) !== String(userId)) {
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

      const testExistente = await TestAdaptativo.findOne({
        where: { analisisId: analisisId },
      });

      if (testExistente) {
        return res.json({
          success: true,
          mensaje: "Ya existe un test adaptativo para este análisis",
          test: testExistente,
        });
      }

      const testGenerado = await groqService.generarTestAdaptativo({
        debilidades: analisis.debilidades,
        fortalezas: analisis.fortalezas,
        categorias: analisis.categoriasAnalisis,
        evaluacion_original: analisis.intento.evaluacion.titulo,
      });

      const testAdaptativo = await TestAdaptativo.create({
        usuarioId: userId,
        analisisId: analisisId,
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

  async obtenerMisAnalisis(req, res) {
    try {
      const userId = req.user.id;

      const analisis = await AnalisisIA.findAll({
        where: { usuarioId: userId },
        include: [
          {
            model: Intento,
            as: "intento",
            include: [
              {
                model: Evaluacion,
                as: "evaluacion",
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
                as: "evaluacion",
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

      if (String(analisis.usuarioId) !== String(userId)) {
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
                    as: "evaluacion",
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

      if (String(test.usuarioId) !== String(userId)) {
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

  // ✅ Método estático (se llama con IAController.prepararDatosParaIA)
  static prepararDatosParaIA(intento) {
    // ✅ Calcular puntaje si no existe
    const respuestasCorrectas = (intento.respuestas || []).filter(
      (r) => r.es_correcta
    ).length;
    const puntaje =
      intento.puntajeTotal || intento.total_puntaje || respuestasCorrectas;

    console.log("🔍 Debug intento:", {
      puntaje_calculado: puntaje,
      respuestas_correctas: respuestasCorrectas,
      total_respuestas: intento.respuestas?.length,
    });

    const resultados = {
      puntuacion: puntaje,
      total_preguntas: intento.respuestas?.length || 0,
      respuestas: (intento.respuestas || []).map((respuesta) => {
        const pregunta = respuesta.pregunta;

        const esCorrecta =
          respuesta.es_correcta !== undefined
            ? respuesta.es_correcta
            : IAController.evaluarRespuesta(respuesta, pregunta);

        return {
          pregunta_id: pregunta.id,
          categoria: pregunta.categoria || "General",
          tipo: pregunta.tipo,
          dificultad: pregunta.dificultad,
          es_correcta: esCorrecta,
          respuesta_usuario: {
            opcionSeleccionadaId: respuesta.opcionSeleccionadaId,
            opcion_seleccionadaIds: respuesta.opcion_seleccionadaIds,
            texto_respuesta: respuesta.texto_respuesta,
          },
        };
      }),
    };

    const preguntas = (intento.respuestas || []).map((respuesta) => ({
      id: respuesta.pregunta.id,
      categoria: respuesta.pregunta.categoria || "General",
      tipo: respuesta.pregunta.tipo,
      dificultad: respuesta.pregunta.dificultad,
      texto: respuesta.pregunta.text,
    }));

    return { resultados, preguntas };
  }
  // ✅ Método estático
  static evaluarRespuesta(intentoRespuesta, pregunta) {
    // ✅ ACTUALIZADO: Usar los nombres de campo correctos
    console.log("🔍 Debug respuesta:", {
      opcionSeleccionadaId: intentoRespuesta.opcionSeleccionadaId,
      opcion_seleccionadaIds: intentoRespuesta.opcion_seleccionadaIds,
      texto_respuesta: intentoRespuesta.texto_respuesta,
      es_correcta: intentoRespuesta.es_correcta,
      tipo_pregunta: pregunta.tipo,
    });

    switch (pregunta.tipo) {
      case "opcion_multiple":
      case "verdadero_falso":
        // ✅ Usar opcionSeleccionadaId
        const opcionCorrecta = pregunta.opciones?.find(
          (o) => o.esCorrecta || o.es_correcta
        );
        return intentoRespuesta.opcionSeleccionadaId === opcionCorrecta?.id;

      case "seleccion_multiple":
        // ✅ Usar opcion_seleccionadaIds (es un array)
        const correctas =
          pregunta.opciones
            ?.filter((o) => o.esCorrecta || o.es_correcta)
            .map((o) => o.id)
            .sort() || [];

        const seleccionadas = (
          intentoRespuesta.opcion_seleccionadaIds || []
        ).sort();
        return JSON.stringify(correctas) === JSON.stringify(seleccionadas);

      case "respuesta_corta":
      case "completar_blanco":
        // ✅ Usar texto_respuesta
        return (
          intentoRespuesta.texto_respuesta?.trim().toLowerCase() ===
          pregunta.respuestaCorrecta?.trim().toLowerCase()
        );

      default:
        // Si ya viene evaluado desde la BD
        return intentoRespuesta.es_correcta || false;
    }
  }
}

export default new IAController();
