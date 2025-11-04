import axios from "axios";

class GroqService {
  constructor() {
    // Trim para evitar espacios invisibles del .env
    this.apiKey = process.env.GROQ_API_KEY?.trim();
    this.baseURL = "https://api.groq.com/openai/v1/chat/completions";
    this.model = "llama-3.3-70b-versatile";
    
    // 🔍 LOG PARA DEBUG
    
    console.log('   - API Key presente:', !!this.apiKey);
    console.log('   - API Key (primeros 15 chars):', this.apiKey?.substring(0, 15) + '...');
    console.log('   - Longitud:', this.apiKey?.length);
    
    if (!this.apiKey) {
      console.warn("⚠️ GROQ_API_KEY no configurada - los servicios de IA no funcionarán");
    }
  }

  async generateCompletion(prompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('GROQ_API_KEY no configurada en el archivo .env');
    }

    try {
      const response = await axios.post(
        this.baseURL,
        {
          model: this.model,
          messages: [
            {
              role: "system",
              content: "Eres un asistente educativo. Siempre respondes con JSON válido, sin texto adicional antes o después del JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: options.temperature || 0.5,
          max_tokens: options.maxTokens || 3000,
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
      const status = error.response?.status;
      const apiMsg = error.response?.data?.error?.message || error.response?.data || error.message;
      
      console.error('\n❌ ERROR EN GROQ API:');
      console.error('   Status HTTP:', status);
      console.error('   Mensaje:', apiMsg);
      console.error('   API Key (primeros 15 chars):', this.apiKey?.substring(0, 15) + '...');
      console.error('   Longitud de la key:', this.apiKey?.length);
      
      // Propagar error con información útil
      const msg = typeof apiMsg === 'string' ? apiMsg : JSON.stringify(apiMsg);
      const statusText = status ? ` (HTTP ${status})` : '';
      throw new Error('Error al comunicarse con el servicio de IA' + statusText + ': ' + msg);
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

    // Agrupar por categoría para mostrar contexto
    const categorias = {};
    resultados.respuestas?.forEach(r => {
      const cat = r.categoria || 'General';
      if (!categorias[cat]) {
        categorias[cat] = { correctas: 0, total: 0 };
      }
      categorias[cat].total++;
      if (r.es_correcta) categorias[cat].correctas++;
    });

    const resumenCategorias = Object.entries(categorias)
      .map(([nombre, datos]) => `${nombre}: ${datos.correctas}/${datos.total} correctas`)
      .join('\n');

    const detalleRespuestas = resultados.respuestas?.slice(0, 15).map((r, i) => 
      `${i + 1}. ${r.categoria} - ${r.tipo} (dif: ${r.dificultad}): ${r.es_correcta ? '✓' : '✗'}`
    ).join('\n') || 'Sin datos';

    return `Analiza resultados de evaluación de programación.

PUNTAJE: ${resultados.puntuacion || respuestasCorrectas}/${totalPreguntas} (${porcentajeGeneral}%)

CATEGORÍAS:
${resumenCategorias}

DETALLE RESPUESTAS:
${detalleRespuestas}

INSTRUCCIONES:
1. Agrupa por categoría (usa nombres específicos de las categorías mostradas arriba)
2. Identifica 3 DEBILIDADES específicas (categorías con <60% o temas donde falló)
3. Identifica 2 FORTALEZAS (categorías con ≥75%)
4. Da 5 recomendaciones CONCRETAS (no genéricas como "practicar más")
5. Estima tiempo de estudio realista

Responde SOLO JSON válido:
{
  "puntuacion_global": ${resultados.puntuacion || respuestasCorrectas},
  "porcentaje_total": ${porcentajeGeneral},
  "categorias": [
    {
      "nombre": "nombre exacto de categoría",
      "correctas": 0,
      "totales": 0,
      "porcentaje": 0,
      "nivel": "fuerte"
    }
  ],
  "debilidades": ["tema específico 1", "tema específico 2", "tema específico 3"],
  "fortalezas": ["tema específico 1", "tema específico 2"],
  "recomendaciones": ["acción concreta 1", "acción concreta 2", "acción concreta 3", "acción concreta 4", "acción concreta 5"],
  "tiempo_estudio_sugerido": "X horas/días específicos"
}`;
  }

  construirPromptTestAdaptativo(analisis) {
    // Parsear datos si vienen como JSON strings
    let debilidades = analisis.debilidades;
    let fortalezas = analisis.fortalezas;
    
    if (typeof debilidades === 'string') {
      try {
        debilidades = JSON.parse(debilidades);
      } catch (e) {
        debilidades = [];
      }
    }
    
    if (typeof fortalezas === 'string') {
      try {
        fortalezas = JSON.parse(fortalezas);
      } catch (e) {
        fortalezas = [];
      }
    }
    
    debilidades = Array.isArray(debilidades) ? debilidades.slice(0, 3) : [];
    fortalezas = Array.isArray(fortalezas) ? fortalezas.slice(0, 2) : [];
    
    const debilidadesText = debilidades.length > 0 ? debilidades.join(', ') : 'Conceptos básicos de programación';
    const fortalezasText = fortalezas.length > 0 ? fortalezas.join(', ') : 'Ninguna identificada';
    
    return `Genera un test de 10 preguntas de programación.

DEBILIDADES DEL ESTUDIANTE: ${debilidadesText}
FORTALEZAS DEL ESTUDIANTE: ${fortalezasText}

Crea 10 preguntas con esta distribución:
- 5 preguntas fáciles (dificultad 1-3) sobre las DEBILIDADES
- 2 preguntas medias (dificultad 3) mezclando temas
- 3 preguntas difíciles (dificultad 4-5) sobre las FORTALEZAS

Cada pregunta debe tener:
- Una pregunta clara
- 4 opciones (solo 1 correcta)
- Una explicación de la respuesta correcta

Responde con este JSON (sin texto adicional):
{
  "preguntas": [
    {
      "categoria": "tema específico",
      "tipo": "refuerzo",
      "dificultad": 2,
      "pregunta": "texto de la pregunta",
      "codigo": null,
      "opciones": [
        {"texto": "opción A", "es_correcta": true},
        {"texto": "opción B", "es_correcta": false},
        {"texto": "opción C", "es_correcta": false},
        {"texto": "opción D", "es_correcta": false}
      ],
      "explicacion": "por qué la respuesta A es correcta"
    }
  ],
  "enfoque": {
    "areas_reforzar": ["${debilidades[0] || 'conceptos básicos'}"],
    "areas_desafiar": ["${fortalezas[0] || 'lógica avanzada'}"]
  }
}`;
  }
}

export default new GroqService();
