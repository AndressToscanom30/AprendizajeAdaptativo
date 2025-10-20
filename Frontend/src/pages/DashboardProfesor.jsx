import { useState, useEffect } from 'react';
import { 
    Users, Target, Clock, Zap, TrendingUp, Brain, 
    ArrowLeft, Book, ChevronRight, Lightbulb, Award,
    BookOpen, GraduationCap, ChartBar, UserCheck, Settings
} from 'lucide-react';
import LinesChart from "../components/LinesChart";
import PiesChart from "../components/PiesChart";
import BarsChart from "../components/BarsChart";

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

function DashboardProfesor() {
    const classStats = {
        totalStudents: 25,
        activeStudents: 22,
        averageScore: 78,
        completionRate: 85,
        averageTime: 42,
        topPerformers: 8,
        needHelp: 4,
        topics: [
            { name: "Fundamentos", progress: 90 },
            { name: "Estructuras de Control", progress: 75 },
            { name: "Funciones", progress: 85 },
            { name: "Arrays", progress: 65 },
            { name: "Objetos", progress: 70 }
        ],
        recentActivities: [
            { student: "Ana García", action: "Completó diagnóstico", score: 92, time: "Hace 2h" },
            { student: "Carlos López", action: "En progreso", score: 78, time: "Hace 3h" },
            { student: "María Rodríguez", action: "Necesita ayuda", score: 45, time: "Hace 4h" },
            { student: "Juan Pérez", action: "Completó ejercicios", score: 88, time: "Hace 5h" }
        ]
    };

    

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="min-h-screen bg-white relative">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <button className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="font-medium">Volver al inicio</span>
                        </button>
                        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#155dfc] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg">
                            <Settings className="w-4 h-4" />
                            Configuración de Clase
                        </button>
                    </div>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
                            <GraduationCap className="w-6 h-6" />
                            <span className="font-bold text-lg">Panel del Profesor</span>
                            <Zap className="w-5 h-5" />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-4">
                            Vista General de la Clase
                        </h1>
                        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                            Monitorea el progreso de tus estudiantes y gestiona el aprendizaje adaptativo
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-slate-800">
                                        <AnimatedCounter value={classStats.activeStudents} />/{classStats.totalStudents}
                                    </div>
                                    <div className="text-slate-500 text-sm">Estudiantes Activos</div>
                                </div>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${(classStats.activeStudents / classStats.totalStudents) * 100}%` }}
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
                                        <AnimatedCounter value={classStats.completionRate} suffix="%" />
                                    </div>
                                    <div className="text-slate-500 text-sm">Tasa de Completado</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-600">
                                <TrendingUp className="w-4 h-4" />
                                <span>Por encima del promedio</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-slate-800">
                                        <AnimatedCounter value={classStats.averageTime} suffix="m" />
                                    </div>
                                    <div className="text-slate-500 text-sm">Tiempo Promedio</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-amber-600">
                                <Zap className="w-4 h-4" />
                                <span>Tiempo Efectivo</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-slate-800">
                                        <AnimatedCounter value={classStats.averageScore} suffix="%" />
                                    </div>
                                    <div className="text-slate-500 text-sm">Promedio General</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-purple-600">
                                <ChartBar className="w-4 h-4" />
                                <span>Buen Rendimiento</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-800">Progreso por Tema</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>Análisis General</span>
                                </div>
                            </div>
                            <SafeChartWrapper 
                                height="300px"
                                fallback={<div className="text-slate-400">Gráfica no disponible</div>}
                            >
                                <BarsChart />
                            </SafeChartWrapper>
                        </div>
                        
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-800">Distribución de Niveles</h3>
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                    Ver Detalles
                                </button>
                            </div>
                            <SafeChartWrapper 
                                height="300px"
                                fallback={<div className="text-slate-400">Gráfica no disponible</div>}
                            >
                                <PiesChart />
                            </SafeChartWrapper>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-6 border border-green-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500 rounded-lg">
                                        <UserCheck className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-green-800">Mejores Estudiantes</h3>
                                </div>
                                <span className="text-green-600 text-sm font-medium">{classStats.topPerformers} estudiantes</span>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-white rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-slate-800">Ana García</span>
                                        <span className="text-green-600 font-bold">95%</span>
                                    </div>
                                    <div className="text-sm text-slate-500">Excelente en todos los temas</div>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-slate-800">Juan Pérez</span>
                                        <span className="text-green-600 font-bold">92%</span>
                                    </div>
                                    <div className="text-sm text-slate-500">Destacado en ejercicios prácticos</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl p-6 border border-amber-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-500 rounded-lg">
                                        <Target className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-amber-800">Necesitan Atención</h3>
                                </div>
                                <span className="text-amber-600 text-sm font-medium">{classStats.needHelp} estudiantes</span>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-white rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-slate-800">María Rodríguez</span>
                                        <span className="text-red-600 font-bold">45%</span>
                                    </div>
                                    <div className="text-sm text-slate-500">Dificultades en Arrays</div>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-slate-800">Pedro Sánchez</span>
                                        <span className="text-amber-600 font-bold">58%</span>
                                    </div>
                                    <div className="text-sm text-slate-500">Progreso lento en ejercicios</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6 border border-blue-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-500 rounded-lg">
                                    <Lightbulb className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-blue-800">Acciones Recomendadas</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <BookOpen className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                    <span className="text-blue-700 text-sm">Programar sesión de repaso de Arrays</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Brain className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                    <span className="text-blue-700 text-sm">Revisar ejercicios de estudiantes con dificultades</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Book className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                    <span className="text-blue-700 text-sm">Preparar material adicional sobre Objetos</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Actividad Reciente</h3>
                                    <p className="text-slate-600 text-sm">Últimas actividades de los estudiantes</p>
                                </div>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Ver Todo
                            </button>
                        </div>
                        
                        <div className="grid gap-4">
                            {classStats.recentActivities.map((activity, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-sm">
                                            <GraduationCap className="w-6 h-6 text-slate-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800">{activity.student}</div>
                                            <div className="text-sm text-slate-500">{activity.action}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className={`text-lg font-bold ${getScoreColor(activity.score)}`}>
                                                {activity.score}%
                                            </div>
                                            <div className="text-sm text-slate-500">{activity.time}</div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#155dfc] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg">
                                <Brain className="w-5 h-5" />
                                Gestionar Contenido
                            </button>
                            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg">
                                <Users className="w-5 h-5" />
                                Gestionar Estudiantes
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardProfesor;