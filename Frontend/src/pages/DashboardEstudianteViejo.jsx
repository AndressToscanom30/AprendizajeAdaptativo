import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Trophy, Target, Clock, Zap, TrendingUp, Brain, Code, Star, RotateCcw, ChevronRight, Lightbulb, Award, BookOpen } from 'lucide-react';
import LinesChart from "../components/LinesChart";
import PiesChart from "../components/PiesChart";

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

const ProgressRing = ({ progress, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="text-blue-500 transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-slate-800">
          <AnimatedCounter value={progress} suffix="%" />
        </span>
      </div>
    </div>
  );
};

ProgressRing.propTypes = {
  progress: PropTypes.number.isRequired,
  size: PropTypes.number,
  strokeWidth: PropTypes.number
};

const SafeChartWrapper = ({ children, fallback, height = "200px" }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (hasError) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-center text-slate-500">
          <div className="text-sm">Error al cargar gráfica</div>
          {fallback}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  try {
    return (
      <div style={{ height }} className="relative">
        {children}
      </div>
    );
  } catch {
    setHasError(true);
    return fallback;
  }
};

SafeChartWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  height: PropTypes.string
};

function Dashboard() {
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

            // Cargar estadísticas del dashboard
            const statsRes = await axios.get(
                "http://localhost:4000/api/estudiante/estadisticas",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Cargar progreso general
            const progresoRes = await axios.get(
                "http://localhost:4000/api/estudiante/progreso",
                { headers: { Authorization: `Bearer ${token}` } }
            );

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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Cargando dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
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

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'excelente': return 'bg-green-100 text-green-800';
            case 'bueno': return 'bg-yellow-100 text-yellow-800';
            case 'mejora': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'excelente': return 'Excelente';
            case 'bueno': return 'Bueno';
            case 'mejora': return 'Necesita Mejora';
            default: return 'Sin datos';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex justify-end mb-4">
                        <button 
                            onClick={() => navigate('/diagnostico')}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Repetir Test
                        </button>
                    </div>

                    <div className="text-center mb-12 bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
                        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
                            <Brain className="w-6 h-6" />
                            <span className="font-bold text-lg">Análisis Completado con IA</span>
                            <Zap className="w-5 h-5" />
                        </div>
                        <h1 className="text-5xl font-bold text-slate-800 mb-4">
                            ¡Resultados Espectaculares! 🎉
                        </h1>
                        <p className="text-slate-600 text-xl max-w-2xl mx-auto">
                            Análisis detallado de tu rendimiento en programación con insights personalizados
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                    <Trophy className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-slate-800">
                                        <AnimatedCounter value={testResults.score} suffix="%" />
                                    </div>
                                    <div className="text-slate-500 text-sm font-medium">Puntuación General</div>
                                </div>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                                <div 
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-1000"
                                    style={{ width: `${testResults.score}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-green-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-slate-800">
                                        <AnimatedCounter value={testResults.correctAnswers} />/{testResults.totalQuestions}
                                    </div>
                                    <div className="text-slate-500 text-sm font-medium">Respuestas Correctas</div>
                                </div>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                                <div 
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2.5 rounded-full transition-all duration-1000"
                                    style={{ width: `${(testResults.correctAnswers / testResults.totalQuestions) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-amber-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-slate-800">
                                        <AnimatedCounter value={testResults.averageTime} suffix="s" />
                                    </div>
                                    <div className="text-slate-500 text-sm font-medium">Tiempo Promedio</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-amber-600 font-medium">
                                <Zap className="w-4 h-4" />
                                <span>Velocidad Excelente</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                                    <Star className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {testResults.level}
                                    </div>
                                    <div className="text-slate-500 text-sm font-medium">Nivel Actual</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                                <TrendingUp className="w-4 h-4" />
                                <span>En Progreso</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800">Rendimiento por Tema</h3>
                                    <p className="text-slate-500 text-sm mt-1">Análisis detallado de tu progreso</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>Análisis Detallado</span>
                                </div>
                            </div>
                            <SafeChartWrapper 
                                height="300px"
                                fallback={<div className="text-slate-400">Gráfica no disponible</div>}
                            >
                                <LinesChart />
                            </SafeChartWrapper>
                        </div>
                        
                        <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Distribución de Respuestas</h3>
                                <p className="text-slate-500 text-sm">Tu rendimiento general</p>
                            </div>
                            <div className="flex justify-center mb-6">
                                <ProgressRing progress={testResults.score} />
                            </div>
                            <SafeChartWrapper 
                                height="250px"
                                fallback={<div className="text-slate-400">Gráfica no disponible</div>}
                            >
                                <PiesChart />
                            </SafeChartWrapper>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-lg p-8 border border-green-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-green-800">Fortalezas</h3>
                            </div>
                            <div className="space-y-3">
                                {testResults.strengths.map((strength, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-3 rounded-xl">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-green-700 font-medium">{strength}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-lg p-8 border border-amber-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-amber-500 rounded-xl shadow-lg">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-amber-800">Áreas de Mejora</h3>
                            </div>
                            <div className="space-y-3">
                                {testResults.improvements.map((improvement, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-3 rounded-xl">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                        <span className="text-amber-700 font-medium">{improvement}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-lg p-8 border border-blue-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                                    <Lightbulb className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-blue-800">Recomendaciones</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-3 rounded-xl">
                                    <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-blue-700 text-sm">Practica más ejercicios de arrays y algoritmos</span>
                                </div>
                                <div className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-3 rounded-xl">
                                    <Code className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-blue-700 text-sm">Revisa conceptos de programación orientada a objetos</span>
                                </div>
                                <div className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-3 rounded-xl">
                                    <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-blue-700 text-sm">Considera tomar cursos avanzados</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-slate-200">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800">Análisis Detallado por Tema</h3>
                                <p className="text-slate-600 text-sm">Desglose completo de tu rendimiento en cada área</p>
                            </div>
                        </div>
                        
                        <div className="grid gap-4">
                            {testResults.topics.map((topic) => (
                                <div key={topic.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl hover:shadow-md transition-all duration-300 border border-slate-200">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-14 h-14 bg-white rounded-xl shadow-md">
                                            <Code className="w-7 h-7 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-lg">{topic.name}</div>
                                            <div className="text-sm text-slate-500">Tiempo promedio: {topic.time}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className={`text-2xl font-bold ${getScoreColor(topic.score)}`}>
                                                {topic.score}%
                                            </div>
                                            <div className="w-24 bg-slate-200 rounded-full h-2.5 mt-2">
                                                <div 
                                                    className={`h-2.5 rounded-full transition-all duration-1000 ${getScoreBgColor(topic.score)}`}
                                                    style={{ width: `${topic.score}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-2 rounded-xl text-xs font-bold ${getStatusColor(topic.status)}`}>
                                            {getStatusText(topic.status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={() => navigate('/diagnostico')}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Repetir Test
                            </button>
                            <button 
                                onClick={() => navigate('/recursos')}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                            >
                                <BookOpen className="w-5 h-5" />
                                Ver Recursos de Estudio
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;