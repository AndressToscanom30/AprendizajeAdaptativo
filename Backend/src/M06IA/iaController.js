/**
 * Controlador de Inteligencia Artificial
 * Gestiona análisis de intentos de evaluación y generación de tests adaptativos
 */
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
import Etiqueta from "../M05Evaluacion/Etiqueta.js";
import sequelize from "../config/db.js";
import { Op } from "sequelize";

// Constantes
const ESTADOS_VALIDOS_ANALISIS = ["enviado", "calificado", "revisado"];
const ESTADO_PROCESANDO = "procesando";
const ESTADO_COMPLETADO = "completado";
const ESTADO_ERROR = "error";

/**
 * Controlador para funcionalidades de IA educativa
 */
class IAController {
  /**
   * Analiza un intento de evaluación usando IA
   * @param {Object} req - Request con intentoId en params
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Análisis de IA generado
   */
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
                attributes: ["id", "texto", "tipo", "dificultad"],
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

      // Verificar estados válidos del intento
      if (!ESTADOS_VALIDOS_ANALISIS.includes(intento.status)) {
        return res.status(400).json({
          success: false,
          error: "El intento debe estar calificado o revisado para analizarlo",
          estadoActual: intento.status,
          estadosValidos: ESTADOS_VALIDOS_ANALISIS,
        });
      }

      const analisisExistente = await AnalisisIA.findOne({
        where: { intentoId: intentoId },
      });

      if (analisisExistente) {
        // Si está en error, lo borramos y reintentamos
        if (analisisExistente.estado === ESTADO_ERROR) {
          await analisisExistente.destroy();
        }
        // Si está completado, lo devolvemos
        else if (analisisExistente.estado === ESTADO_COMPLETADO) {
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

      const datosAnalisis = IAController.prepararDatosParaIA(intento);

      const analisis = await AnalisisIA.create({
        usuarioId: userId,
        intentoId: intentoId,
        puntuacionGlobal: 0,
        porcentajeTotal: 0,
        estado: ESTADO_PROCESANDO,
      });

      try {
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
          estado: ESTADO_COMPLETADO,
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
      } catch (error_) {
        console.error("❌ Error en Groq API:", error_);
        await analisis.update({ estado: ESTADO_ERROR });
        throw error_;
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

  /**
   * Genera un test adaptativo basado en el análisis de IA
   * @param {Object} req - Request con analisisId en params
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Test adaptativo generado
   */
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

      let analisis = await AnalisisIA.findAll({
        where: { 
          usuarioId: userId,
          estado: 'completado' // ✅ Solo devolver análisis completados
        },
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

      // Si no hay análisis, intentar generar en segundo plano el más reciente
      if (!analisis || analisis.length === 0) {
        const ultimoIntento = await Intento.findOne({
          where: {
            userId,
            status: "enviado",
            updatedAt: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          },
          order: [["updatedAt", "DESC"]],
        });

        if (ultimoIntento) {
          // Lanzar análisis en background y responder vacío por ahora
          setImmediate(async () => {
            try {
              await this.analizarYGenerarAutomatico(ultimoIntento.id, userId);
            } catch (e) {
              console.error("Error generando análisis en obtenerMisAnalisis:", e.message);
            }
          });
        }
      }

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
            debilidades: typeof a.debilidades === 'string' ? JSON.parse(a.debilidades) : (a.debilidades || []),
            fortalezas: typeof a.fortalezas === 'string' ? JSON.parse(a.fortalezas) : (a.fortalezas || []),
            recomendaciones: typeof a.recomendaciones === 'string' ? JSON.parse(a.recomendaciones) : (a.recomendaciones || []),
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
                attributes: ["id", "texto", "tipo", "dificultad"],
                include: [
                  {
                    model: OpcionPregunta,
                    as: "opciones",
                    attributes: ["id", "texto", "es_correcta"],
                  },
                  {
                    model: Etiqueta,
                    as: "etiquetas",
                    attributes: ["id", "nombre"],
                    through: { attributes: [] }
                  }
                ],
              },
            ],
          },
        ],
      });

      if (!intento) {
        
        return null;
      }

      // 2. Verificar si ya existe análisis para ESTA evaluación (cualquier intento)
      let analisisExistente = await AnalisisIA.findOne({
        include: [{
          model: Intento,
          as: 'intento',
          where: { evaluacionId: intento.evaluacionId, userId },
          attributes: ['id', 'total_puntaje']
        }],
        order: [[{ model: Intento, as: 'intento' }, 'total_puntaje', 'DESC']]
      });

      // 3. Si ya existe análisis y este intento NO es mejor, no crear nuevo
      if (analisisExistente) {
        const puntajeAnterior = analisisExistente.intento?.total_puntaje || 0;
        const puntajeNuevo = intento.total_puntaje || 0;
        
        console.log(`📊 Análisis existente - Puntaje anterior: ${puntajeAnterior}, Nuevo: ${puntajeNuevo}`);
        
        // Solo actualizar si el nuevo intento es MEJOR
        if (puntajeNuevo <= puntajeAnterior) {
          console.log(`⏭️  Intento no es mejor, conservando análisis anterior`);
          return analisisExistente;
        }
        
        console.log(`✨ Nuevo intento es mejor, actualizando análisis...`);
        // Eliminar análisis anterior para crear uno nuevo
        await analisisExistente.destroy();
      }

      // 4. Crear nuevo análisis para el mejor intento
      let analisis = await AnalisisIA.findOne({
        where: { intentoId: intentoId },
      });

      // 5. Si no existe o falló, crear/regenerar análisis
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

      // 5. Si no existe test O si falló anteriormente, (re)generarlo
      if (!testAdaptativo || testAdaptativo.estado === "error") {
        try {
          console.log(`🎯 Generando test adaptativo para análisis ${analisis.id}...`);
          
          const testGenerado = await groqService.generarTestAdaptativo({
            debilidades: analisis.debilidades,
            fortalezas: analisis.fortalezas,
            categorias: analisis.categoriasAnalisis,
            evaluacion_original: intento.evaluacion.titulo,
          });

          if (testAdaptativo && testAdaptativo.estado === "error") {
            // Actualizar test existente que falló
            await testAdaptativo.update({
              preguntas: testGenerado.preguntas,
              enfoque: testGenerado.enfoque,
              estado: "generado",
            });
            console.log(`✅ Test adaptativo regenerado exitosamente`);
          } else {
            // Crear nuevo test
            testAdaptativo = await TestAdaptativo.create({
              usuarioId: userId,
              analisisId: analisis.id,
              preguntas: testGenerado.preguntas,
              enfoque: testGenerado.enfoque,
              estado: "generado",
            });
            console.log(`✅ Test adaptativo creado exitosamente`);
          }

          
        } catch (error) {
          console.error("❌ Error generando test adaptativo:", error);
          
          // Marcar como error si existe
          if (testAdaptativo) {
            await testAdaptativo.update({ estado: "error" });
          }
          
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
          console.log(`🔄 Convirtiendo test a evaluación...`);
          
          const evaluacionAdaptativa = await this.convertirTestAEvaluacion(
            testAdaptativo,
            intento.evaluacion.curso_id,
            userId
          );

          await testAdaptativo.update({
            evaluacionId: evaluacionAdaptativa.id,
            estado: "convertido_evaluacion",
          });

          console.log(`✅ Test convertido a evaluación ID: ${evaluacionAdaptativa.id}`);

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
          curso_id: cursoId || null, // ✅ Permitir null si no hay curso
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

        // Determinar tipo de pregunta
        const tipoPregunta = preguntaIA.tipo_pregunta || 'opcion_multiple';
        
        const pregunta = await Pregunta.create(
          {
            texto: preguntaIA.pregunta,
            tipo: tipoPregunta,
            dificultad: this.mapearDificultad(preguntaIA.dificultad),
            explicacion: preguntaIA.explicacion || "",
            codigo: preguntaIA.codigo || null, // ✅ Agregar código si existe
            respuesta_esperada: preguntaIA.respuesta_esperada || null, // ✅ Para preguntas de respuesta_corta
            creado_por: userId,
          },
          { transaction: t }
        );

        // Crear opciones SOLO si existen (no para respuesta_corta)
        if (preguntaIA.opciones && Array.isArray(preguntaIA.opciones)) {
          const opcionesData = preguntaIA.opciones.map((op) => ({
            preguntaId: pregunta.id,
            texto: op.texto,
            // ✅ Soportar tanto es_correcta como esCorrecta (por si la IA usa camelCase)
            es_correcta: op.es_correcta !== undefined ? op.es_correcta : (op.esCorrecta || false),
          }));

          await OpcionPregunta.bulkCreate(opcionesData, { transaction: t });
        }

        // ✅ Crear etiqueta con la categoría de la pregunta
        if (preguntaIA.categoria) {
          // Buscar o crear etiqueta
          const [etiqueta] = await Etiqueta.findOrCreate({
            where: { nombre: preguntaIA.categoria },
            defaults: { nombre: preguntaIA.categoria },
            transaction: t
          });
          
          // Asociar etiqueta con pregunta
          await pregunta.addEtiqueta(etiqueta, { transaction: t });
        }

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
    // Enum permitido en el modelo es: "facil" | "media" | "dificil"
    if (nivel <= 3) return "media";
    return "dificil";
  }
  static prepararDatosParaIA(intento) {
    // ✅ Calcular puntaje si no existe
    const respuestasCorrectas = (intento.respuestas || []).filter(
      (r) => r.es_correcta
    ).length;
    const puntaje =
      intento.puntajeTotal || intento.total_puntaje || respuestasCorrectas;

    

    const resultados = {
      puntuacion: puntaje,
      total_preguntas: intento.respuestas?.length || 0,
      respuestas: (intento.respuestas || []).map((respuesta) => {
        const pregunta = respuesta.pregunta;
        
        // Obtener categoría desde etiquetas
        const categoria = pregunta.etiquetas && pregunta.etiquetas.length > 0
          ? pregunta.etiquetas.map(e => e.nombre).join(', ')
          : `Preguntas de ${pregunta.tipo || 'general'}`;

        const esCampoBooleano = (respuesta.es_correcta === true || respuesta.es_correcta === false);
        const esCorrecta = esCampoBooleano ? respuesta.es_correcta : IAController.evaluarRespuesta(respuesta, pregunta);

        return {
          pregunta_id: pregunta.id,
          categoria: categoria,
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

    const preguntas = (intento.respuestas || []).map((respuesta) => {
      const pregunta = respuesta.pregunta;
      const categoria = pregunta.etiquetas && pregunta.etiquetas.length > 0
        ? pregunta.etiquetas.map(e => e.nombre).join(', ')
        : `Preguntas de ${pregunta.tipo || 'general'}`;
      
      return {
        id: pregunta.id,
        categoria: categoria,
        tipo: pregunta.tipo,
        dificultad: pregunta.dificultad,
        texto: pregunta.texto,
      };
    });

    return { resultados, preguntas };
  }
  // ✅ Método estático
  static evaluarRespuesta(intentoRespuesta, pregunta) {
    // ✅ ACTUALIZADO: Usar los nombres de campo correctos
    

    switch (pregunta.tipo) {
      case "opcion_multiple":
      case "verdadero_falso": {
        // ✅ Usar opcionSeleccionadaId
        const opcionCorrecta = pregunta.opciones?.find(
          (o) => o.esCorrecta || o.es_correcta
        );
        return intentoRespuesta.opcionSeleccionadaId === opcionCorrecta?.id;
      }
      case "seleccion_multiple": {
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
      }
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

  // REINTENTAR CONVERSIÓN DE TESTS PENDIENTES
  async reintentarConversionPendiente(req, res) {
    try {
      const userId = req.user.id;
      const convertirTodos = req.query.todos === 'true'; // Parámetro opcional para convertir todos
      
      // Buscar tests en estado "generado" sin evaluacionId
      const whereClause = {
        estado: "generado",
        evaluacionId: null
      };
      
      // Si no se especifica "todos=true", solo buscar del usuario autenticado
      if (!convertirTodos) {
        whereClause.usuarioId = userId;
      }
      
      const testsPendientes = await TestAdaptativo.findAll({
        where: whereClause,
        include: [{
          model: AnalisisIA,
          as: "analisis",
          include: [{
            model: Intento,
            as: "intento",
            include: [{
              model: Evaluacion,
              as: "evaluacion",
              attributes: ["id", "curso_id"]
            }]
          }]
        }]
      });

      if (testsPendientes.length === 0) {
        return res.json({
          success: true,
          mensaje: "No hay tests pendientes de conversión",
          convertidos: 0
        });
      }

      

      const resultados = [];
      
      for (const test of testsPendientes) {
        try {
          
          
          // ✅ Permitir curso_id null (evaluaciones sin curso asignado)
          const cursoId = test.analisis?.intento?.evaluacion?.curso_id || null;
          
          // ✅ Usar el usuarioId del test, no del token
          const testUserId = test.usuarioId;
          
          const evaluacionAdaptativa = await this.convertirTestAEvaluacion(
            test,
            cursoId,
            testUserId
          );

          await test.update({
            evaluacionId: evaluacionAdaptativa.id,
            estado: "convertido_evaluacion"
          });

          
          resultados.push({ 
            testId: test.id, 
            evaluacionId: evaluacionAdaptativa.id,
            usuarioId: testUserId,
            success: true
          });

        } catch (error) {
          console.error(`❌ Error convirtiendo test ${test.id}:`, error);
          resultados.push({ 
            testId: test.id, 
            error: error.message,
            success: false
          });
        }
      }

      const exitosos = resultados.filter(r => r.success).length;

      return res.json({
        success: true,
        mensaje: `Se convirtieron ${exitosos} de ${testsPendientes.length} tests`,
        convertidos: exitosos,
        total: testsPendientes.length,
        detalles: resultados
      });

    } catch (error) {
      console.error("❌ Error en reintentarConversionPendiente:", error);
      return res.status(500).json({
        success: false,
        message: "Error al reintentar conversión",
        error: error.message
      });
    }
  }

  // 🔄 REGENERAR ANÁLISIS EN ERROR
  async regenerarAnalisisError(req, res) {
    try {
      const userId = req.user.id;
      
      
      
      // Buscar análisis en estado "error" del usuario
      const analisisError = await AnalisisIA.findAll({
        where: {
          usuarioId: userId,
          estado: "error"
        },
        include: [{
          model: Intento,
          as: "intento",
          include: [{
            model: Evaluacion,
            as: "evaluacion",
            attributes: ["id", "titulo"]
          }]
        }]
      });

      if (analisisError.length === 0) {
        return res.json({
          success: true,
          mensaje: "No hay análisis en error",
          regenerados: 0
        });
      }

      

      const resultados = [];
      
      for (const analisis of analisisError) {
        try {
          // Reintentar el análisis completo
          const resultado = await this.analizarYGenerarAutomatico(
            analisis.intentoId,
            userId
          );

          if (resultado && resultado.analisis && resultado.analisis.estado === 'completado') {
            
            resultados.push({ 
              analisisId: analisis.id,
              intentoId: analisis.intentoId,
              estado: 'completado',
              success: true
            });
          } else {
            
            resultados.push({ 
              analisisId: analisis.id,
              intentoId: analisis.intentoId,
              error: 'Falló al regenerar',
              success: false
            });
          }

        } catch (error) {
          console.error(`❌ Error regenerando análisis ${analisis.id}:`, error.message);
          resultados.push({ 
            analisisId: analisis.id,
            intentoId: analisis.intentoId,
            error: error.message,
            success: false
          });
        }
      }

      const exitosos = resultados.filter(r => r.success).length;

      return res.json({
        success: true,
        mensaje: `Se regeneraron ${exitosos} de ${analisisError.length} análisis`,
        regenerados: exitosos,
        total: analisisError.length,
        detalles: resultados
      });

    } catch (error) {
      console.error("❌ Error en regenerarAnalisisError:", error);
      return res.status(500).json({
        success: false,
        message: "Error al regenerar análisis",
        error: error.message
      });
    }
  }
}

export default new IAController();
