import groqService from "./services/groqService.js";
import AnalisisIA from "./models/AnalisisIA.js";
import TestAdaptativo from "./models/TestAdaptativo.js";
import Intento from "../M05Evaluacion/Intento.js";
import IntentoRespuesta from "../M05Evaluacion/IntentoRespuesta.js";
import Evaluacion from "../M05Evaluacion/Evaluacion.js";
import Pregunta from "../M05Evaluacion/Pregunta.js";
import OpcionPregunta from "../M05Evaluacion/OpcionPregunta.js";
import PreguntaEvaluacion from "../M05Evaluacion/PreguntaEvaluacion.js";
import EvaluacionUsuario from "../M05Evaluacion/EvaluacionUsuario.js";
import sequelize from "../config/db.js";

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
          {
            model: TestAdaptativo,
            as: "tests",
            required: false,
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: 20,
      });

      // Enriquecer con información de evaluaciones adaptativas generadas
      const analisisEnriquecidos = await Promise.all(
        analisis.map(async (a) => {
          const test = a.tests?.[0];
          let evaluacionAdaptativa = null;

          if (test?.evaluacionId) {
            evaluacionAdaptativa = await Evaluacion.findByPk(test.evaluacionId, {
              attributes: ["id", "titulo", "descripcion", "tipo"],
            });
          }

          return {
            id: a.id,
            intentoId: a.intentoId,
            evaluacionOriginal: a.intento?.evaluacion,
            puntuacionGlobal: a.puntuacionGlobal,
            porcentajeTotal: a.porcentajeTotal,
            debilidades: a.debilidades,
            fortalezas: a.fortalezas,
            recomendaciones: a.recomendaciones,
            estado: a.estado,
            tieneTestAdaptativo: !!test,
            evaluacionAdaptativa: evaluacionAdaptativa,
            createdAt: a.createdAt,
          };
        })
      );

      return res.json({
        success: true,
        total: analisisEnriquecidos.length,
        analisis: analisisEnriquecidos,
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

  // ✅ NUEVO: Análisis y generación automática después de completar intento
  async analizarYGenerarAutomatico(intentoId, userId) {
    try {
      console.log(`🤖 Iniciando análisis automático para intento ${intentoId}`);

      // 1. Obtener el intento completo
      const intento = await Intento.findByPk(intentoId, {
        include: [
          {
            model: Evaluacion,
            as: "evaluacion",
            attributes: ["id", "titulo", "descripcion", "curso_id"],
          },
          {
            model: IntentoRespuesta,
            as: "respuestas",
            include: [
              {
                model: Pregunta,
                as: "pregunta",
                attributes: ["id", "texto", "tipo", "dificultad", "puntos"],
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
        console.log("⚠️ Intento no encontrado");
        return null;
      }

      // 2. Verificar si ya existe análisis
      let analisis = await AnalisisIA.findOne({
        where: { intentoId: intentoId },
      });

      // 3. Si no existe o falló, crear/regenerar análisis
      if (!analisis || analisis.estado === "error") {
        const datosAnalisis = IAController.prepararDatosParaIA(intento);

        analisis = await AnalisisIA.create({
          usuarioId: userId,
          intentoId: intentoId,
          puntuacionGlobal: 0,
          porcentajeTotal: 0,
          estado: "procesando",
        });

        try {
          console.log("🧠 Solicitando análisis a IA...");
          const resultadoIA = await groqService.analizarDiagnostico(
            datosAnalisis.resultados,
            datosAnalisis.preguntas
          );

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

          console.log("✅ Análisis completado");
        } catch (error) {
          console.error("❌ Error en análisis IA:", error);
          await analisis.update({ estado: "error" });
          return null;
        }
      }

      // 4. Verificar si ya existe test adaptativo
      let testAdaptativo = await TestAdaptativo.findOne({
        where: { analisisId: analisis.id },
      });

      // 5. Si no existe test, generarlo
      if (!testAdaptativo) {
        try {
          console.log("🎯 Generando test adaptativo...");
          const testGenerado = await groqService.generarTestAdaptativo({
            debilidades: analisis.debilidades,
            fortalezas: analisis.fortalezas,
            categorias: analisis.categoriasAnalisis,
            evaluacion_original: intento.evaluacion.titulo,
          });

          testAdaptativo = await TestAdaptativo.create({
            usuarioId: userId,
            analisisId: analisis.id,
            preguntas: testGenerado.preguntas,
            enfoque: testGenerado.enfoque,
            estado: "generado",
          });

          console.log("✅ Test adaptativo generado");
        } catch (error) {
          console.error("❌ Error generando test adaptativo:", error);
          return { analisis };
        }
      }

      // 6. Convertir test a evaluación real si no se ha hecho
      if (
        testAdaptativo &&
        !testAdaptativo.evaluacionId &&
        testAdaptativo.estado === "generado"
      ) {
        try {
          console.log("📝 Convirtiendo test a evaluación...");
          const evaluacionAdaptativa = await this.convertirTestAEvaluacion(
            testAdaptativo,
            intento.evaluacion.curso_id,
            userId
          );

          await testAdaptativo.update({
            evaluacionId: evaluacionAdaptativa.id,
            estado: "convertido_evaluacion",
          });

          console.log(
            `🎉 Evaluación adaptativa creada: ${evaluacionAdaptativa.id}`
          );

          return {
            analisis,
            testAdaptativo,
            evaluacionAdaptativa,
          };
        } catch (error) {
          console.error("❌ Error convirtiendo test a evaluación:", error);
          return { analisis, testAdaptativo };
        }
      }

      return { analisis, testAdaptativo };
    } catch (error) {
      console.error("❌ Error en análisis automático:", error);
      return null;
    }
  }

  // ✅ NUEVO: Convertir test adaptativo a evaluación real
  async convertirTestAEvaluacion(testAdaptativo, cursoId, userId) {
    const t = await sequelize.transaction();

    try {
      // 1. Crear la evaluación adaptativa
      const evaluacion = await Evaluacion.create(
        {
          titulo: `Test Adaptativo - Refuerzo Personalizado`,
          descripcion: `Evaluación generada automáticamente por IA basada en tu desempeño. Enfoque: ${
            testAdaptativo.enfoque?.areas_reforzar?.join(", ") || "Refuerzo general"
          }`,
          duracion_minutos: 30,
          comienza_en: new Date(),
          termina_en: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
          max_intentos: 3,
          curso_id: cursoId,
          creado_por: userId, // ✅ Cambiado de createdBy
          activa: true,
          preguntas_revueltas: false,
          tipo: "adaptativo", // Marcador especial
          configuracion: {
            mostrar_resultados: true,
            aleatorizar_preguntas: true,
            aleatorizar_opciones: true,
            aprobacion_minima: 60,
            generado_por_ia: true
          }
        },
        { transaction: t }
      );

      // 2. Crear preguntas y opciones
      const preguntasIA = testAdaptativo.preguntas;

      for (let i = 0; i < preguntasIA.length; i++) {
        const preguntaIA = preguntasIA[i];

        const pregunta = await Pregunta.create(
          {
            texto: preguntaIA.pregunta,
            tipo: "opcion_multiple",
            dificultad: this.mapearDificultad(preguntaIA.dificultad),
            puntos: preguntaIA.dificultad || 1,
            tiempo_sugerido: 60,
            explicacion: preguntaIA.explicacion || "",
          },
          { transaction: t }
        );

        // Crear opciones
        const opcionesData = preguntaIA.opciones.map((op) => ({
          preguntaId: pregunta.id,
          texto: op.texto,
          es_correcta: op.es_correcta || false,
        }));

        await OpcionPregunta.bulkCreate(opcionesData, { transaction: t });

        // Vincular pregunta a evaluación
        await PreguntaEvaluacion.create(
          {
            evaluacionId: evaluacion.id,
            preguntaId: pregunta.id,
            orden: i + 1,
          },
          { transaction: t }
        );
      }

      // 3. Asignar evaluación al estudiante automáticamente
      await EvaluacionUsuario.create(
        {
          usuarioId: userId,
          evaluacionId: evaluacion.id,
          estado: "pendiente",
          fecha_asignacion: new Date(),
        },
        { transaction: t }
      );

      await t.commit();

      console.log(
        `✅ Evaluación adaptativa creada con ${preguntasIA.length} preguntas`
      );
      return evaluacion;
    } catch (error) {
      await t.rollback();
      console.error("❌ Error al convertir test a evaluación:", error);
      throw error;
    }
  }

  // Helper para mapear dificultad numérica a texto
  mapearDificultad(nivel) {
    if (nivel <= 2) return "facil";
    if (nivel <= 3) return "medio";
    return "dificil";
  }
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
