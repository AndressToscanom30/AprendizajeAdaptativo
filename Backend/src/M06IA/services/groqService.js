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
    return `Analiza los siguientes resultados de un test diagnóstico de programación.

DATOS DEL TEST:
${JSON.stringify({ resultados, preguntas }, null, 2)}

INSTRUCCIONES:
1. Calcula el porcentaje de acierto por categoría
2. Identifica las 3 principales debilidades (temas con <60% acierto)
3. Identifica las 2 principales fortalezas (temas con >75% acierto)
4. Genera recomendaciones específicas de estudio

RESPONDE EN FORMATO JSON:
{
  "puntuacion_global": number,
  "porcentaje_total": number,
  "categorias": [
    {
      "nombre": "string",
      "correctas": number,
      "totales": number,
      "porcentaje": number,
      "nivel": "fuerte|medio|débil"
    }
  ],
  "debilidades": ["string"],
  "fortalezas": ["string"],
  "recomendaciones": ["string"],
  "tiempo_estudio_sugerido": "string"
}`;
  }

  construirPromptTestAdaptativo(analisis) {
    return `Genera un test adaptativo de programación basado en este análisis:

ANÁLISIS PREVIO:
${JSON.stringify(analisis, null, 2)}

INSTRUCCIONES:
1. Crea 10 preguntas NUEVAS (no repetir del test base)
2. Para cada DEBILIDAD: 2 preguntas de refuerzo (nivel básico-intermedio)
3. Para cada FORTALEZA: 2 preguntas desafiantes (nivel avanzado)
4. Cada pregunta debe tener 4 opciones con una correcta

RESPONDE EN FORMATO JSON:
{
  "preguntas": [
    {
      "categoria": "string",
      "tipo": "refuerzo|practica|desafio",
      "dificultad": 1-5,
      "pregunta": "string",
      "codigo": "string o null",
      "opciones": [
        { "texto": "string", "es_correcta": boolean }
      ],
      "explicacion": "string"
    }
  ],
  "enfoque": {
    "areas_reforzar": ["string"],
    "areas_desafiar": ["string"]
  }
}`;
  }
}

export default new GroqService();
