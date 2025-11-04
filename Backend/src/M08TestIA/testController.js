import TestAdaptativo from "./TestAdaptativo.js";
import PreguntaTest from "./PreguntaTest.js";
import RespuestaTest from "./RespuestaTest.js";
import groqService from "../M06IA/services/groqService.js";

/**
 * Iniciar un nuevo test adaptativo
 * El test genera preguntas personalizadas según el nivel y tema
 */
export const iniciarTest = async (req, res) => {
  try {
    const { tema, nivel_inicial = "intermedio", total_preguntas = 10 } = req.body;
    const userId = req.user.id;

    if (!tema) {
      return res.status(400).json({ 
        message: "El tema es obligatorio" 
      });
    }

    // Crear el test
    const test = await TestAdaptativo.create({
      userId,
      tema,
      nivel_inicial,
      total_preguntas,
      estado: "en_progreso"
    });

    // Generar primera pregunta con Groq
    const pregunta = await generarPreguntaAdaptativa(tema, nivel_inicial, 1);

    // Guardar la pregunta en la BD
    const preguntaGuardada = await PreguntaTest.create({
      testId: test.id,
      orden: 1,
      ...pregunta
    });

    return res.status(201).json({
      message: "Test iniciado correctamente",
      test: {
        id: test.id,
        tema: test.tema,
        nivel_inicial: test.nivel_inicial,
        total_preguntas: test.total_preguntas,
        pregunta_actual: preguntaGuardada
      }
    });

  } catch (error) {
    console.error("Error al iniciar test:", error);
    return res.status(500).json({ 
      message: "Error al iniciar el test", 
      error: error.message 
    });
  }
};

/**
 * Responder una pregunta del test
 * La IA evalúa la respuesta y genera la siguiente pregunta adaptada
 */
export const responderPregunta = async (req, res) => {
  try {
    const { testId } = req.params;
    const { preguntaId, respuesta_usuario } = req.body;

    if (!respuesta_usuario) {
      return res.status(400).json({ message: "La respuesta es obligatoria" });
    }

    // Obtener test y pregunta
    const test = await TestAdaptativo.findByPk(testId);
    const pregunta = await PreguntaTest.findByPk(preguntaId);

    if (!test || !pregunta) {
      return res.status(404).json({ message: "Test o pregunta no encontrada" });
    }

    if (test.userId !== req.user.id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    // Evaluar respuesta
    const { es_correcta, puntos_obtenidos } = evaluarRespuesta(
      respuesta_usuario, 
      pregunta.respuesta_correcta, 
      pregunta.tipo,
      pregunta.puntos
    );

    // Guardar respuesta
    await RespuestaTest.create({
      preguntaId: pregunta.id,
      testId: test.id,
      respuesta_usuario,
      es_correcta,
      puntos_obtenidos,
      tiempo_respuesta_segundos: req.body.tiempo_respuesta || null
    });

    // Actualizar contadores del test
    const preguntas_respondidas = test.preguntas_respondidas + 1;
    const respuestas_correctas = test.respuestas_correctas + (es_correcta ? 1 : 0);

    await test.update({
      preguntas_respondidas,
      respuestas_correctas
    });

    // Verificar si el test ha terminado
    if (preguntas_respondidas >= test.total_preguntas) {
      return await finalizarTest(test, res);
    }

    // Calcular nuevo nivel de dificultad basado en rendimiento
    const porcentaje_aciertos = (respuestas_correctas / preguntas_respondidas) * 100;
    const nuevo_nivel = calcularNivelAdaptativo(porcentaje_aciertos, test.nivel_inicial);

    // Generar siguiente pregunta adaptada
    const siguiente_pregunta = await generarPreguntaAdaptativa(
      test.tema, 
      nuevo_nivel, 
      preguntas_respondidas + 1
    );

    const siguiente_guardada = await PreguntaTest.create({
      testId: test.id,
      orden: preguntas_respondidas + 1,
      ...siguiente_pregunta
    });

    return res.json({
      message: es_correcta ? "¡Respuesta correcta!" : "Respuesta incorrecta",
      resultado: {
        es_correcta,
        puntos_obtenidos,
        explicacion: pregunta.explicacion
      },
      progreso: {
        preguntas_respondidas,
        total_preguntas: test.total_preguntas,
        respuestas_correctas,
        porcentaje_aciertos: porcentaje_aciertos.toFixed(2)
      },
      siguiente_pregunta: siguiente_guardada
    });

  } catch (error) {
    console.error("Error al responder pregunta:", error);
    return res.status(500).json({ 
      message: "Error al procesar respuesta", 
      error: error.message 
    });
  }
};

/**
 * Obtener resultados de un test completado
 */
export const obtenerResultados = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await TestAdaptativo.findByPk(testId, {
      include: [
        {
          model: PreguntaTest,
          as: "preguntas",
          include: [
            {
              model: RespuestaTest,
              as: "respuesta"
            }
          ]
        }
      ]
    });

    if (!test) {
      return res.status(404).json({ message: "Test no encontrado" });
    }

    if (test.userId !== req.user.id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    return res.json({
      test: {
        id: test.id,
        tema: test.tema,
        nivel_inicial: test.nivel_inicial,
        nivel_alcanzado: test.nivel_alcanzado,
        puntaje_final: test.puntaje_final,
        respuestas_correctas: test.respuestas_correctas,
        total_preguntas: test.total_preguntas,
        tiempo_total: test.tiempo_total_segundos,
        areas_fuertes: test.areas_fuertes,
        areas_debiles: test.areas_debiles,
        recomendaciones: test.recomendaciones,
        estado: test.estado,
        iniciado_en: test.iniciado_en,
        finalizado_en: test.finalizado_en
      },
      preguntas: test.preguntas
    });

  } catch (error) {
    console.error("Error al obtener resultados:", error);
    return res.status(500).json({ 
      message: "Error al obtener resultados", 
      error: error.message 
    });
  }
};

/**
 * Obtener historial de tests del estudiante
 */
export const obtenerHistorialTests = async (req, res) => {
  try {
    const userId = req.user.id;

    const tests = await TestAdaptativo.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      attributes: [
        "id", "tema", "nivel_inicial", "nivel_alcanzado", 
        "puntaje_final", "respuestas_correctas", "total_preguntas",
        "estado", "iniciado_en", "finalizado_en"
      ]
    });

    return res.json({
      total: tests.length,
      tests
    });

  } catch (error) {
    console.error("Error al obtener historial:", error);
    return res.status(500).json({ 
      message: "Error al obtener historial", 
      error: error.message 
    });
  }
};

// ========== FUNCIONES AUXILIARES ==========

/**
 * Genera una pregunta adaptativa usando Groq AI
 */
async function generarPreguntaAdaptativa(tema, nivel, orden) {
  const prompt = `Eres un experto en evaluación educativa. Genera UNA pregunta de opción múltiple sobre "${tema}" de nivel ${nivel}.

Formato JSON estricto:
{
  "enunciado": "pregunta clara y concisa",
  "tipo": "opcion_multiple",
  "opciones": [
    {"id": "A", "texto": "opción 1", "correcta": false},
    {"id": "B", "texto": "opción 2", "correcta": true},
    {"id": "C", "texto": "opción 3", "correcta": false},
    {"id": "D", "texto": "opción 4", "correcta": false}
  ],
  "respuesta_correcta": "B",
  "explicacion": "explicación detallada de por qué es correcta",
  "nivel_dificultad": "${nivel}",
  "area_conocimiento": "área específica del tema",
  "tiempo_estimado_segundos": 60,
  "puntos": 10
}

IMPORTANTE: Responde SOLO con el JSON, sin texto adicional.`;

  const respuesta = await groqService.generateCompletion(prompt, {
    temperature: 0.7,
    max_tokens: 800
  });

  try {
    const preguntaJSON = JSON.parse(respuesta);
    return preguntaJSON;
  } catch (error) {
    console.error("Error al parsear respuesta de Groq:", error);
    // Fallback: pregunta básica
    return {
      enunciado: `Pregunta ${orden} sobre ${tema}`,
      tipo: "opcion_multiple",
      opciones: [
        { id: "A", texto: "Opción A", correcta: false },
        { id: "B", texto: "Opción B", correcta: true },
        { id: "C", texto: "Opción C", correcta: false },
        { id: "D", texto: "Opción D", correcta: false }
      ],
      respuesta_correcta: "B",
      explicacion: "Esta es la respuesta correcta.",
      nivel_dificultad: nivel,
      area_conocimiento: tema,
      tiempo_estimado_segundos: 60,
      puntos: 10
    };
  }
}

/**
 * Evalúa si la respuesta del usuario es correcta
 */
function evaluarRespuesta(respuesta_usuario, respuesta_correcta, tipo, puntos_max) {
  let es_correcta = false;

  if (tipo === "opcion_multiple" || tipo === "verdadero_falso") {
    es_correcta = respuesta_usuario.trim().toUpperCase() === respuesta_correcta.trim().toUpperCase();
  } else if (tipo === "completar" || tipo === "respuesta_corta") {
    // Comparación más flexible para texto
    const respuestaLimpia = respuesta_usuario.trim().toLowerCase();
    const correctaLimpia = respuesta_correcta.trim().toLowerCase();
    es_correcta = respuestaLimpia === correctaLimpia || 
                  respuestaLimpia.includes(correctaLimpia) ||
                  correctaLimpia.includes(respuestaLimpia);
  }

  const puntos_obtenidos = es_correcta ? puntos_max : 0;

  return { es_correcta, puntos_obtenidos };
}

/**
 * Calcula el nivel adaptativo basado en el rendimiento
 */
function calcularNivelAdaptativo(porcentaje_aciertos, nivel_actual) {
  if (porcentaje_aciertos >= 80) {
    // Rendimiento alto -> subir nivel
    if (nivel_actual === "basico") return "intermedio";
    if (nivel_actual === "intermedio") return "avanzado";
    return "avanzado";
  } else if (porcentaje_aciertos < 50) {
    // Rendimiento bajo -> bajar nivel
    if (nivel_actual === "avanzado") return "intermedio";
    if (nivel_actual === "intermedio") return "basico";
    return "basico";
  }
  // Rendimiento medio -> mantener nivel
  return nivel_actual;
}

/**
 * Finaliza el test y genera análisis con IA
 */
async function finalizarTest(test, res) {
  // Calcular puntaje final
  const respuestas = await RespuestaTest.findAll({
    where: { testId: test.id }
  });

  const puntaje_total = respuestas.reduce((sum, r) => sum + r.puntos_obtenidos, 0);
  const puntaje_maximo = test.total_preguntas * 10;
  const puntaje_final = (puntaje_total / puntaje_maximo) * 100;

  // Analizar áreas fuertes y débiles con IA
  const preguntas = await PreguntaTest.findAll({
    where: { testId: test.id },
    include: [{ model: RespuestaTest, as: "respuesta" }]
  });

  const areas_correctas = preguntas
    .filter(p => p.respuesta?.es_correcta)
    .map(p => p.area_conocimiento);

  const areas_incorrectas = preguntas
    .filter(p => !p.respuesta?.es_correcta)
    .map(p => p.area_conocimiento);

  const areas_fuertes = [...new Set(areas_correctas)];
  const areas_debiles = [...new Set(areas_incorrectas)];

  // Generar recomendaciones con Groq
  const prompt_recomendaciones = `Analiza este test educativo y genera recomendaciones personalizadas:

Tema: ${test.tema}
Nivel inicial: ${test.nivel_inicial}
Puntaje: ${puntaje_final.toFixed(2)}%
Áreas fuertes: ${areas_fuertes.join(", ") || "ninguna"}
Áreas débiles: ${areas_debiles.join(", ") || "ninguna"}

Genera recomendaciones específicas en español (máximo 500 caracteres):`;

  const recomendaciones = await groqService.generateCompletion(prompt_recomendaciones, {
    temperature: 0.8,
    max_tokens: 300
  });

  // Calcular nivel alcanzado
  const nivel_alcanzado = puntaje_final >= 80 ? "avanzado" : 
                          puntaje_final >= 50 ? "intermedio" : 
                          "basico";

  // Actualizar test
  await test.update({
    estado: "completado",
    puntaje_final,
    nivel_alcanzado,
    areas_fuertes,
    areas_debiles,
    recomendaciones,
    finalizado_en: new Date()
  });

  return res.json({
    message: "Test completado",
    resultados: {
      puntaje_final: puntaje_final.toFixed(2),
      respuestas_correctas: test.respuestas_correctas,
      total_preguntas: test.total_preguntas,
      nivel_alcanzado,
      areas_fuertes,
      areas_debiles,
      recomendaciones
    },
    test_id: test.id
  });
}
