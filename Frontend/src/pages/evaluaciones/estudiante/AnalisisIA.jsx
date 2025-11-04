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
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-12 text-center">
                <Brain className="w-20 h-20 text-purple-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Aún no hay análisis disponibles
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                    Si acabas de completar una evaluación, la IA está generando tu análisis en segundo plano.
                    Esto puede tomar unos segundos.
                </p>
                <button
                    onClick={() => { setLoading(true); cargarAnalisis(); }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                    <Brain size={48} />
                    <div>
                        <h1 className="text-3xl font-bold">Análisis con IA</h1>
                        <p className="text-purple-100">
                            Recomendaciones personalizadas basadas en tu desempeño
                        </p>
                    </div>
                </div>
            </div>

            {/* Lista de Análisis */}
            <div className="space-y-6">
                {analisis.map((a) => (
                    <div key={a.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        {/* Header del Análisis */}
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b border-gray-200">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {a.evaluacionOriginal?.titulo || 'Evaluación'}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        {a.evaluacionOriginal?.descripcion}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-gray-500">
                                            📅 {new Date(a.createdAt).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Puntaje Global */}
                                <div className={`flex items-center gap-3 px-6 py-4 rounded-xl ${getNivelColor(a.porcentajeTotal)}`}>
                                    {getNivelIcon(a.porcentajeTotal)}
                                    <div>
                                        <div className="text-3xl font-bold">
                                            {a.porcentajeTotal}%
                                        </div>
                                        <div className="text-sm font-medium">
                                            {a.puntuacionGlobal} pts
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contenido del Análisis */}
                        <div className="p-6 grid md:grid-cols-2 gap-6">
                            {/* Fortalezas */}
                            {a.fortalezas && a.fortalezas.length > 0 && (
                                <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <TrendingUp className="text-green-600" size={24} />
                                        <h4 className="font-bold text-green-800 text-lg">Fortalezas</h4>
                                    </div>
                                    <ul className="space-y-2">
                                        {a.fortalezas.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2 text-green-700">
                                                <CheckCircle size={16} className="mt-1 flex-shrink-0" />
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Debilidades */}
                            {a.debilidades && a.debilidades.length > 0 && (
                                <div className="bg-red-50 rounded-xl p-5 border-2 border-red-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <TrendingDown className="text-red-600" size={24} />
                                        <h4 className="font-bold text-red-800 text-lg">Áreas a Mejorar</h4>
                                    </div>
                                    <ul className="space-y-2">
                                        {a.debilidades.map((d, i) => (
                                            <li key={i} className="flex items-start gap-2 text-red-700">
                                                <AlertCircle size={16} className="mt-1 flex-shrink-0" />
                                                <span>{d}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Recomendaciones */}
                        {a.recomendaciones && a.recomendaciones.length > 0 && (
                            <div className="px-6 pb-6">
                                <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Target className="text-blue-600" size={24} />
                                        <h4 className="font-bold text-blue-800 text-lg">Recomendaciones Personalizadas</h4>
                                    </div>
                                    <ul className="space-y-3">
                                        {a.recomendaciones.map((r, i) => (
                                            <li key={i} className="flex items-start gap-3 text-blue-700">
                                                <span className="bg-blue-200 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">
                                                    {i + 1}
                                                </span>
                                                <span>{r}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    {a.tiempoEstudioSugerido && (
                                        <div className="mt-4 pt-4 border-t border-blue-200 flex items-center gap-2 text-blue-700">
                                            <Clock size={20} />
                                            <span className="font-semibold">Tiempo sugerido: {a.tiempoEstudioSugerido}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Evaluación Adaptativa Generada */}
                        {a.evaluacionAdaptativa && (
                            <div className="px-6 pb-6">
                                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Sparkles size={32} />
                                            <div>
                                                <h4 className="font-bold text-xl mb-1">
                                                    ¡Test Adaptativo Generado!
                                                </h4>
                                                <p className="text-purple-100">
                                                    La IA ha creado una evaluación personalizada para ti
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/estudiante/evaluacion/${a.evaluacionAdaptativa.id}`)}
                                            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-all flex items-center gap-2 shadow-lg"
                                        >
                                            <BookOpen size={20} />
                                            Iniciar Test
                                            <ArrowRight size={20} />
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
