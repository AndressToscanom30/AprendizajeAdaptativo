import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Brain, 
    TrendingUp, 
    TrendingDown, 
    Target, 
    Clock,
    CheckCircle,
    AlertCircle,
    Sparkles,
    BookOpen,
    ArrowRight
} from 'lucide-react';

export default function AnalisisIA() {
    const navigate = useNavigate();
    const [analisis, setAnalisis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarAnalisis();
    }, []);

    // Reintenta automáticamente si no hay análisis (espera a que la IA termine)
    useEffect(() => {
        if (!loading && analisis.length === 0) {
            const timer = setTimeout(() => {
                cargarAnalisis();
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [loading, analisis.length]);

    const cargarAnalisis = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/ia/mis-analisis', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al cargar análisis');

            const data = await response.json();
            setAnalisis(data.analisis || []);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getNivelColor = (porcentaje) => {
        if (porcentaje >= 80) return 'text-green-600 bg-green-50';
        if (porcentaje >= 60) return 'text-blue-600 bg-blue-50';
        if (porcentaje >= 40) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const getNivelIcon = (porcentaje) => {
        if (porcentaje >= 80) return <CheckCircle className="text-green-600" size={24} />;
        if (porcentaje >= 60) return <Target className="text-blue-600" size={24} />;
        return <AlertCircle className="text-red-600" size={24} />;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Brain className="w-12 h-12 text-purple-600 animate-pulse mx-auto mb-4" />
                    <p className="text-gray-600">Cargando análisis IA...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-3">
                    <AlertCircle className="text-red-600" size={24} />
                    <div>
                        <h3 className="font-bold text-red-800">Error</h3>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (analisis.length === 0) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-3xl p-8 sm:p-12 text-center border-2 border-purple-200">
                    <div className="max-w-2xl mx-auto">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
                            <Brain className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
                            No hay análisis disponibles todavía
                        </h2>
                        <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed">
                            Los análisis con IA se generan automáticamente cuando completas una evaluación. 
                            ¡Completa tu primera evaluación para obtener recomendaciones personalizadas!
                        </p>
                        <button
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-300 transition-all duration-300 hover:-translate-y-1 flex items-center gap-3 mx-auto"
                            onClick={() => { setLoading(true); cargarAnalisis(); }}
                        >
                            <Sparkles size={24} />
                            <span>Recargar Análisis</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-6 sm:p-10 text-white shadow-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Brain size={40} className="sm:w-12 sm:h-12" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-bold mb-2">Análisis con IA</h1>
                            <p className="text-purple-100 text-sm sm:text-base">
                                Recomendaciones personalizadas basadas en tu desempeño
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => { setLoading(true); cargarAnalisis(); }}
                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all border border-white/40 flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                        <Sparkles size={20} />
                        <span>Actualizar</span>
                    </button>
                </div>
            </div>

            {/* Lista de Análisis */}
            <div className="space-y-8">
                {analisis.map((a) => (
                    <div key={a.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 hover:shadow-3xl transition-shadow duration-300">
                        {/* Header del Análisis */}
                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 sm:p-8 border-b border-slate-200">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 break-words">
                                        {a.evaluacionOriginal?.titulo || 'Evaluación'}
                                    </h3>
                                    <p className="text-slate-600 text-sm sm:text-base mb-4 leading-relaxed">
                                        {a.evaluacionOriginal?.descripcion}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                                        <span className="flex items-center gap-2 text-slate-500 bg-white px-3 py-1.5 rounded-lg">
                                            <Clock size={16} className="flex-shrink-0" />
                                            <span>{new Date(a.createdAt).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</span>
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Puntaje Global */}
                                <div className={`flex items-center gap-4 px-6 sm:px-8 py-5 rounded-2xl shadow-lg ${getNivelColor(a.porcentajeTotal)}`}>
                                    <div className="flex-shrink-0">
                                        {getNivelIcon(a.porcentajeTotal)}
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="text-4xl sm:text-5xl font-black">
                                            {a.porcentajeTotal}%
                                        </div>
                                        <div className="text-sm sm:text-base font-semibold mt-1">
                                            {a.puntuacionGlobal} puntos
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contenido del Análisis */}
                        <div className="p-6 sm:p-8">
                            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                                {/* Fortalezas */}
                                {a.fortalezas && a.fortalezas.length > 0 && (
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-md">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <TrendingUp className="text-white" size={22} />
                                            </div>
                                            <h4 className="font-bold text-green-800 text-lg sm:text-xl">Fortalezas</h4>
                                        </div>
                                        <ul className="space-y-3">
                                            {a.fortalezas.map((f, i) => (
                                                <li key={i} className="flex items-start gap-3 text-green-800">
                                                    <CheckCircle size={18} className="mt-0.5 flex-shrink-0 text-green-600" />
                                                    <span className="leading-relaxed">{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Debilidades */}
                                {a.debilidades && a.debilidades.length > 0 && (
                                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-200 shadow-md">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <TrendingDown className="text-white" size={22} />
                                            </div>
                                            <h4 className="font-bold text-red-800 text-lg sm:text-xl">Áreas a Mejorar</h4>
                                        </div>
                                        <ul className="space-y-3">
                                            {a.debilidades.map((d, i) => (
                                                <li key={i} className="flex items-start gap-3 text-red-800">
                                                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-600" />
                                                    <span className="leading-relaxed">{d}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Recomendaciones */}
                            {a.recomendaciones && a.recomendaciones.length > 0 && (
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-md">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Target className="text-white" size={22} />
                                        </div>
                                        <h4 className="font-bold text-blue-800 text-lg sm:text-xl">Recomendaciones Personalizadas</h4>
                                    </div>
                                    <ul className="space-y-4">
                                        {a.recomendaciones.map((r, i) => (
                                            <li key={i} className="flex items-start gap-4 text-blue-800">
                                                <span className="bg-blue-500 text-white font-bold rounded-full w-7 h-7 flex items-center justify-center text-sm flex-shrink-0 shadow-md">
                                                    {i + 1}
                                                </span>
                                                <span className="leading-relaxed flex-1">{r}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    {a.tiempoEstudioSugerido && (
                                        <div className="mt-6 pt-5 border-t-2 border-blue-200 flex items-center gap-3 text-blue-800">
                                            <Clock size={22} className="flex-shrink-0" />
                                            <span className="font-bold text-base">Tiempo sugerido: {a.tiempoEstudioSugerido}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Evaluación Adaptativa Generada */}
                        {a.evaluacionAdaptativa && (
                            <div className="p-6 sm:p-8 pt-0">
                                <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
                                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                                                <Sparkles size={28} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-xl sm:text-2xl mb-2">
                                                    ¡Test Adaptativo Generado!
                                                </h4>
                                                <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
                                                    La IA ha creado una evaluación personalizada para reforzar tus conocimientos
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/estudiante/evaluacion/${a.evaluacionAdaptativa.id}`)}
                                            className="bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-purple-50 transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full lg:w-auto"
                                        >
                                            <BookOpen size={22} />
                                            <span>Iniciar Test</span>
                                            <ArrowRight size={22} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
