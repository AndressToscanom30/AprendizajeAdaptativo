import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Clock, Zap, TrendingUp, Brain, Code, Star, ArrowLeft, RotateCcw, ChevronRight, Lightbulb, Award, BookOpen } from 'lucide-react';
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
  } catch (error) {
    setHasError(true);
    return fallback;
  }
};

function Dashboard() {
    const navigate = useNavigate();
    const testResults = {
        score: 75,
        totalQuestions: 10,
        correctAnswers: 7,
        codingQuestions: 8,
        multipleChoice: 2,
        averageTime: 45,
        level: "Intermedio",
        strengths: ["Funciones", "Bucles", "Lógica Condicional"],
        improvements: ["Arrays", "Objetos", "Algoritmos Avanzados"],
        topics: [
            { name: "Funciones", score: 85, time: "38s", status: "excelente" },
            { name: "Variables", score: 70, time: "42s", status: "bueno" },
            { name: "Arrays", score: 60, time: "52s", status: "mejora" },
            { name: "Bucles", score: 90, time: "35s", status: "excelente" },
            { name: "Condicionales", score: 80, time: "40s", status: "bueno" },
            { name: "Algoritmos", score: 55, time: "65s", status: "mejora" }
        ]
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'excelente': return 'bg-green-100 text-green-800';
            case 'bueno': return 'bg-yellow-100 text-yellow-800';
            case 'mejora': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-white relative">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <button 
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="font-medium">Volver al inicio</span>
                        </button>
                        <button 
                            onClick={() => navigate('/diagnostico')}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#155dfc] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Repetir Test
                        </button>
                    </div>
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
                            <Brain className="w-6 h-6" />
                            <span className="font-bold text-lg">Análisis Completado con IA</span>
                            <Zap className="w-5 h-5" />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-4">
                            ¡Resultados Espectaculares! 🎉
                        </h1>
                        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                            Análisis detallado de tu rendimiento en programación con insights personalizados
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                                    <Trophy className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-slate-800">
                                        <AnimatedCounter value={testResults.score} suffix="%" />
                                    </div>
                                    <div className="text-slate-500 text-sm">Puntuación General</div>
                                </div>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${testResults.score}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-slate-800">
                                        <AnimatedCounter value={testResults.correctAnswers} />/{testResults.totalQuestions}
                                    </div>
                                    <div className="text-slate-500 text-sm">Respuestas Correctas</div>
                                </div>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${(testResults.correctAnswers / testResults.totalQuestions) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-slate-800">
                                        <AnimatedCounter value={testResults.averageTime} suffix="s" />
                                    </div>
                                    <div className="text-slate-500 text-sm">Tiempo Promedio</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-amber-600">
                                <Zap className="w-4 h-4" />
                                <span>Velocidad Excelente</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                                    <Star className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-purple-600">
                                        {testResults.level}
                                    </div>
                                    <div className="text-slate-500 text-sm">Nivel Actual</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-purple-600">
                                <TrendingUp className="w-4 h-4" />
                                <span>En Progreso</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-800">Rendimiento por Tema</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
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
                        
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">Distribución de Respuestas</h3>
                            <div className="flex justify-center mb-4">
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

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-6 border border-green-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-500 rounded-lg">
                                    <Award className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-green-800">Fortalezas</h3>
                            </div>
                            <div className="space-y-3">
                                {testResults.strengths.map((strength, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-green-700 font-medium">{strength}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl p-6 border border-amber-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-amber-500 rounded-lg">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-amber-800">Áreas de Mejora</h3>
                            </div>
                            <div className="space-y-3">
                                {testResults.improvements.map((improvement, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                        <span className="text-amber-700 font-medium">{improvement}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6 border border-blue-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-500 rounded-lg">
                                    <Lightbulb className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-blue-800">Recomendaciones</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <BookOpen className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                    <span className="text-blue-700 text-sm">Practica más ejercicios de arrays y algoritmos</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Code className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                    <span className="text-blue-700 text-sm">Revisa conceptos de programación orientada a objetos</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Brain className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                    <span className="text-blue-700 text-sm">Considera tomar cursos avanzados</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Análisis Detallado por Tema</h3>
                                <p className="text-slate-600 text-sm">Desglose completo de tu rendimiento en cada área</p>
                            </div>
                        </div>
                        
                        <div className="grid gap-4">
                            {testResults.topics.map((topic, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-sm">
                                            <Code className="w-6 h-6 text-slate-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800">{topic.name}</div>
                                            <div className="text-sm text-slate-500">Tiempo promedio: {topic.time}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className={`text-lg font-bold ${getScoreColor(topic.score)}`}>
                                                {topic.score}%
                                            </div>
                                            <div className="w-20 bg-slate-200 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full transition-all duration-1000 ${
                                                        topic.score >= 80 ? 'bg-green-500' : 
                                                        topic.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${topic.score}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(topic.status)}`}>
                                            {topic.status === 'excelente' ? 'Excelente' : 
                                             topic.status === 'bueno' ? 'Bueno' : 'Necesita Mejora'}
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
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#155dfc] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Repetir Test
                            </button>
                            <button 
                                onClick={() => navigate('/recursos')}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
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