import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import { 
  BookOpen, Users, FileText, TrendingUp, ArrowLeft, 
  Clock, Award, CheckCircle, XCircle, Play, Video, Calendar, Mail 
} from "lucide-react";

// Componente para mostrar compañeros
function CompañerosTab({ cursoId }) {
  const [compañeros, setCompañeros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);

  useEffect(() => {
    cargarCompañeros();
  }, [cursoId]);

  const cargarCompañeros = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:4000/api/cursos/${cursoId}/compañeros`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompañeros(response.data.compañeros);
      setTotalEstudiantes(response.data.total_estudiantes);
    } catch (error) {
      console.error("Error al cargar compañeros:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando compañeros...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Total de Estudiantes</h3>
            <p className="text-3xl font-bold">{totalEstudiantes}</p>
          </div>
          <Users className="w-16 h-16 opacity-20" />
        </div>
      </div>

      {/* Lista de Compañeros */}
      {compañeros.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Eres el único estudiante
          </h3>
          <p className="text-gray-600">
            Aún no hay otros compañeros inscritos en este curso
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {compañeros.map((compañero) => (
            <div
              key={compañero.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group"
            >
              {/* Header con Avatar */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {compañero.nombre.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Información */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 text-center mb-3">
                  {compañero.nombre}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                    <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{compañero.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                    <Calendar className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>
                      Inscrito:{" "}
                      {new Date(compañero.CourseStudent?.inscrito_en).toLocaleDateString("es-ES")}
                    </span>
                  </div>

                  {compañero.CourseStudent?.estado && (
                    <div className="flex items-center justify-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          compañero.CourseStudent.estado === "activo"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {compañero.CourseStudent.estado}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DetalleCursoEstudiante() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState("evaluaciones");
  const [curso, setCurso] = useState(null);
  const [progreso, setProgreso] = useState(null);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatosCurso();
  }, [id, location.key]); // Recargar cuando cambia la navegación

  // Recargar cuando se regresa de una evaluación
  useEffect(() => {
    if (location.state?.evaluacionCompletada) {
      cargarDatosCurso();
      // Limpiar el estado para que no se recargue múltiples veces
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const cargarDatosCurso = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Cargar progreso del curso
      const progresoRes = await axios.get(
        `http://localhost:4000/api/estudiante/cursos/${id}/progreso`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurso(progresoRes.data.curso);
      setProgreso(progresoRes.data.progreso);

      // Cargar evaluaciones asignadas del curso actual
      const evalRes = await axios.get(
        "http://localhost:4000/api/evaluaciones-usuarios/estudiante/asignadas",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Filtrar solo evaluaciones de este curso
      const evaluacionesDelCurso = evalRes.data.filter(
        ev => ev.evaluacion?.curso_id === id
      );
      
      setEvaluaciones(evaluacionesDelCurso);

      setError(null);
    } catch (err) {
      console.error("Error al cargar datos del curso:", err);
      setError("No se pudieron cargar los datos del curso");
    } finally {
      setLoading(false);
    }
  };

  const irARecursos = () => {
    navigate("/recursos");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (error || !curso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
          <button
            onClick={() => navigate("/estudiante/cursos")}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Volver a Mis Cursos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header con información del curso */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate("/estudiante/cursos")}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver a Mis Cursos
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {curso.titulo}
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                {curso.descripcion || "Sin descripción"}
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-700">
                    Profesor: <span className="font-semibold">{curso.profesor?.nombre}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-700">
                    Inscrito: {new Date(curso.inscripcion?.inscrito_en || Date.now()).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>

            {/* Card de progreso */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white min-w-[250px]">
              <div className="text-center mb-3">
                <div className="text-5xl font-bold mb-1">{progreso?.porcentaje_progreso || 0}%</div>
                <div className="text-blue-100 text-sm">Progreso del Curso</div>
              </div>
              <div className="border-t border-blue-400 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">Evaluaciones:</span>
                  <span className="font-semibold">
                    {progreso?.evaluaciones_completadas || 0}/{progreso?.evaluaciones_totales || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">Promedio:</span>
                  <span className="font-semibold">{progreso?.promedio_curso || 0}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-6 border-b border-gray-200">
            {[
              { id: "evaluaciones", label: "Evaluaciones", icon: FileText },
              { id: "recursos", label: "Recursos", icon: Video },
              { id: "progreso", label: "Mi Progreso", icon: TrendingUp },
              { id: "compañeros", label: "Compañeros", icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-500 border-transparent hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenido de tabs */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "evaluaciones" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Evaluaciones del Curso
            </h2>

            {evaluaciones.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <FileText className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No hay evaluaciones asignadas
                </h3>
                <p className="text-gray-600">
                  Tu profesor aún no ha asignado evaluaciones para este curso
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {evaluaciones.map((asignacion) => (
                  <div
                    key={asignacion.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {asignacion.evaluacion?.titulo || 'Sin título'}
                      </h3>
                      <p className="text-purple-100 text-sm line-clamp-2">
                        {asignacion.evaluacion?.descripcion || 'Sin descripción'}
                      </p>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Duración</p>
                            <p className="text-sm font-semibold">{asignacion.evaluacion?.duracion_minutos || 0} min</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Estado</p>
                            <span className={`text-sm font-semibold ${
                              asignacion.estado === "completada" ? "text-green-600" :
                              asignacion.estado === "en_progreso" ? "text-yellow-600" :
                              "text-blue-600"
                            }`}>
                              {asignacion.estado === "completada" ? "Completada" :
                               asignacion.estado === "en_progreso" ? "En Progreso" :
                               "Pendiente"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {asignacion.evaluacion?.termina_en && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                          <p className="text-xs text-yellow-800">
                            <strong>Vence:</strong> {new Date(asignacion.evaluacion.termina_en).toLocaleString('es-ES')}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => navigate(`/estudiante/evaluacion/${asignacion.evaluacion.id}/intento`)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <Play className="w-5 h-5" />
                        <span>
                          {asignacion.estado === "completada" ? "Ver Resultados" :
                           asignacion.estado === "en_progreso" ? "Continuar" :
                           "Iniciar Evaluación"}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "recursos" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Recursos Educativos
            </h2>
            
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Video className="w-24 h-24 mx-auto text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Busca videos educativos con IA
              </h3>
              <p className="text-gray-600 mb-6">
                Utiliza nuestra herramienta de recursos para encontrar videos de YouTube personalizados
              </p>
              <button
                onClick={irARecursos}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
              >
                Ir a Recursos
              </button>
            </div>
          </div>
        )}

        {activeTab === "progreso" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Mi Progreso en el Curso
            </h2>

            {/* Estadísticas generales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      {progreso?.evaluaciones_completadas || 0}
                    </div>
                    <div className="text-sm text-gray-500">Completadas</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-10 h-10 text-blue-500" />
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      {progreso?.promedio_curso || 0}%
                    </div>
                    <div className="text-sm text-gray-500">Promedio</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Award className="w-10 h-10 text-purple-500" />
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      {progreso?.intentos_realizados || 0}
                    </div>
                    <div className="text-sm text-gray-500">Intentos</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline de intentos */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Historial de Intentos</h3>
              
              {progreso?.intentos?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No has realizado intentos aún
                </div>
              ) : (
                <div className="space-y-3">
                  {progreso?.intentos?.map((intento, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center space-x-4">
                        {intento.puntaje >= 70 ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500" />
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">{intento.evaluacion}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(intento.finalizado_en).toLocaleString('es-ES')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          intento.puntaje >= 70 ? "text-green-600" : "text-red-600"
                        }`}>
                          {intento.puntaje}%
                        </div>
                        <div className="text-xs text-gray-500">{intento.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "compañeros" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Compañeros de Curso
            </h2>
            
            <CompañerosTab cursoId={id} />
          </div>
        )}
      </div>
    </div>
  );
}

export default DetalleCursoEstudiante;
