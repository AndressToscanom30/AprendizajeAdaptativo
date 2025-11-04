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
        categorias[cat] = { correctas: 0, total: 0, incorrectas: [] };
      }
      categorias[cat].total++;
      if (r.es_correcta) {
        categorias[cat].correctas++;
      } else {
        categorias[cat].incorrectas.push(r.tipo);
      }
    });

    const resumenCategorias = Object.entries(categorias)
      .map(([nombre, datos]) => {
        const pct = ((datos.correctas / datos.total) * 100).toFixed(0);
        return `${nombre}: ${datos.correctas}/${datos.total} (${pct}%)`;
      })
      .join('\n');

    const detalleRespuestas = resultados.respuestas?.slice(0, 15).map((r, i) => 
      `${i + 1}. [${r.categoria}] ${r.tipo} (dif: ${r.dificultad}): ${r.es_correcta ? '✓ CORRECTA' : '✗ INCORRECTA'}`
    ).join('\n') || 'Sin datos';

    return `Analiza estos resultados y genera feedback ESPECÍFICO basado en las CATEGORÍAS reales.

PUNTAJE: ${resultados.puntuacion || respuestasCorrectas}/${totalPreguntas} (${porcentajeGeneral}%)

RENDIMIENTO POR CATEGORÍA:
${resumenCategorias}

DETALLE DE CADA RESPUESTA:
${detalleRespuestas}

INSTRUCCIONES CRÍTICAS:
1. USA LAS CATEGORÍAS EXACTAS mostradas arriba (no inventes categorías nuevas)
2. Para DEBILIDADES: Menciona las categorías donde el estudiante falló (< 60%)
3. Para FORTALEZAS: Menciona las categorías donde el estudiante acertó (≥ 75%)
4. Si una categoría aparece en los datos, ÚSALA en tu análisis
5. NO menciones "Preguntas de código" o tipos de pregunta - menciona LOS TEMAS

EJEMPLO CORRECTO:
Si las categorías son "Console.log, Impresión" y "Bucles, Iteración":
- Debilidad: "Dificultad con el uso de console.log para depuración"
- Fortaleza: "Buen manejo de bucles for e iteración"

EJEMPLO INCORRECTO:
- ❌ "Preguntas de código"
- ❌ "Preguntas difíciles"
- ❌ "Opción múltiple"

Responde SOLO JSON válido:
{
  "puntuacion_global": ${resultados.puntuacion || respuestasCorrectas},
  "porcentaje_total": ${porcentajeGeneral},
  "categorias": [
    {
      "nombre": "nombre EXACTO de categoría del listado",
      "correctas": 0,
      "totales": 0,
      "porcentaje": 0,
      "nivel": "fuerte"
    }
  ],
  "debilidades": [
    "Menciona la CATEGORÍA específica y qué debe mejorar de ese tema",
    "Otra CATEGORÍA donde falló y qué practicar",
    "Tercera CATEGORÍA con bajo rendimiento"
  ],
  "fortalezas": [
    "CATEGORÍA donde tuvo buen rendimiento y qué domina",
    "Otra CATEGORÍA con alto porcentaje de aciertos"
  ],
  "recomendaciones": [
    "Acción específica relacionada con las categorías débiles",
    "Ejercicio práctico para la categoría con más errores",
    "Recurso para estudiar la categoría problemática",
    "Práctica adicional en categoría intermedia",
    "Refuerzo de conceptos en categoría débil"
  ],
  "tiempo_estudio_sugerido": "X horas realistas según las debilidades detectadas"
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
    
    return `Genera un test de 10 preguntas VARIADAS de programación.

DEBILIDADES: ${debilidadesText}
FORTALEZAS: ${fortalezasText}

DISTRIBUCIÓN (10 preguntas):
- 5 preguntas FÁCILES (dificultad 1-3) sobre DEBILIDADES
- 2 preguntas MEDIAS (dificultad 3) mixtas
- 3 preguntas DIFÍCILES (dificultad 4-5) sobre FORTALEZAS

TIPOS DE PREGUNTAS (USA SOLO ESTOS VALORES):
1. "opcion_multiple" - Pregunta con 4 opciones, solo 1 correcta
2. "codigo" - Mostrar código y preguntar qué hace o encontrar error (4 opciones)
3. "verdadero_falso" - Afirmación verdadera o falsa (2 opciones: "Verdadero", "Falso")
4. "completar_blanco" - Código incompleto, elegir qué va en el espacio (4 opciones)

IMPORTANTE:
- USA AL MENOS 3 TIPOS DIFERENTES en las 10 preguntas
- INCLUYE código real en preguntas tipo "codigo" y "completar_blanco"
- El código debe estar en el campo "codigo" (null para otros tipos)
- El campo "tipo_pregunta" DEBE ser uno de: opcion_multiple, codigo, verdadero_falso, completar_blanco

Responde SOLO JSON válido:
{
  "preguntas": [
    {
      "categoria": "tema específico",
      "tipo_pregunta": "codigo",
      "tipo": "refuerzo",
      "dificultad": 2,
      "pregunta": "¿Qué imprime este código?",
      "codigo": "for(let i=0; i<3; i++) { console.log(i); }",
      "opciones": [
        {"texto": "0 1 2", "es_correcta": true},
        {"texto": "1 2 3", "es_correcta": false},
        {"texto": "0 0 0", "es_correcta": false},
        {"texto": "Error de sintaxis", "es_correcta": false}
      ],
      "explicacion": "El bucle imprime i desde 0 hasta 2"
    },
    {
      "categoria": "tema específico",
      "tipo_pregunta": "verdadero_falso",
      "tipo": "refuerzo",
      "dificultad": 1,
      "pregunta": "En JavaScript, 'var' tiene alcance de bloque",
      "codigo": null,
      "opciones": [
        {"texto": "Verdadero", "es_correcta": false},
        {"texto": "Falso", "es_correcta": true}
      ],
      "explicacion": "var tiene alcance de función, no de bloque. let y const sí tienen alcance de bloque"
    }
  ],
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
