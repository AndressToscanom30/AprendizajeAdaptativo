import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
    Users, Target, Clock, Zap, TrendingUp, Brain, 
    Book, ChevronRight, Lightbulb, Award,
    BookOpen, GraduationCap, ChartBar, UserCheck, Settings, AlertCircle, Loader2
} from 'lucide-react';
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

AnimatedCounter.propTypes = {
    value: PropTypes.number.isRequired,
    duration: PropTypes.number,
    suffix: PropTypes.string
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

    useEffect(() => {
        const handleError = () => {
            setHasError(true);
        };

        if (!children) {
            handleError();
        }
    }, [children]);

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

    return (
        <div style={{ height }} className="relative">
            {children}
        </div>
    );
};

SafeChartWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    fallback: PropTypes.node,
    height: PropTypes.string
};

function DashboardProfesor() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [estadisticas, setEstadisticas] = useState({
        totalEstudiantes: 0,
        estudiantesActivos: 0,
        totalEvaluaciones: 0,
        evaluacionesActivas: 0,
        totalCursos: 0,
        promedioGeneral: 0,
        tasaCompletado: 0,
        tiempoPromedio: 0
    });
    const [cursos, setCursos] = useState([]);
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [actividadReciente, setActividadReciente] = useState([]);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        setError('');
        
        try {
            const token = localStorage.getItem('token');
            
            // Cargar cursos del profesor
            const cursosRes = await fetch('http://localhost:4000/api/cursos/profesor', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!cursosRes.ok) throw new Error('Error al cargar cursos');
            const cursosData = await cursosRes.json();
            setCursos(cursosData);

            // Cargar evaluaciones del profesor
            const evaluacionesRes = await fetch('http://localhost:4000/api/evaluaciones', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!evaluacionesRes.ok) throw new Error('Error al cargar evaluaciones');
            const evaluacionesData = await evaluacionesRes.json();
            setEvaluaciones(evaluacionesData);

            // Calcular estadísticas
            const estudiantesUnicos = new Set();
            cursosData.forEach(curso => {
                if (curso.estudiantes) {
                    curso.estudiantes.forEach(est => estudiantesUnicos.add(est.id));
                }
            });

            const totalEstudiantes = estudiantesUnicos.size;
            const evaluacionesActivas = evaluacionesData.filter(e => e.activa).length;

            // Simular actividad reciente basada en evaluaciones
            const actividadSimulada = evaluacionesData.slice(0, 4).map((evaluacion, index) => ({
                id: evaluacion.id,
                student: `Estudiante ${index + 1}`,
                action: evaluacion.activa ? 'En progreso' : 'Completado',
                score: Math.floor(Math.random() * 40) + 60,
                time: `Hace ${index + 1}h`,
                evaluacion: evaluacion.titulo
            }));

            setActividadReciente(actividadSimulada);

            setEstadisticas({
                totalEstudiantes,
                estudiantesActivos: Math.floor(totalEstudiantes * 0.85),
                totalEvaluaciones: evaluacionesData.length,
                evaluacionesActivas,
                totalCursos: cursosData.length,
                promedioGeneral: 78,
                tasaCompletado: 85,
                tiempoPromedio: 42
            });

        } catch (err) {
            console.error('Error:', err);
            setError('Error al cargar los datos del dashboard');
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 text-lg font-semibold">Cargando dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-8">
                <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md border border-red-200">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Error</h2>
                    <p className="text-slate-600 text-center mb-6">{error}</p>
                    <button
                        onClick={cargarDatos}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    const classStats = {
        totalStudents: estadisticas.totalEstudiantes,
        activeStudents: estadisticas.estudiantesActivos,
        averageScore: estadisticas.promedioGeneral,
        completionRate: estadisticas.tasaCompletado,
        averageTime: estadisticas.tiempoPromedio,
        topPerformers: Math.floor(estadisticas.totalEstudiantes * 0.3),
        needHelp: Math.floor(estadisticas.totalEstudiantes * 0.15),
        topics: [
            { name: "Fundamentos", progress: 90 },
            { name: "Estructuras de Control", progress: 75 },
            { name: "Funciones", progress: 85 },
            { name: "Arrays", progress: 65 },
            { name: "Objetos", progress: 70 }
        ],
        recentActivities: actividadReciente
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex justify-end mb-4">
                        <button 
                            onClick={() => navigate('/evaluaciones/profesor')}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <Settings className="w-5 h-5" />
                            Gestionar Evaluaciones
                        </button>
                    </div>

                    <div className="text-center mb-12 bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
                        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
                            <GraduationCap className="w-6 h-6" />
                            <span className="font-bold text-lg">Panel del Profesor</span>
                            <Zap className="w-5 h-5" />
                        </div>
                        <h1 className="text-5xl font-bold text-slate-800 mb-4">
                            Vista General de la Clase
                        </h1>
                        <p className="text-slate-600 text-xl max-w-2xl mx-auto">
                            Monitorea el progreso de tus estudiantes y gestiona el aprendizaje adaptativo
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-slate-800">
                                        <AnimatedCounter value={classStats.activeStudents} />/{classStats.totalStudents}
                                    </div>
                                    <div className="text-slate-500 text-sm font-medium">Estudiantes Activos</div>
                                </div>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                                <div 
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-1000"
                                    style={{ width: `${(classStats.activeStudents / classStats.totalStudents) * 100}%` }}
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
                                        <AnimatedCounter value={classStats.completionRate} suffix="%" />
                                    </div>
                                    <div className="text-slate-500 text-sm font-medium">Tasa de Completado</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                                <TrendingUp className="w-4 h-4" />
                                <span>Por encima del promedio</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-amber-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-slate-800">
                                        <AnimatedCounter value={classStats.averageTime} suffix="m" />
                                    </div>
                                    <div className="text-slate-500 text-sm font-medium">Tiempo Promedio</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-amber-600 font-medium">
                                <Zap className="w-4 h-4" />
                                <span>Tiempo Efectivo</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-indigo-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-slate-800">
                                        <AnimatedCounter value={classStats.averageScore} suffix="%" />
                                    </div>
                                    <div className="text-slate-500 text-sm font-medium">Promedio General</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                                <ChartBar className="w-4 h-4" />
                                <span>Buen Rendimiento</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800">Progreso por Tema</h3>
                                    <p className="text-slate-500 text-sm mt-1">Análisis general de la clase</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
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
                        
                        <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800">Distribución de Niveles</h3>
                                    <p className="text-slate-500 text-sm mt-1">Clasificación de estudiantes</p>
                                </div>
                                <button 
                                    onClick={() => navigate('/estudiantes')}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                                >
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

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-lg p-8 border border-green-200">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                                        <UserCheck className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-green-800">Mejores Estudiantes</h3>
                                </div>
                                <span className="text-green-600 text-sm font-bold bg-green-100 px-3 py-1 rounded-full">
                                    {classStats.topPerformers || 0}
                                </span>
                            </div>
                            <div className="space-y-3">
                                {estadisticas.totalEstudiantes > 0 ? (
                                    <>
                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-slate-800">Rendimiento Alto</span>
                                                <span className="text-green-600 font-bold text-lg">~95%</span>
                                            </div>
                                            <div className="text-sm text-slate-600">Estudiantes destacados en cursos</div>
                                        </div>
                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-slate-800">Progreso Excelente</span>
                                                <span className="text-green-600 font-bold text-lg">~92%</span>
                                            </div>
                                            <div className="text-sm text-slate-600">Completando evaluaciones exitosamente</div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8 text-slate-500">
                                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No hay estudiantes inscritos aún</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-lg p-8 border border-amber-200">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-amber-500 rounded-xl shadow-lg">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-amber-800">Necesitan Atención</h3>
                                </div>
                                <span className="text-amber-600 text-sm font-bold bg-amber-100 px-3 py-1 rounded-full">
                                    {classStats.needHelp || 0}
                                </span>
                            </div>
                            <div className="space-y-3">
                                {estadisticas.totalEstudiantes > 0 ? (
                                    <>
                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-slate-800">Rendimiento Bajo</span>
                                                <span className="text-red-600 font-bold text-lg">~45%</span>
                                            </div>
                                            <div className="text-sm text-slate-600">Requieren apoyo adicional</div>
                                        </div>
                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-slate-800">Progreso Lento</span>
                                                <span className="text-amber-600 font-bold text-lg">~58%</span>
                                            </div>
                                            <div className="text-sm text-slate-600">Necesitan seguimiento cercano</div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8 text-slate-500">
                                        <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No hay estudiantes para monitorear</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-lg p-8 border border-blue-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                                    <Lightbulb className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-blue-800">Acciones Recomendadas</h3>
                            </div>
                            <div className="space-y-3">
                                {estadisticas.totalCursos === 0 ? (
                                    <div className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-3 rounded-xl">
                                        <Book className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-blue-700 text-sm">
                                            Crea tu primer curso para comenzar
                                        </span>
                                    </div>
                                ) : null}
                                {estadisticas.totalEvaluaciones === 0 ? (
                                    <div className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-3 rounded-xl">
                                        <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-blue-700 text-sm">
                                            Crea evaluaciones para tus cursos
                                        </span>
                                    </div>
                                ) : null}
                                {estadisticas.totalEstudiantes === 0 ? (
                                    <div className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-3 rounded-xl">
                                        <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-blue-700 text-sm">
                                            Inscribe estudiantes en tus cursos
                                        </span>
                                    </div>
                                ) : null}
                                {estadisticas.evaluacionesActivas > 0 && estadisticas.totalEstudiantes > 0 ? (
                                    <>
                                        <div className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-3 rounded-xl">
                                            <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-blue-700 text-sm">
                                                Revisar evaluaciones activas ({estadisticas.evaluacionesActivas})
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-3 rounded-xl">
                                            <ChartBar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-blue-700 text-sm">
                                                Monitorear progreso de {estadisticas.totalEstudiantes} estudiantes
                                            </span>
                                        </div>
                                    </>
                                ) : null}
                                {estadisticas.totalCursos > 0 && estadisticas.totalEvaluaciones > 0 && estadisticas.totalEstudiantes > 0 ? (
                                    <div className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-3 rounded-xl">
                                        <Award className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-blue-700 text-sm">
                                            Todo configurado correctamente ✨
                                        </span>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-slate-200">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800">Actividad Reciente</h3>
                                    <p className="text-slate-600 text-sm">Últimas actividades de los estudiantes</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/estudiantes')}
                                className="text-blue-600 hover:text-blue-700 text-sm font-bold transition-colors"
                            >
                                Ver Todo
                            </button>
                        </div>
                        
                        {classStats.recentActivities.length > 0 ? (
                            <div className="grid gap-4">
                                {classStats.recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl hover:shadow-md transition-all duration-300 border border-slate-200 cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-14 h-14 bg-white rounded-xl shadow-md">
                                                <GraduationCap className="w-7 h-7 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-lg">{activity.student}</div>
                                                <div className="text-sm text-slate-500">
                                                    {activity.action} - {activity.evaluacion || 'Sin evaluación'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className={`text-2xl font-bold ${getScoreColor(activity.score)}`}>
                                                    {activity.score}%
                                                </div>
                                                <div className="text-sm text-slate-500">{activity.time}</div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-slate-400" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-slate-50 rounded-2xl">
                                <Brain className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h4 className="text-lg font-semibold text-slate-600 mb-2">Sin actividad reciente</h4>
                                <p className="text-slate-500 text-sm">
                                    {estadisticas.totalEvaluaciones > 0 
                                        ? 'Las actividades de los estudiantes aparecerán aquí' 
                                        : 'Crea evaluaciones para empezar a monitorear la actividad'}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="text-center">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={() => navigate('/evaluaciones/profesor')}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                            >
                                <Brain className="w-5 h-5" />
                                {estadisticas.totalEvaluaciones === 0 ? 'Crear Primera Evaluación' : 'Gestionar Evaluaciones'}
                            </button>
                            <button 
                                onClick={() => navigate('/cursos/profesor')}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                            >
                                <Book className="w-5 h-5" />
                                {estadisticas.totalCursos === 0 ? 'Crear Primer Curso' : 'Gestionar Cursos'}
                            </button>
                            {estadisticas.totalEstudiantes > 0 && (
                                <button 
                                    onClick={() => navigate('/estudiantes')}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                >
                                    <Users className="w-5 h-5" />
                                    Ver Estudiantes
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardProfesor;