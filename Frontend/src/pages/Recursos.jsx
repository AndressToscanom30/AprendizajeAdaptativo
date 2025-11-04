import { useState, useEffect } from "react";
import { Search, Youtube, Sparkles, BookOpen, TrendingUp, Brain, Play, ExternalLink, Loader2 } from "lucide-react";
import axios from "axios";

function Recursos() {
  const [tema, setTema] = useState("");
  const [nivel, setNivel] = useState("intermedio");
  const [busquedas, setBusquedas] = useState([]);
  const [videos, setVideos] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [videoSeleccionado, setVideoSeleccionado] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    cargarRecomendaciones();

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / window.innerWidth,
        y: (e.clientY - window.innerHeight / 2) / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const cargarRecomendaciones = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/recursos/recomendaciones",
        {
          temas: ["programación", "desarrollo web", "algoritmos"],
          nivel: "intermedio",
          objetivos: "mejorar habilidades técnicas",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.ok) {
        setRecomendaciones(response.data.data.recomendaciones || []);
        setMensaje(response.data.data.mensaje || "");
      }
    } catch (error) {
      console.error("Error al cargar recomendaciones:", error);
    }
  };

  const generarBusquedasInteligentes = async () => {
    if (!tema.trim()) {
      alert("Por favor, ingresa un tema de búsqueda");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/recursos/generar-busquedas",
        { tema, nivel },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.ok) {
        setBusquedas(response.data.data.busquedas || []);
        // Automáticamente buscar videos con el primer término
        if (response.data.data.busquedas?.length > 0) {
          buscarVideos(response.data.data.busquedas[0]);
        }
      }
    } catch (error) {
      console.error("Error al generar búsquedas:", error);
      alert("Error al generar búsquedas inteligentes");
    } finally {
      setLoading(false);
    }
  };

  const buscarVideos = async (query) => {
    setLoadingVideos(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:4000/api/recursos/videos?query=${encodeURIComponent(
          query
        )}&maxResults=9`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.ok) {
        setVideos(response.data.data.videos || []);
      }
    } catch (error) {
      console.error("Error al buscar videos:", error);
      alert("Error al buscar videos. Verifica que la API de YouTube esté configurada.");
    } finally {
      setLoadingVideos(false);
    }
  };

  const abrirVideo = (video) => {
    setVideoSeleccionado(video);
  };

  const cerrarModal = () => {
    setVideoSeleccionado(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Fondo animado */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
          }}
        ></div>
        <div
          className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
          }}
        ></div>
        <div
          className="absolute -bottom-20 right-1/4 w-64 h-64 bg-indigo-200 rounded-full opacity-20 blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Recursos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Aprendizaje</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Descubre videos educativos con IA. Ingresa un tema y nuestra inteligencia artificial generará búsquedas optimizadas.
          </p>
        </div>

        {/* Mensaje motivacional */}
        {mensaje && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 rounded-xl">
            <div className="flex items-start gap-3">
              <Brain className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <p className="text-slate-700 leading-relaxed">{mensaje}</p>
            </div>
          </div>
        )}

        {/* Buscador Inteligente */}
        <div className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-slate-800">Búsqueda Inteligente con IA</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ¿Qué quieres aprender?
                </label>
                <input
                  type="text"
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && generarBusquedasInteligentes()}
                  placeholder="Ej: React Hooks, Algoritmos de ordenamiento, Machine Learning..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nivel
                </label>
                <select
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
                >
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>
            </div>

            <button
              onClick={generarBusquedasInteligentes}
              disabled={loading}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generando búsquedas...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generar búsquedas con IA
                </>
              )}
            </button>
          </div>
        </div>

        {/* Términos de búsqueda generados */}
        {busquedas.length > 0 && (
          <div className="mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-slate-800">Búsquedas Optimizadas por IA</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {busquedas.map((busqueda, index) => (
                  <button
                    key={index}
                    onClick={() => buscarVideos(busqueda)}
                    className="px-5 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-slate-700 font-medium"
                  >
                    {busqueda}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recomendaciones personalizadas */}
        {recomendaciones.length > 0 && videos.length === 0 && (
          <div className="mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-slate-800">Temas Recomendados Para Ti</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recomendaciones.slice(0, 8).map((rec, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setTema(rec.titulo);
                      setNivel(rec.nivel);
                    }}
                    className="p-6 bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {rec.titulo}
                      </h4>
                      <Search className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{rec.descripcion}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {rec.nivel}
                      </span>
                      <span className="text-slate-500">{rec.duracionEstimada}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Videos */}
        {loadingVideos && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-600">Buscando los mejores videos educativos...</p>
          </div>
        )}

        {videos.length > 0 && !loadingVideos && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Youtube className="w-7 h-7 text-red-600" />
              <h3 className="text-2xl font-bold text-slate-800">
                Resultados de YouTube ({videos.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-white/80 overflow-hidden transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.titulo}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() => abrirVideo(video)}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-red-700 transition-colors"
                      >
                        <Play className="w-5 h-5" />
                        Ver video
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <h4 className="font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {video.titulo}
                    </h4>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {video.descripcion}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{video.canal}</span>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {videos.length === 0 && !loadingVideos && busquedas.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-6">
              <Youtube className="w-20 h-20 text-slate-300 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-600 mb-3">
              Comienza a explorar
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Ingresa un tema de tu interés y la IA generará búsquedas optimizadas para encontrar los mejores recursos educativos.
            </p>
          </div>
        )}
      </div>

      {/* Modal de video */}
      {videoSeleccionado && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={cerrarModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video">
              <iframe
                src={`${videoSeleccionado.embedUrl}?autoplay=1`}
                title={videoSeleccionado.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {videoSeleccionado.titulo}
              </h3>
              <p className="text-slate-600 mb-4">{videoSeleccionado.descripcion}</p>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{videoSeleccionado.canal}</span>
                <button
                  onClick={cerrarModal}
                  className="px-6 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-medium transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Recursos;
