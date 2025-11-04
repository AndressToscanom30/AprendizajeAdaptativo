import axios from "axios";

/**
 * Servicio para interactuar con la API de Groq para análisis educativo con IA
 */
class GroqService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY?.trim();
    this.baseURL = "https://api.groq.com/openai/v1/chat/completions";
    this.model = "llama-3.3-70b-versatile";
    this.defaultTemperature = 0.5;
    this.defaultMaxTokens = 3000;
    
    if (!this.apiKey) {
      console.warn("⚠️  GROQ_API_KEY no configurada - los servicios de IA no funcionarán");
    }
  }

  /**
   * Genera una respuesta de IA usando el modelo de Groq
   * @param {string} prompt - El prompt para la IA
   * @param {Object} options - Opciones adicionales (temperature, maxTokens)
   * @returns {Promise<Object>} Respuesta parseada como JSON
   */
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
              content: "Eres un asistente educativo experto en análisis de aprendizaje. Respondes ÚNICAMENTE con JSON válido, sin texto adicional.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: options.temperature ?? this.defaultTemperature,
          max_tokens: options.maxTokens ?? this.defaultMaxTokens,
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
      this._handleError(error);
    }
  }

  /**
   * Maneja errores de la API de Groq
   * @private
   */
  _handleError(error) {
    const status = error.response?.status;
    const apiMsg = error.response?.data?.error?.message || error.response?.data || error.message;
    
    console.error('\n❌ ERROR EN GROQ API:');
    console.error('   Status HTTP:', status);
    console.error('   Mensaje:', apiMsg);
    
    const msg = typeof apiMsg === 'string' ? apiMsg : JSON.stringify(apiMsg);
    const statusText = status ? ` (HTTP ${status})` : '';
    throw new Error(`Error al comunicarse con el servicio de IA${statusText}: ${msg}`);
  }

  /**
   * Analiza los resultados de un diagnóstico/evaluación
   */
  async analizarDiagnostico(resultados, preguntas) {
    const prompt = this.construirPromptAnalisis(resultados, preguntas);
    return await this.generateCompletion(prompt);
  }

  /**
   * Genera un test adaptativo basado en el análisis previo
   */
  async generarTestAdaptativo(analisis) {
    const prompt = this.construirPromptTestAdaptativo(analisis);
    const resultado = await this.generateCompletion(prompt);
    
    // DEBUG: Ver qué devuelve la IA
    console.log('🔍 DEBUG - Test generado por IA:');
    console.log('   Número de preguntas:', resultado.preguntas?.length);
    resultado.preguntas?.forEach((p, i) => {
      console.log(`   Pregunta ${i + 1}:`, {
        tipo: p.tipo_pregunta,
        tiene_codigo: !!p.codigo,
        codigo_length: p.codigo?.length || 0,
        tiene_opciones: !!p.opciones,
        num_opciones: p.opciones?.length || 0
      });
    });
    
    return resultado;
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
    
    return `Genera un test de 10 preguntas VARIADAS de programación adaptadas al nivel del estudiante.

DEBILIDADES DETECTADAS: ${debilidadesText}
FORTALEZAS DETECTADAS: ${fortalezasText}

DISTRIBUCIÓN OBLIGATORIA (10 preguntas totales):
- 5 preguntas FÁCILES (dificultad 1-3) enfocadas en DEBILIDADES para reforzar
- 2 preguntas MEDIAS (dificultad 3-4) mixtas 
- 3 preguntas DIFÍCILES (dificultad 4-5) sobre FORTALEZAS para desafiar

TIPOS DE PREGUNTAS VÁLIDOS (USA EXACTAMENTE ESTOS NOMBRES):
1. "opcion_multiple" - Pregunta teórica con 4 opciones, una correcta
   * Campo "codigo": DEBE SER null
   * Campo "opciones": Array de 4 objetos {texto, es_correcta}
   
2. "codigo" - Mostrar código y preguntar qué hace/imprime/retorna
   * Campo "codigo": OBLIGATORIO - String con el código a MOSTRAR al estudiante
   * Campo "opciones": Array de 4 objetos {texto, es_correcta} con posibles respuestas
   * La pregunta debe ser sobre ANALIZAR el código mostrado
   
3. "verdadero_falso" - Afirmación que es verdadera o falsa
   * Campo "codigo": DEBE SER null
   * Campo "opciones": Array de EXACTAMENTE 2 objetos: [{"texto": "Verdadero", ...}, {"texto": "Falso", ...}]
   
4. "respuesta_corta" - Pregunta de completar o respuesta breve
   * Campo "codigo": PUEDE tener código de referencia SI la pregunta es sobre código, null si es teórica
   * Campo "opciones": DEBE SER null
   * Campo "respuesta_esperada": String con la respuesta correcta esperada
   * Pregunta clara que requiere respuesta de 1-3 palabras

REGLAS CRÍTICAS DE FORMATO:
✓ OBLIGATORIO: Usa AL MENOS 3 tipos diferentes de pregunta en las 10
✓ OBLIGATORIO: En preguntas tipo "codigo", el campo "codigo" NUNCA debe ser null
✓ OBLIGATORIO: En preguntas tipo "respuesta_corta", incluir campo "respuesta_esperada"
✓ OBLIGATORIO: Campo "tipo_pregunta" debe ser EXACTAMENTE uno de los 4 tipos listados arriba
✓ OBLIGATORIO: El código en campo "codigo" debe ser sintácticamente correcto y ejecutable
✓ IMPORTANTE: Varía la dificultad según lo especificado (fácil, media, difícil)

RESPONDE ÚNICAMENTE CON JSON VÁLIDO (sin comentarios, sin texto adicional):
{
  "preguntas": [
    {
      "categoria": "Variables y Tipos de Datos",
      "tipo_pregunta": "codigo",
      "tipo": "refuerzo",
      "dificultad": 2,
      "pregunta": "¿Qué valor se imprime en la consola al ejecutar este código?",
      "codigo": "let x = 5;
let y = x + 3;
console.log(y);",
      "opciones": [
        {"texto": "8", "es_correcta": true},
        {"texto": "5", "es_correcta": false},
        {"texto": "3", "es_correcta": false},
        {"texto": "53", "es_correcta": false}
      ],
      "explicacion": "La variable y almacena la suma de x (5) + 3, que es 8"
    },
    {
      "categoria": "Conceptos Básicos",
      "tipo_pregunta": "verdadero_falso",
      "tipo": "refuerzo",
      "dificultad": 1,
      "pregunta": "En JavaScript, el operador === compara valor y tipo de dato",
      "codigo": null,
      "opciones": [
        {"texto": "Verdadero", "es_correcta": true},
        {"texto": "Falso", "es_correcta": false}
      ],
      "explicacion": "El operador === es estricto y compara tanto el valor como el tipo de dato, a diferencia de =="
    },
    {
      "categoria": "Sintaxis Básica",
      "tipo_pregunta": "respuesta_corta",
      "tipo": "refuerzo",
      "dificultad": 1,
      "pregunta": "¿Qué palabra clave se usa para declarar una constante en JavaScript?",
      "codigo": null,
      "opciones": null,
      "respuesta_esperada": "const",
      "explicacion": "La palabra clave 'const' se usa para declarar constantes que no pueden ser reasignadas"
    },
    {
      "categoria": "Arrays",
      "tipo_pregunta": "opcion_multiple",
      "tipo": "desafio",
      "dificultad": 3,
      "pregunta": "¿Cuál es la forma correcta de agregar un elemento al final de un array?",
      "codigo": null,
      "opciones": [
        {"texto": "array.push(elemento)", "es_correcta": true},
        {"texto": "array.add(elemento)", "es_correcta": false},
        {"texto": "array.append(elemento)", "es_correcta": false},
        {"texto": "array.insert(elemento)", "es_correcta": false}
      ],
      "explicacion": "El método push() agrega uno o más elementos al final del array y retorna la nueva longitud"
    }
  ],
  "enfoque": {
    "areas_reforzar": ["${debilidades[0] || 'conceptos básicos de programación'}"],
    "areas_desafiar": ["${fortalezas[0] || 'lógica y algoritmos avanzados'}"]
  }
}`;
  }
}

export default new GroqService();
