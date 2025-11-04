import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
    ArrowLeft, 
    Clock, 
    Calendar, 
    User, 
    BookOpen, 
    TrendingUp,
    AlertCircle,
    CheckCircle,
    XCircle,
    PlayCircle,
    FileText,
    Target,
    Award,
    Eye
} from 'lucide-react';

function DetalleEvaluacionEstudiante() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [evaluacion, setEvaluacion] = useState(null);
    const [error, setError] = useState(null);
    const [iniciandoIntento, setIniciandoIntento] = useState(false);

    useEffect(() => {
        cargarDetalles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, location.key]); // Recargar cuando cambia la ruta (regresa de intento)

    // Recargar cuando se vuelva a esta página (por si completó un intento en otra pestaña)
    useEffect(() => {
        const handleFocus = () => {
            cargarDetalles();
        };
        
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const cargarDetalles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:4000/api/evaluaciones-usuarios/${id}/estudiante`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (!response.ok) {
                throw new Error('No se pudo cargar la evaluación');
            }

            const data = await response.json();
            setEvaluacion(data);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const iniciarIntento = async () => {
        if (iniciandoIntento) return; // Prevenir doble clic
        
        // Validación adicional en frontend
        if (!evaluacion.puede_realizar) {
            alert('No puedes iniciar un nuevo intento en este momento');
            return;
        }
        
        const intentosCompletados = evaluacion.intentos?.filter(
            i => i.status === 'enviado' || i.status === 'calificado' || i.status === 'revisado'
        ).length || 0;
        
        if (evaluacion.max_intentos && intentosCompletados >= evaluacion.max_intentos) {
            alert(`Has alcanzado el límite de intentos (${evaluacion.max_intentos})`);
            await cargarDetalles(); // Recargar datos por si están desactualizados
            return;
        }
        
        setIniciandoIntento(true);
        navigate(`/estudiante/evaluacion/${id}/intento`);
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return 'No especificado';
        return new Date(fecha).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calcularDiasRestantes = (fechaFin) => {
        if (!fechaFin) return null;
        const ahora = new Date();
        const fin = new Date(fechaFin);
        const diff = fin - ahora;
        const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return dias;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Cargando evaluación...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="text-red-500" size={24} />
                        <div>
                            <h3 className="font-semibold text-red-800">Error</h3>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/estudiante/evaluaciones')}
                    className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                    <ArrowLeft size={20} />
                    Volver a evaluaciones
                </button>
            </div>
        );
    }

    if (!evaluacion) return null;

    const diasRestantes = calcularDiasRestantes(evaluacion.evaluacion.termina_en);
    const mejorCalificacion = evaluacion.intentos_realizados.reduce(
        (max, intento) => Math.max(max, intento.total_puntaje || 0), 
        0
    );

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/estudiante/evaluaciones')}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Volver</span>
                </button>
            </div>

            {/* Card principal de la evaluación */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen size={28} />
                            <h1 className="text-3xl font-bold">{evaluacion.evaluacion.titulo}</h1>
                        </div>
                        <p className="text-blue-100 text-lg mb-4">
                            {evaluacion.evaluacion.descripcion || 'Sin descripción'}
                        </p>
                        <div className="flex items-center gap-2 text-blue-100">
                            <User size={18} />
                            <span>Profesor: {evaluacion.evaluacion.creator.nombre}</span>
                        </div>
                    </div>
                    
                    {evaluacion.puede_realizar && !evaluacion.tiempo_agotado && (
                        <button
                            onClick={iniciarIntento}
                            disabled={iniciandoIntento}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all transform shadow-lg flex items-center gap-2 ${
                                iniciandoIntento 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-white text-blue-600 hover:bg-blue-50 hover:scale-105'
                            }`}
                        >
                            <PlayCircle size={20} />
                            {iniciandoIntento ? 'Iniciando...' : 'Iniciar Intento'}
                        </button>
                    )}
                </div>

                {/* Alertas */}
                {evaluacion.tiempo_agotado && (
                    <div className="bg-red-500/20 border border-red-300 rounded-lg p-3 flex items-center gap-2">
                        <XCircle size={20} />
                        <span>El tiempo para realizar esta evaluación ha terminado</span>
                    </div>
                )}
                {!evaluacion.puede_realizar && !evaluacion.tiempo_agotado && (
                    <div className="bg-yellow-500/20 border border-yellow-300 rounded-lg p-3 flex items-center gap-2">
                        <AlertCircle size={20} />
                        <span>Has alcanzado el número máximo de intentos</span>
                    </div>
                )}
            </div>

            {/* Grid de información */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Duración */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Clock className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Duración</p>
                            <p className="text-2xl font-bold text-slate-800">
                                {evaluacion.evaluacion.duracion_minutos} min
                            </p>
                        </div>
                    </div>
                </div>

                {/* Intentos */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Target className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Intentos</p>
                            <p className="text-2xl font-bold text-slate-800">
                                {evaluacion.intentos_realizados.length} / {evaluacion.evaluacion.max_intentos}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mejor calificación */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Award className="text-green-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Mejor Nota</p>
                            <p className="text-2xl font-bold text-slate-800">
                                {mejorCalificacion > 0 ? `${mejorCalificacion.toFixed(1)}` : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Días restantes */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Calendar className="text-orange-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Tiempo Restante</p>
                            <p className="text-2xl font-bold text-slate-800">
                                {diasRestantes !== null ? (
                                    diasRestantes > 0 ? `${diasRestantes} días` : 'Vencido'
                                ) : 'Sin límite'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fechas */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Calendar size={24} className="text-blue-600" />
                    Fechas Importantes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Fecha de Inicio</p>
                        <p className="text-slate-800">{formatearFecha(evaluacion.evaluacion.comienza_en)}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Fecha de Fin</p>
                        <p className="text-slate-800">{formatearFecha(evaluacion.evaluacion.termina_en)}</p>
                    </div>
                </div>
            </div>

            {/* Historial de intentos */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText size={24} className="text-purple-600" />
                    Historial de Intentos
                </h2>
                
                {evaluacion.intentos_realizados.length > 0 ? (
                    <div className="space-y-3">
                        {evaluacion.intentos_realizados.map((intento, index) => (
                            <div 
                                key={intento.id} 
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full font-bold">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">
                                            Intento #{index + 1}
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            {formatearFecha(intento.iniciado_en)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {intento.status === 'enviado' || intento.status === 'calificado' || intento.status === 'revisado' ? (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="text-green-500" size={20} />
                                                <span className="text-sm text-slate-600">Completado</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-slate-800">
                                                    {intento.total_puntaje?.toFixed(1) || '0.0'}
                                                    {evaluacion.puntaje_total ? (
                                                        <span className="text-base text-slate-500 font-normal ml-1">
                                                            / {evaluacion.puntaje_total.toFixed(1)}
                                                        </span>
                                                    ) : null}
                                                </p>
                                                <p className="text-xs text-slate-500">puntos</p>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/estudiante/intento/${intento.id}/revision`)}
                                                className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-medium text-sm"
                                            >
                                                <Eye size={16} />
                                                Ver Respuestas
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2 text-yellow-600">
                                            <AlertCircle size={20} />
                                            <span className="text-sm font-medium">En progreso</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                            <FileText className="text-slate-400" size={32} />
                        </div>
                        <p className="text-slate-600 font-medium">No has realizado ningún intento aún</p>
                        <p className="text-slate-500 text-sm mt-2">
                            Haz clic en &quot;Iniciar Intento&quot; para comenzar
                        </p>
                    </div>
                )}
            </div>

            {/* Botón de acción inferior */}
            {evaluacion.puede_realizar && !evaluacion.tiempo_agotado && (
                <div className="flex justify-center">
                    <button
                        onClick={iniciarIntento}
                        disabled={iniciandoIntento}
                        className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform shadow-xl flex items-center gap-3 ${
                            iniciandoIntento
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105'
                        }`}
                    >
                        <PlayCircle size={24} />
                        {iniciandoIntento ? 'Iniciando Intento...' : 'Iniciar Nuevo Intento'}
                        {!iniciandoIntento && evaluacion.intentos_restantes !== undefined && (
                            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                                {evaluacion.intentos_restantes} restante{evaluacion.intentos_restantes !== 1 ? 's' : ''}
                            </span>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

export default DetalleEvaluacionEstudiante;
