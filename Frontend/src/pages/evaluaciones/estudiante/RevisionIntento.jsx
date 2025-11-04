import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    CheckCircle, 
    XCircle, 
    AlertCircle,
    Eye,
    Code,
    Lightbulb
} from 'lucide-react';
import StudentLayout from '../../../components/StudentLayout';

function RevisionIntento() {
    const { intentoId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [intento, setIntento] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarIntento();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [intentoId]);

    const cargarIntento = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4000/api/intentos/${intentoId}/detalles`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('No se pudo cargar el intento');
            }

            const data = await response.json();
            console.log('Intento cargado:', data);
            setIntento(data);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderRespuesta = (pregunta, respuesta) => {
        // Opción Múltiple o Verdadero/Falso
        if (pregunta.tipo === 'opcion_multiple' || pregunta.tipo === 'verdadero_falso') {
            const opcionSeleccionada = pregunta.opciones?.find(op => op.id === respuesta.opcion_seleccionadaId);
            const opcionCorrecta = pregunta.opciones?.find(op => op.es_correcta);

            return (
                <div className="space-y-3">
                    {pregunta.opciones?.map(opcion => (
                        <div 
                            key={opcion.id}
                            className={`p-4 rounded-lg border-2 ${
                                opcion.es_correcta
                                    ? 'bg-green-50 border-green-500'
                                    : opcion.id === opcionSeleccionada?.id && !opcion.es_correcta
                                    ? 'bg-red-50 border-red-500'
                                    : 'bg-slate-50 border-slate-200'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-slate-800">{opcion.texto}</span>
                                <div className="flex items-center gap-2">
                                    {opcion.es_correcta && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                            Correcta
                                        </span>
                                    )}
                                    {opcion.id === opcionSeleccionada?.id && (
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                            Tu respuesta
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // Selección Múltiple
        if (pregunta.tipo === 'seleccion_multiple') {
            const opcionesSeleccionadas = respuesta.opcion_seleccionadaIds || [];
            const opcionesCorrectas = pregunta.opciones?.filter(op => op.es_correcta).map(op => op.id) || [];

            return (
                <div className="space-y-3">
                    {pregunta.opciones?.map(opcion => (
                        <div 
                            key={opcion.id}
                            className={`p-4 rounded-lg border-2 ${
                                opcion.es_correcta
                                    ? 'bg-green-50 border-green-500'
                                    : opcionesSeleccionadas.includes(opcion.id) && !opcion.es_correcta
                                    ? 'bg-red-50 border-red-500'
                                    : 'bg-slate-50 border-slate-200'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-slate-800">{opcion.texto}</span>
                                <div className="flex items-center gap-2">
                                    {opcion.es_correcta && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                            Correcta
                                        </span>
                                    )}
                                    {opcionesSeleccionadas.includes(opcion.id) && (
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                            Seleccionaste
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // Respuesta de Texto
        if (pregunta.tipo === 'respuesta_corta' || pregunta.tipo === 'respuesta_larga') {
            const respuestaCorrecta = pregunta.opciones?.[0]?.texto || 'No hay respuesta modelo';

            return (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Tu respuesta:</label>
                        <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                            <p className="text-slate-800 whitespace-pre-wrap">{respuesta.texto_respuesta || 'Sin respuesta'}</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-600" />
                            Respuesta modelo:
                        </label>
                        <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                            <p className="text-slate-800 whitespace-pre-wrap">{respuestaCorrecta}</p>
                        </div>
                    </div>
                </div>
            );
        }

        // Pregunta de Código
        if (pregunta.tipo === 'codigo') {
            const metadata = pregunta.opciones?.[0]?.metadata || {};
            const solucion = metadata.solucion || 'No hay solución disponible';
            const salidaEsperada = metadata.salida_esperada || '';
            const pistas = metadata.pistas || [];

            return (
                <div className="space-y-4">
                    {/* Tu código */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Code className="w-4 h-4 text-blue-600" />
                            Tu código:
                        </label>
                        <div className="bg-slate-900 rounded-lg overflow-hidden border-2 border-slate-700">
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <pre className="p-4 text-blue-400 font-mono text-sm overflow-x-auto">
                                {respuesta.codigo || '// Sin código'}
                            </pre>
                        </div>
                    </div>

                    {/* Output */}
                    {respuesta.salida_codigo && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Tu salida:</label>
                            <div className={`rounded-lg overflow-hidden border-2 ${
                                respuesta.es_correcta ? 'border-green-500' : 'border-red-500'
                            }`}>
                                <div className={`px-4 py-2 ${
                                    respuesta.es_correcta ? 'bg-green-900/30' : 'bg-red-900/30'
                                } border-b ${
                                    respuesta.es_correcta ? 'border-green-700' : 'border-red-700'
                                }`}>
                                    {respuesta.es_correcta ? (
                                        <span className="text-green-400 text-sm font-medium flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            ¡Correcto!
                                        </span>
                                    ) : (
                                        <span className="text-red-400 text-sm font-medium flex items-center gap-2">
                                            <XCircle className="w-4 h-4" />
                                            Incorrecto
                                        </span>
                                    )}
                                </div>
                                <pre className={`p-4 font-mono text-sm overflow-x-auto ${
                                    respuesta.es_correcta ? 'text-green-400 bg-slate-900' : 'text-red-400 bg-slate-900'
                                }`}>
                                    {respuesta.salida_codigo}
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* Salida esperada */}
                    {salidaEsperada && !respuesta.es_correcta && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Salida esperada:</label>
                            <div className="bg-slate-100 border-2 border-slate-300 rounded-lg p-4">
                                <pre className="text-sm text-slate-800 font-mono">{salidaEsperada}</pre>
                            </div>
                        </div>
                    )}

                    {/* Solución */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Eye className="w-4 h-4 text-emerald-600" />
                            Solución:
                        </label>
                        <div className="bg-slate-900 rounded-lg overflow-hidden border-2 border-emerald-700">
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <span className="text-emerald-400 text-sm font-medium">Código correcto</span>
                            </div>
                            <pre className="p-4 text-emerald-400 font-mono text-sm overflow-x-auto">
                                {solucion}
                            </pre>
                        </div>
                    </div>

                    {/* Pistas */}
                    {pistas.length > 0 && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-amber-600" />
                                Pistas:
                            </label>
                            <div className="space-y-2">
                                {pistas.map((pista, index) => (
                                    <div key={index} className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
                                        <p className="text-sm text-amber-900"><strong>Pista {index + 1}:</strong> {pista}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return <p className="text-slate-600">Tipo de pregunta no soportado</p>;
    };

    if (loading) {
        return (
            <StudentLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-slate-600">Cargando revisión...</p>
                    </div>
                </div>
            </StudentLayout>
        );
    }

    if (error || !intento) {
        return (
            <StudentLayout>
                <div className="max-w-4xl mx-auto p-6">
                    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-red-500" size={28} />
                            <div>
                                <h3 className="font-bold text-red-800 text-xl">Error</h3>
                                <p className="text-red-700">{error || 'No se pudo cargar el intento'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </StudentLayout>
        );
    }

    return (
        <StudentLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4"
                    >
                        <ArrowLeft size={20} />
                        Volver
                    </button>
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-slate-200">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            Revisión de Intento
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
                            <span>Evaluación: {intento.evaluacion?.titulo || 'Sin título'}</span>
                            <span>•</span>
                            <span>Puntaje: <strong className="text-blue-600">{intento.total_puntaje?.toFixed(1) || '0.0'}</strong></span>
                        </div>
                        
                        {/* Estadísticas del intento */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t-2 border-slate-100">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                                <p className="text-sm text-slate-600 mb-1">Preguntas</p>
                                <p className="text-2xl font-bold text-blue-700">
                                    {intento.evaluacion?.Preguntas?.length || 0}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                                <p className="text-sm text-slate-600 mb-1">Respuestas Correctas</p>
                                <p className="text-2xl font-bold text-green-700">
                                    {intento.respuestas?.filter(r => r.es_correcta === true).length || 0}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4">
                                <p className="text-sm text-slate-600 mb-1">Puntaje Total</p>
                                <p className="text-2xl font-bold text-purple-700">
                                    {intento.total_puntaje?.toFixed(1) || '0.0'} / {
                                        intento.evaluacion?.Preguntas?.reduce((sum, p) => sum + (p.PreguntaEvaluacion?.puntos || 1), 0).toFixed(1) || '0.0'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preguntas y Respuestas */}
                <div className="space-y-6">
                    {intento.evaluacion?.Preguntas?.map((pregunta, index) => {
                        const respuesta = intento.respuestas?.find(r => r.preguntaId === pregunta.id) || {};
                        const puntosObtenidos = respuesta.puntos_obtenidos || 0;
                        const puntosMaximos = pregunta.PreguntaEvaluacion?.puntos || 1;

                        return (
                            <div key={pregunta.id} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-slate-200">
                                {/* Header de pregunta */}
                                <div className="flex items-start justify-between mb-4 pb-4 border-b-2 border-slate-100">
                                    <div className="flex gap-3 flex-1">
                                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full font-bold text-lg flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-lg font-semibold text-slate-800">{pregunta.texto}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                                                    {pregunta.tipo.replace(/_/g, ' ')}
                                                </span>
                                                <span className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${
                                                    puntosObtenidos >= puntosMaximos 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : puntosObtenidos > 0
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {puntosObtenidos >= puntosMaximos ? (
                                                        <CheckCircle size={12} />
                                                    ) : (
                                                        <XCircle size={12} />
                                                    )}
                                                    {puntosObtenidos.toFixed(1)} / {puntosMaximos} pts
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Respuesta */}
                                <div className="mt-4">
                                    {renderRespuesta(pregunta, respuesta)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </StudentLayout>
    );
}

export default RevisionIntento;
