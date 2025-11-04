import axios from "axios";

class GroqService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.baseURL = "https://api.groq.com/openai/v1/chat/completions";
    this.model = "llama-3.3-70b-versatile"; 
  }

  async generateCompletion(prompt, options = {}) {
    try {
      const response = await axios.post(
        this.baseURL,
        {
          model: this.model,
          messages: [
            {
              role: "system",
              content:
                "Eres un asistente educativo experto en programación y pedagogía adaptativa.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2000,
          response_format: { type: "json_object" },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error(
        "Error en Groq API:",
        error.response?.data || error.message
      );
      throw new Error("Error al comunicarse con el servicio de IA");
    }
  }

  async analizarDiagnostico(resultados, preguntas) {
    const prompt = this.construirPromptAnalisis(resultados, preguntas);
    return await this.generateCompletion(prompt);
  }

  async generarTestAdaptativo(analisis) {
    const prompt = this.construirPromptTestAdaptativo(analisis);
    return await this.generateCompletion(prompt);
  }

  construirPromptAnalisis(resultados, preguntas) {
    const totalPreguntas = resultados.total_preguntas || 0;
    const respuestasCorrectas = resultados.respuestas?.filter(r => r.es_correcta).length || 0;
    const porcentajeGeneral = totalPreguntas > 0 ? ((respuestasCorrectas / totalPreguntas) * 100).toFixed(2) : 0;

    return `Eres un experto pedagogo especializado en educación adaptativa. Analiza estos resultados de evaluación y genera un análisis profundo.

📊 RESULTADOS DEL ESTUDIANTE:
- Puntaje obtenido: ${resultados.puntuacion || respuestasCorrectas}
- Total de preguntas: ${totalPreguntas}
- Porcentaje general: ${porcentajeGeneral}%

📝 DETALLE DE RESPUESTAS:
${resultados.respuestas?.map((r, i) => `
${i + 1}. Pregunta (${r.tipo} - ${r.dificultad}):
   - Categoría: ${r.categoria || 'General'}
   - Resultado: ${r.es_correcta ? '✅ CORRECTA' : '❌ INCORRECTA'}
`).join('')}

🎯 TU TAREA:
1. **Agrupa las preguntas por categoría** y calcula el % de acierto en cada una
2. **Identifica las TOP 3 DEBILIDADES** (categorías con <60% acierto o temas donde falló)
3. **Identifica las TOP 2 FORTALEZAS** (categorías con ≥75% acierto)
4. **Genera 5 recomendaciones ESPECÍFICAS** de estudio (no genéricas)
5. **Estima tiempo de estudio** necesario para mejorar (ej: "2-3 horas diarias por 1 semana")

⚠️ IMPORTANTE:
- Sé específico con los temas (ej: "Bucles while" en lugar de "Control de flujo")
- Las recomendaciones deben ser accionables
- Prioriza las debilidades más críticas

📤 RESPONDE SOLO EN ESTE FORMATO JSON (sin markdown):
{
  "puntuacion_global": ${resultados.puntuacion || respuestasCorrectas},
  "porcentaje_total": ${porcentajeGeneral},
  "categorias": [
    {
      "nombre": "nombre de la categoría",
      "correctas": número de respuestas correctas,
      "totales": número total de preguntas,
      "porcentaje": porcentaje de acierto,
      "nivel": "fuerte" | "medio" | "débil"
    }
  ],
  "debilidades": [
    "Tema específico 1 donde tiene problemas",
    "Tema específico 2 donde tiene problemas",
    "Tema específico 3 donde tiene problemas"
  ],
  "fortalezas": [
    "Tema específico 1 que domina bien",
    "Tema específico 2 que domina bien"
  ],
  "recomendaciones": [
    "Recomendación específica 1",
    "Recomendación específica 2",
    "Recomendación específica 3",
    "Recomendación específica 4",
    "Recomendación específica 5"
  ],
  "tiempo_estudio_sugerido": "X horas/días estimados para mejorar"
}`;
  }

  construirPromptTestAdaptativo(analisis) {
    const debilidadesStr = analisis.debilidades?.join(', ') || 'No detectadas';
    const fortalezasStr = analisis.fortalezas?.join(', ') || 'No detectadas';
    
    return `Eres un profesor experto creando un test PERSONALIZADO para un estudiante específico.

📊 PERFIL DEL ESTUDIANTE:
✅ FORTALEZAS:
${analisis.fortalezas?.map(f => `   - ${f}`).join('\n') || '   - No detectadas'}

❌ DEBILIDADES:
${analisis.debilidades?.map(d => `   - ${d}`).join('\n') || '   - No detectadas'}

📈 RENDIMIENTO POR CATEGORÍAS:
${analisis.categorias?.map(cat => 
  `   - ${cat.nombre}: ${cat.porcentaje}% (${cat.nivel})`
).join('\n') || '   - Sin datos'}

🎯 EVALUACIÓN DE ORIGEN: "${analisis.evaluacion_original}"

🎨 GENERA UN TEST ADAPTATIVO CON ESTAS REGLAS:

**ESTRUCTURA (10 preguntas TOTAL):**

1. **REFUERZO (4-5 preguntas):**
   - Enfocadas en las DEBILIDADES del estudiante
   - Dificultad: Básica (1-2) o Media (3)
   - Objetivo: Que pueda responderlas correctamente y ganar confianza
   - Incluye explicación detallada de por qué la respuesta es correcta

2. **PRÁCTICA (2-3 preguntas):**
   - Temas mixtos (debilidades + fortalezas)
   - Dificultad: Media (3)
   - Objetivo: Consolidar conocimientos

3. **DESAFÍO (2-3 preguntas):**
   - Enfocadas en las FORTALEZAS del estudiante
   - Dificultad: Alta (4-5)
   - Objetivo: Estimular y extender sus capacidades

**FORMATO DE CADA PREGUNTA:**
- Pregunta clara y específica
- 4 opciones de respuesta (solo 1 correcta)
- Las opciones incorrectas deben ser plausibles (no obviamente falsas)
- Explicación pedagógica de la respuesta correcta
- Si aplica, incluye código de ejemplo

⚠️ MUY IMPORTANTE:
- NO repitas preguntas de la evaluación original
- Sé específico con los temas (usa los nombres exactos de las debilidades)
- Las preguntas deben ser PROGRESIVAS (de fácil a difícil)
- Cada explicación debe enseñar algo nuevo

📤 RESPONDE SOLO EN ESTE FORMATO JSON (sin markdown):
{
  "preguntas": [
    {
      "categoria": "categoría específica del tema",
      "tipo": "refuerzo" | "practica" | "desafio",
      "dificultad": 1 | 2 | 3 | 4 | 5,
      "pregunta": "Texto de la pregunta clara y concisa",
      "codigo": "código de ejemplo si aplica, o null",
      "opciones": [
        { "texto": "Opción A", "es_correcta": true },
        { "texto": "Opción B", "es_correcta": false },
        { "texto": "Opción C", "es_correcta": false },
        { "texto": "Opción D", "es_correcta": false }
      ],
      "explicacion": "Por qué la respuesta correcta lo es + concepto que refuerza"
    }
  ],
  "enfoque": {
    "areas_reforzar": ["debilidad 1", "debilidad 2", "..."],
    "areas_desafiar": ["fortaleza 1", "fortaleza 2"]
  }
}`;
  }
}

export default new GroqService();
