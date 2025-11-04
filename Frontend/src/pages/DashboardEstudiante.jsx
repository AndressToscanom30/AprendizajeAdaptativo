import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  BookOpen, FileText, TrendingUp, Award, Clock,
  Target, Zap, ChevronRight, AlertCircle
} from 'lucide-react';

const AnimatedCounter = ({ value, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{count}{suffix}</span>;
};

AnimatedCounter.propTypes = {
  value: PropTypes.number.isRequired,
  duration: PropTypes.number,
  suffix: PropTypes.string
};

function DashboardEstudiante() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [estadisticas, setEstadisticas] = useState(null);
  const [progreso, setProgreso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const [statsRes, progresoRes] = await Promise.all([
        axios.get("http://localhost:4000/api/estudiante/estadisticas", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:4000/api/estudiante/progreso", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setEstadisticas(statsRes.data);
      setProgreso(progresoRes.data.progreso);
      setError(null);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError("No se pudieron cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
          <button
            onClick={cargarDatos}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                ¡Bienvenido de nuevo, {user?.nombre}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Aquí está tu resumen de progreso académico
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Cards de estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cursos Activos */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Cursos</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              <AnimatedCounter value={progreso?.cursos_activos || 0} />
            </div>
            <p className="text-gray-600 text-sm">Cursos activos</p>
          </div>

          {/* Evaluaciones */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-full p-3">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Evaluaciones</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              <AnimatedCounter value={progreso?.evaluaciones_completadas || 0} />
              <span className="text-lg text-gray-500">/{progreso?.evaluaciones_asignadas || 0}</span>
            </div>
            <p className="text-gray-600 text-sm">Completadas</p>
          </div>

          {/* Promedio General */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Promedio</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              <AnimatedCounter value={parseFloat(progreso?.promedio_general || 0)} />
              <span className="text-lg">%</span>
            </div>
            <p className="text-gray-600 text-sm">Calificación general</p>
          </div>

          {/* Tests IA */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 rounded-full p-3">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Tests IA</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              <AnimatedCounter value={progreso?.tests_realizados || 0} />
            </div>
            <p className="text-gray-600 text-sm">Tests completados</p>
          </div>
        </div>

        {/* Progreso del curso */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <Target className="w-6 h-6 text-blue-600" />
              <span>Progreso General</span>
            </h2>
            <span className="text-3xl font-bold text-blue-600">
              {progreso?.porcentaje_completado || 0}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-4 rounded-full transition-all duration-1000"
              style={{ width: `${progreso?.porcentaje_completado || 0}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {progreso?.promedio_evaluaciones || 0}%
              </div>
              <div className="text-sm text-gray-600">Evaluaciones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {progreso?.promedio_tests || 0}%
              </div>
              <div className="text-sm text-gray-600">Tests IA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {progreso?.promedio_general || 0}%
              </div>
              <div className="text-sm text-gray-600">Promedio Total</div>
            </div>
          </div>
        </div>

        {/* Mis Cursos */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Mis Cursos</h2>
            <button
              onClick={() => navigate("/estudiante/cursos")}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
            >
              <span>Ver todos</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {estadisticas?.cursos?.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No tienes cursos asignados aún</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {estadisticas?.cursos?.slice(0, 3).map((curso) => (
                <div
                  key={curso.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/estudiante/cursos/${curso.id}`)}
                >
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">{curso.titulo}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {curso.descripcion || "Sin descripción"}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Profesor:</span>
                    <span className="font-semibold text-gray-700">
                      {curso.profesor?.nombre || "No asignado"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Evaluaciones Pendientes */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <Clock className="w-6 h-6 text-orange-600" />
              <span>Evaluaciones Pendientes</span>
            </h2>
          </div>

          {estadisticas?.evaluaciones_pendientes?.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">¡No tienes evaluaciones pendientes! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {estadisticas?.evaluaciones_pendientes?.slice(0, 5).map((evaluacion) => (
                <div
                  key={evaluacion.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{evaluacion.titulo}</h3>
                    <p className="text-sm text-gray-600">{evaluacion.duracion_minutos} minutos</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-orange-600">
                      Vence: {new Date(evaluacion.termina_en).toLocaleDateString('es-ES')}
                    </div>
                    <button
                      onClick={() => navigate(`/evaluacion/${evaluacion.id}/intento`)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                    >
                      Iniciar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/estudiante/cursos")}
            className="bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <BookOpen className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Mis Cursos</h3>
            <p className="text-blue-100">Ver todos tus cursos</p>
          </button>

          <button
            onClick={() => navigate("/estudiante/tests")}
            className="bg-gradient-to-br from-purple-600 to-purple-500 text-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <Zap className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Tests Adaptativos</h3>
            <p className="text-purple-100">Genera tests con IA</p>
          </button>

          <button
            onClick={() => navigate("/recursos")}
            className="bg-gradient-to-br from-green-600 to-green-500 text-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <FileText className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Recursos</h3>
            <p className="text-green-100">Videos educativos</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardEstudiante;
