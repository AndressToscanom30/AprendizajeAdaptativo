import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  Award, 
  AlertCircle, 
  CheckCircle, 
  PlayCircle,
  Loader2,
  Filter,
  TrendingUp,
  FileText
} from "lucide-react";

function EvaluacionesEstudiante() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const navigate = useNavigate();

  useEffect(() => {
    cargarEvaluaciones();
  }, [filtroEstado]);

  const cargarEvaluaciones = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const url = filtroEstado === "todas" 
        ? "http://localhost:4000/api/evaluaciones-usuarios/estudiante/asignadas"
        : `http://localhost:4000/api/evaluaciones-usuarios/estudiante/asignadas?estado=${filtroEstado}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEvaluaciones(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar evaluaciones:", err);
      setError("No se pudieron cargar las evaluaciones. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado, tiempoAgotado, puedeRealizar) => {
    if (tiempoAgotado) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Tiempo Agotado
        </span>
      );
    }

    if (estado === "completada") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Completada
        </span>
      );
    }

    if (estado === "en_progreso") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 flex items-center gap-1">
          <PlayCircle className="w-3 h-3" />
          En Progreso
        </span>
      );
    }

    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 flex items-center gap-1">
        <BookOpen className="w-3 h-3" />
        Pendiente
      </span>
    );
  };

  const getDiasRestantesColor = (dias) => {
    if (!dias) return "text-gray-500";
    if (dias <= 1) return "text-red-600 font-bold";
    if (dias <= 3) return "text-orange-600 font-semibold";
    return "text-green-600";
  };

  const evaluacionesFiltradas = evaluaciones.filter(ev => {
    if (filtroEstado === "todas") return true;
    return ev.estado === filtroEstado;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
          <p className="mt-4 text-slate-600 font-medium">Cargando evaluaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-8">
        <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-300 rounded-3xl p-8">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-700 text-center">{error}</p>
          <button
            onClick={cargarEvaluaciones}
            className="mt-4 w-full px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Mis Evaluaciones
              </h1>
              <p className="text-slate-600 mt-1">
                Evaluaciones asignadas por tus profesores
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">Filtrar por Estado</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { value: "todas", label: "Todas", color: "slate" },
              { value: "pendiente", label: "Pendientes", color: "blue" },
              { value: "en_progreso", label: "En Progreso", color: "yellow" },
              { value: "completada", label: "Completadas", color: "green" }
            ].map((filtro) => (
              <button
                key={filtro.value}
                onClick={() => setFiltroEstado(filtro.value)}
                className={`px-5 py-2 rounded-xl font-medium transition-all duration-300 ${
                  filtroEstado === filtro.value
                    ? `bg-gradient-to-r from-${filtro.color}-500 to-${filtro.color}-600 text-white shadow-lg scale-105`
                    : `bg-${filtro.color}-50 text-${filtro.color}-700 hover:bg-${filtro.color}-100`
                }`}
              >
                {filtro.label}
              </button>
            ))}
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total</p>
                <p className="text-2xl font-bold text-slate-800">{evaluaciones.length}</p>
              </div>
              <BookOpen className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Pendientes</p>
                <p className="text-2xl font-bold text-blue-600">
                  {evaluaciones.filter(e => e.estado === "pendiente").length}
                </p>
              </div>
              <Clock className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">En Progreso</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {evaluaciones.filter(e => e.estado === "en_progreso").length}
                </p>
              </div>
              <PlayCircle className="w-10 h-10 text-yellow-500 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Completadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {evaluaciones.filter(e => e.estado === "completada").length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Lista de Evaluaciones */}
        {evaluacionesFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
            <BookOpen className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              No hay evaluaciones {filtroEstado !== "todas" && filtroEstado}
            </h3>
            <p className="text-slate-500">
              {filtroEstado === "todas" 
                ? "Tus profesores aún no te han asignado evaluaciones."
                : `No tienes evaluaciones en estado ${filtroEstado}.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {evaluacionesFiltradas.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden group"
              >
                {/* Header con gradiente */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 text-white">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold flex-1 pr-4">
                      {ev.evaluacion?.titulo || "Sin título"}
                    </h3>
                    {getEstadoBadge(ev.estado, ev.tiempo_agotado, ev.puede_realizar)}
                  </div>
                  <p className="text-blue-100 text-sm line-clamp-2">
                    {ev.evaluacion?.descripcion || "Sin descripción"}
                  </p>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  {/* Información del profesor */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-200">
                    <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-2 rounded-lg">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Profesor</p>
                      <p className="font-semibold text-slate-800">
                        {ev.evaluacion?.creator?.nombre || "Desconocido"}
                      </p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <p className="text-xs text-slate-600">Duración</p>
                      </div>
                      <p className="font-bold text-slate-800">
                        {ev.evaluacion?.duracion_minutos || 0} min
                      </p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <p className="text-xs text-slate-600">Mejor Nota</p>
                      </div>
                      <p className="font-bold text-green-600">
                        {ev.mejor_calificacion?.toFixed(1) || 0}/100
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <PlayCircle className="w-4 h-4 text-purple-600" />
                        <p className="text-xs text-slate-600">Intentos</p>
                      </div>
                      <p className="font-bold text-slate-800">
                        {ev.intentos_realizados || 0} / {ev.evaluacion?.intentos_maximos || 0}
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <p className="text-xs text-slate-600">Tiempo</p>
                      </div>
                      <p className={`font-bold ${getDiasRestantesColor(ev.dias_restantes)}`}>
                        {ev.dias_restantes !== null 
                          ? ev.dias_restantes > 0 
                            ? `${ev.dias_restantes} días`
                            : "¡Hoy!"
                          : "Sin límite"}
                      </p>
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/estudiante/evaluacion/${ev.evaluacionId}`)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-xl hover:from-slate-200 hover:to-slate-300 transition-all duration-300 font-semibold flex items-center justify-center gap-2 group"
                    >
                      <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Ver Detalles
                    </button>
                    
                    {ev.puede_realizar && !ev.tiempo_agotado && (
                      <button
                        onClick={() => navigate(`/estudiante/evaluacion/${ev.evaluacionId}/intento`)}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-2 group"
                      >
                        <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Iniciar
                      </button>
                    )}
                  </div>

                  {/* Alertas */}
                  {ev.tiempo_agotado && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <p className="text-xs text-red-700">
                        El tiempo límite para esta evaluación ha expirado.
                      </p>
                    </div>
                  )}

                  {!ev.puede_realizar && !ev.tiempo_agotado && (
                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <p className="text-xs text-amber-700">
                        Has alcanzado el máximo de intentos permitidos.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EvaluacionesEstudiante;
