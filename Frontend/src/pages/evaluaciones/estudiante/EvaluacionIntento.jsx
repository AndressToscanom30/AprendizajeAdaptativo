import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Clock, 
    Send,
    AlertCircle,
    CheckCircle2,
    Loader2,
    BookOpen
} from 'lucide-react';
import StudentLayout from '../../../components/StudentLayout';
import { useSidebar } from '../../../context/SidebarContext';
import PreguntaCodigoIntento from '../../../components/evaluaciones/PreguntaCodigoIntento';

function EvaluacionIntento() {
    const { id } = useParams(); // evaluacionId
    const navigate = useNavigate();
    const { sidebarCollapsed } = useSidebar();
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [evaluacion, setEvaluacion] = useState(null);
    const [intentoId, setIntentoId] = useState(null);
    const [respuestas, setRespuestas] = useState({});
    const [tiempoRestante, setTiempoRestante] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        iniciarEvaluacion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Temporizador
    useEffect(() => {
        if (tiempoRestante === null || tiempoRestante <= 0) return;

        const timer = setInterval(() => {
            setTiempoRestante(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    enviarRespuestas(); // Auto-enviar cuando se acabe el tiempo
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tiempoRestante]);

    const iniciarEvaluacion = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // 1. Obtener datos de la evaluación
            const evalResponse = await fetch(
                `http://localhost:4000/api/evaluaciones/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (!evalResponse.ok) {
                throw new Error('No se pudo cargar la evaluación');
            }

            const evalData = await evalResponse.json();
            console.log('Evaluación cargada:', evalData);
            console.log('Preguntas:', evalData.Preguntas);
            setEvaluacion(evalData);

            // 2. Iniciar intento
            const intentoResponse = await fetch(
                `http://localhost:4000/api/intentos/evaluacion/${id}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (!intentoResponse.ok) {
                const errorData = await intentoResponse.json();
                throw new Error(errorData.message || 'No se pudo iniciar el intento');
            }

            const intentoData = await intentoResponse.json();
            setIntentoId(intentoData.id);

            // 3. Configurar temporizador
            if (evalData.duracion_minutos) {
                setTiempoRestante(evalData.duracion_minutos * 60);
            }

            // 4. Inicializar respuestas vacías
            const respuestasIniciales = {};
            evalData.Preguntas?.forEach(pregunta => {
                respuestasIniciales[pregunta.id] = {
                    preguntaId: pregunta.id,
                    tipo: pregunta.tipo,
                    opcionSeleccionadaId: null,
                    opcion_seleccionadaIds: [],
                    texto_respuesta: '',
                    relacion_par: []
                };
            });
            setRespuestas(respuestasIniciales);

        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRespuesta = (preguntaId, tipo, valor) => {
        setRespuestas(prev => ({
            ...prev,
            [preguntaId]: {
                ...prev[preguntaId],
                tipo: tipo,
                ...(tipo === 'opcion_multiple' || tipo === 'verdadero_falso' 
                    ? { opcionSeleccionadaId: valor }
                    : tipo === 'seleccion_multiple'
                    ? { opcion_seleccionadaIds: valor }
                    : tipo === 'respuesta_corta' || tipo === 'respuesta_larga'
                    ? { texto_respuesta: valor }
                    : tipo === 'codigo'
                    ? (
                        // Si valor es un string (UUID), es una opción seleccionada (pregunta de código con opciones)
                        typeof valor === 'string' 
                        ? { opcionSeleccionadaId: valor }
                        // Si valor es un objeto, es código escrito (pregunta de código con editor)
                        : { codigo: valor.codigo, salida_codigo: valor.output }
                    )
                    : { relacion_par: valor }
                )
            }
        }));
    };

    const enviarRespuestas = async () => {
        if (!intentoId) {
            alert('No se pudo identificar el intento');
            return;
        }

        // Validar que todas las preguntas estén respondidas
        const totalPreguntas = evaluacion.Preguntas?.length || 0;
        const respondidas = contarRespondidas();
        
        if (respondidas < totalPreguntas) {
            alert(`⚠️ Debes responder todas las preguntas antes de enviar.\n\nRespondidas: ${respondidas}/${totalPreguntas}\nFaltan: ${totalPreguntas - respondidas} pregunta(s)`);
            return;
        }

        if (!confirm('¿Estás seguro de enviar tus respuestas? No podrás modificarlas después.')) {
            return;
        }

        setEnviando(true);

        try {
            const token = localStorage.getItem('token');
            const respuestasArray = Object.values(respuestas);

            
            

            const response = await fetch(
                `http://localhost:4000/api/intentos/${intentoId}/submit`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ respuestas: respuestasArray })
                }
            );

            

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ Error del servidor:', errorData);
                throw new Error(errorData.message || 'Error al enviar respuestas');
            }

            const resultado = await response.json();
            
            
            // Navegar al curso si existe, sino a evaluaciones
            if (evaluacion.curso_id) {
                navigate(`/estudiante/cursos/${evaluacion.curso_id}`, { 
                    state: { 
                        evaluacionCompletada: true,
                        mensaje: `¡Evaluación completada! Puntaje: ${resultado.totalScore}`,
                        exito: true 
                    }
                });
            } else {
                navigate(`/estudiante/evaluacion/${id}`, { 
                    state: { 
                        mensaje: `¡Evaluación completada! Puntaje: ${resultado.totalScore}`,
                        exito: true 
                    }
                });
            }

        } catch (error) {
            console.error('💥 Error:', error);
            alert('Error al enviar las respuestas: ' + error.message);
        } finally {
            setEnviando(false);
        }
    };

    const formatearTiempo = (segundos) => {
        const mins = Math.floor(segundos / 60);
        const secs = segundos % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const contarRespondidas = () => {
        return Object.values(respuestas).filter(r => {
            if (r.tipo === 'opcion_multiple' || r.tipo === 'verdadero_falso') {
                return r.opcionSeleccionadaId !== null;
            } else if (r.tipo === 'seleccion_multiple') {
                return r.opcion_seleccionadaIds?.length > 0;
            } else if (r.tipo === 'respuesta_corta' || r.tipo === 'respuesta_larga') {
                return r.texto_respuesta?.trim() !== '';
            } else if (r.tipo === 'codigo') {
                // Si tiene código escrito, es pregunta de editor (del profesor)
                if (r.codigo !== undefined && r.codigo !== null) {
                    return r.codigo.trim() !== '';
                }
                // Si tiene opcionSeleccionadaId, es pregunta de código con opciones (generada por IA)
                if (r.opcionSeleccionadaId !== undefined && r.opcionSeleccionadaId !== null) {
                    return true;
                }
                return false;
            }
            return false;
        }).length;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
                    <p className="text-slate-600 text-lg">Iniciando evaluación...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="text-red-500" size={28} />
                        <div>
                            <h3 className="font-bold text-red-800 text-xl">Error</h3>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(`/estudiante/evaluacion/${id}`)}
                        className="flex items-center gap-2 text-red-700 hover:text-red-800 font-semibold"
                    >
                        <ArrowLeft size={20} />
                        Volver a detalles
                    </button>
                </div>
            </div>
        );
    }

    if (!evaluacion) return null;

    const totalPreguntas = evaluacion.Preguntas?.length || 0;
    const respondidas = contarRespondidas();

    return (
        <StudentLayout>
            {/* Navbar Simple con Temporizador - Fijo arriba */}
            <div className="bg-white shadow-md border-b border-slate-200 sticky top-0 z-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <BookOpen size={28} className="text-blue-600 flex-shrink-0" />
                            <div>
                                <h1 className="text-lg sm:text-xl font-bold text-slate-800">Realizando Evaluación</h1>
                                <p className="text-xs text-slate-600">{evaluacion.titulo}</p>
                            </div>
                        </div>
                        {tiempoRestante !== null && (
                            <div className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg font-bold text-base sm:text-lg ${
                                tiempoRestante < 300 
                                    ? 'bg-red-100 text-red-700 animate-pulse' 
                                    : 'bg-blue-100 text-blue-700'
                            }`}>
                                <Clock size={20} className="flex-shrink-0" />
                                <span>{formatearTiempo(tiempoRestante)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-32">
                {/* Header de Evaluación */}
                <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <button
                                onClick={() => {
                                    if (confirm('¿Seguro que quieres salir? Perderás tu progreso.')) {
                                        navigate(`/estudiante/evaluacion/${id}`);
                                    }
                                }}
                                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} className="flex-shrink-0" />
                                <span className="font-medium">Salir</span>
                            </button>
                            <div className="sm:border-l sm:border-slate-300 sm:pl-4">
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                                    {evaluacion.titulo}
                                </h2>
                                <p className="text-sm text-slate-600 mt-1">
                                    {respondidas} de {totalPreguntas} preguntas respondidas
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={enviarRespuestas}
                            disabled={enviando}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            {enviando ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Enviando...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    <span>Enviar</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Barra de progreso */}
                    <div className="mt-6">
                        <div className="w-full bg-slate-200 rounded-full h-3">
                            <div 
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${(respondidas / totalPreguntas) * 100}%` }}
                            />
                        </div>
                        <p className="text-sm text-slate-600 mt-2 text-center">
                            Progreso: {Math.round((respondidas / totalPreguntas) * 100)}%
                        </p>
                    </div>
                </div>

                {/* Preguntas */}
                <div className="space-y-6">
                    {evaluacion.Preguntas?.map((pregunta, index) => (
                        <div key={pregunta.id} className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-slate-200">
                            {/* Header de pregunta */}
                            <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
                                <div className="flex gap-3 flex-1 w-full">
                                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full font-bold text-lg flex-shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed break-words">{pregunta.texto}</p>
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3">
                                            <span className="text-xs sm:text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                                                {pregunta.tipo.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs sm:text-sm text-slate-600">
                                                {pregunta.PreguntaEvaluacion?.puntos || 1} {pregunta.PreguntaEvaluacion?.puntos === 1 ? 'punto' : 'puntos'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Opciones según tipo */}
                            <div className="mt-6 space-y-3">
                                {/* Pregunta de Código CON OPCIONES (generada por IA) */}
                                {pregunta.tipo === 'codigo' && pregunta.codigo && pregunta.opciones && pregunta.opciones.length > 0 && pregunta.opciones[0]?.texto && (
                                    <div className="space-y-4">
                                        {/* Mostrar el código a analizar */}
                                        <div>
                                            <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                                <span className="text-blue-600">📝</span>
                                                Código a Analizar
                                            </label>
                                            <div className="bg-slate-900 rounded-lg overflow-hidden border-2 border-blue-500">
                                                <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                    </div>
                                                    <span className="text-slate-400 text-sm font-mono">javascript</span>
                                                </div>
                                                <pre className="p-4 text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                                                    {pregunta.codigo}
                                                </pre>
                                            </div>
                                        </div>

                                        {/* Opciones de respuesta */}
                                        <div>
                                            <label className="text-sm font-semibold text-slate-700 mb-2 block">
                                                Selecciona tu respuesta:
                                            </label>
                                            <div className="space-y-3">
                                                {pregunta.opciones.map(opcion => (
                                                    <label 
                                                        key={opcion.id}
                                                        className={`flex items-start sm:items-center gap-3 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                            respuestas[pregunta.id]?.opcionSeleccionadaId === opcion.id
                                                                ? 'border-blue-500 bg-blue-50'
                                                                : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`pregunta-${pregunta.id}`}
                                                            value={opcion.id}
                                                            checked={respuestas[pregunta.id]?.opcionSeleccionadaId === opcion.id}
                                                            onChange={() => handleRespuesta(pregunta.id, pregunta.tipo, opcion.id)}
                                                            className="w-5 h-5 text-blue-600 mt-0.5"
                                                        />
                                                        <span className="text-slate-800">{opcion.texto}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Pregunta de Código CON EDITOR (creada por profesor) */}
                                {pregunta.tipo === 'codigo' && pregunta.opciones && pregunta.opciones.length > 0 && pregunta.opciones[0]?.metadata && (
                                    <PreguntaCodigoIntento 
                                        pregunta={pregunta}
                                        respuesta={respuestas[pregunta.id] || {}}
                                        onChange={(data) => handleRespuesta(pregunta.id, pregunta.tipo, data)}
                                    />
                                )}

                                {/* Opción Múltiple o Verdadero/Falso */}
                                {(pregunta.tipo === 'opcion_multiple' || pregunta.tipo === 'verdadero_falso') && (
                                    <div className="space-y-3">
                                        {pregunta.opciones?.map(opcion => (
                                            <label 
                                                key={opcion.id}
                                                className={`flex items-start sm:items-center gap-3 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                    respuestas[pregunta.id]?.opcionSeleccionadaId === opcion.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                                                }`}
                                            >
                                            <input
                                                type="radio"
                                                name={`pregunta-${pregunta.id}`}
                                                value={opcion.id}
                                                checked={respuestas[pregunta.id]?.opcionSeleccionadaId === opcion.id}
                                                onChange={() => handleRespuesta(pregunta.id, pregunta.tipo, opcion.id)}
                                                className="w-5 h-5 text-blue-600"
                                            />
                                            <span className="text-slate-800">{opcion.texto}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {/* Selección Múltiple */}
                            {pregunta.tipo === 'seleccion_multiple' && (
                                <div className="space-y-2">
                                    {pregunta.opciones?.map(opcion => (
                                        <label 
                                            key={opcion.id}
                                            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                respuestas[pregunta.id]?.opcion_seleccionadaIds?.includes(opcion.id)
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                value={opcion.id}
                                                checked={respuestas[pregunta.id]?.opcion_seleccionadaIds?.includes(opcion.id)}
                                                onChange={(e) => {
                                                    const currentIds = respuestas[pregunta.id]?.opcion_seleccionadaIds || [];
                                                    const newIds = e.target.checked
                                                        ? [...currentIds, opcion.id]
                                                        : currentIds.filter(id => id !== opcion.id);
                                                    handleRespuesta(pregunta.id, pregunta.tipo, newIds);
                                                }}
                                                className="w-5 h-5 text-blue-600 rounded"
                                            />
                                            <span className="text-slate-800">{opcion.texto}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {/* Respuesta Corta */}
                            {pregunta.tipo === 'respuesta_corta' && (
                                <input
                                    type="text"
                                    value={respuestas[pregunta.id]?.texto_respuesta || ''}
                                    onChange={(e) => handleRespuesta(pregunta.id, pregunta.tipo, e.target.value)}
                                    placeholder="Escribe tu respuesta aquí..."
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                />
                            )}

                            {/* Respuesta Larga */}
                            {pregunta.tipo === 'respuesta_larga' && (
                                <textarea
                                    value={respuestas[pregunta.id]?.texto_respuesta || ''}
                                    onChange={(e) => handleRespuesta(pregunta.id, pregunta.tipo, e.target.value)}
                                    placeholder="Escribe tu respuesta aquí..."
                                    rows={5}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {/* Fin del contenido principal */}
            </div>

            {/* Botón de envío fijo abajo - FUERA del contenido principal */}
            {/* Footer con progreso y botón de envío - Adaptado al sidebar */}
            <div className={`fixed bottom-0 left-0 right-0 ${sidebarCollapsed ? 'lg:left-20' : 'lg:left-72'} bg-white border-t-2 border-slate-200 shadow-2xl p-4 z-30 transition-all duration-300`}>
                <div className="flex items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-green-600" size={24} />
                        <span className="font-semibold text-slate-700">
                            {respondidas} de {totalPreguntas} preguntas respondidas
                        </span>
                    </div>
                    <button
                        onClick={enviarRespuestas}
                        disabled={enviando}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                    >
                        {enviando ? (
                            <>
                                <Loader2 className="animate-spin" size={24} />
                                Enviando...
                            </>
                        ) : (
                            <>
                                <Send size={24} />
                                Finalizar y Enviar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </StudentLayout>
    );
}

export default EvaluacionIntento;
