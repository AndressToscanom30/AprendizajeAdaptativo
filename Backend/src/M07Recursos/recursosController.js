import axios from "axios";
import groqService from "../M06IA/services/groqService.js";

// Generar búsquedas inteligentes con Groq
export const generarBusquedas = async (req, res) => {
  try {
    const { tema, nivel, idioma = "español" } = req.body;

    if (!tema) {
      return res.status(400).json({
        ok: false,
        message: "El tema es requerido",
      });
    }

    const prompt = `Como experto en educación y búsqueda de recursos educativos, genera 5 términos de búsqueda específicos y efectivos para encontrar videos educativos de YouTube sobre "${tema}" para un nivel "${nivel || 'intermedio'}".

Los términos deben:
- Ser específicos y relevantes
- Incluir palabras clave técnicas cuando sea apropiado
- Estar en ${idioma}
- Ser variados (tutoriales, explicaciones, ejemplos prácticos, etc.)
- Evitar términos muy genéricos

Responde ÚNICAMENTE con un objeto JSON en este formato:
{
  "busquedas": [
    "término 1",
    "término 2",
    "término 3",
    "término 4",
    "término 5"
  ],
  "descripcion": "Breve explicación de por qué estos términos son efectivos"
}`;

    const resultado = await groqService.generateCompletion(prompt, {
      temperature: 0.7,
      maxTokens: 1000,
    });

    res.json({
      ok: true,
      data: resultado,
    });
  } catch (error) {
    console.error("Error al generar búsquedas:", error);
    res.status(500).json({
      ok: false,
      message: "Error al generar búsquedas con IA",
      error: error.message,
    });
  }
};

// Buscar videos en YouTube
export const buscarVideos = async (req, res) => {
  try {
    const { query, maxResults = 6 } = req.query;

    if (!query) {
      return res.status(400).json({
        ok: false,
        message: "El término de búsqueda es requerido",
      });
    }

    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

    if (!YOUTUBE_API_KEY) {
      return res.status(500).json({
        ok: false,
        message: "YouTube API Key no configurada",
      });
    }

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          type: "video",
          maxResults: maxResults,
          key: YOUTUBE_API_KEY,
          videoEmbeddable: true,
          relevanceLanguage: "es",
          safeSearch: "strict",
          videoDuration: "medium", // 4-20 minutos
        },
      }
    );

    // Formatear resultados
    const videos = response.data.items.map((item) => ({
      id: item.id.videoId,
      titulo: item.snippet.title,
      descripcion: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      canal: item.snippet.channelTitle,
      fechaPublicacion: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
    }));

    res.json({
      ok: true,
      data: {
        videos,
        totalResultados: response.data.pageInfo.totalResults,
        query,
      },
    });
  } catch (error) {
    console.error("Error al buscar videos:", error.response?.data || error);
    res.status(500).json({
      ok: false,
      message: "Error al buscar videos en YouTube",
      error: error.response?.data?.error?.message || error.message,
    });
  }
};

// Generar recomendaciones personalizadas basadas en el perfil del usuario
export const generarRecomendaciones = async (req, res) => {
  try {
    const { temas, nivel, objetivos } = req.body;
    const userId = req.userId; // Del middleware de autenticación

    const prompt = `Como tutor educativo personalizado, genera una lista de 8 temas de estudio recomendados para un estudiante con las siguientes características:

Temas de interés: ${temas?.join(", ") || "programación, desarrollo web"}
Nivel actual: ${nivel || "principiante"}
Objetivos: ${objetivos || "mejorar habilidades de programación"}

Para cada tema, genera un título específico y una breve descripción de por qué es relevante.

Responde ÚNICAMENTE con un objeto JSON en este formato:
{
  "recomendaciones": [
    {
      "titulo": "Título específico del tema",
      "descripcion": "Por qué este tema es importante para el estudiante",
      "nivel": "principiante|intermedio|avanzado",
      "duracionEstimada": "tiempo estimado de aprendizaje"
    }
  ],
  "mensaje": "Mensaje motivacional personalizado"
}`;

    const resultado = await groqService.generateCompletion(prompt, {
      temperature: 0.8,
      maxTokens: 2000,
    });

    res.json({
      ok: true,
      data: resultado,
    });
  } catch (error) {
    console.error("Error al generar recomendaciones:", error);
    res.status(500).json({
      ok: false,
      message: "Error al generar recomendaciones",
      error: error.message,
    });
  }
};

// Analizar video y generar resumen
export const analizarVideo = async (req, res) => {
  try {
    const { videoId, titulo, descripcion } = req.body;

    const prompt = `Analiza este video educativo y genera un resumen útil para estudiantes:

Título: ${titulo}
Descripción: ${descripcion}

Genera:
1. Temas principales cubiertos
2. Nivel de dificultad estimado
3. Puntos clave de aprendizaje
4. Para quién es más útil este video

Responde ÚNICAMENTE con un objeto JSON en este formato:
{
  "temasPrincipales": ["tema1", "tema2", "tema3"],
  "nivelDificultad": "principiante|intermedio|avanzado",
  "puntosClaves": ["punto1", "punto2", "punto3"],
  "recomendadoPara": "descripción del público objetivo",
  "duracionRecomendada": "tiempo recomendado para estudiar el contenido"
}`;

    const analisis = await groqService.generateCompletion(prompt, {
      temperature: 0.5,
      maxTokens: 1000,
    });

    res.json({
      ok: true,
      data: {
        videoId,
        analisis,
      },
    });
  } catch (error) {
    console.error("Error al analizar video:", error);
    res.status(500).json({
      ok: false,
      message: "Error al analizar video",
      error: error.message,
    });
  }
};
