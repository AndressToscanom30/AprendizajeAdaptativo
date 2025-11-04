import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Calendar, Users, Trophy, Loader2, AlertCircle, Edit, Trash2, Plus, X } from 'lucide-react';
import FormularioPregunta from '../../../components/evaluaciones/FormularioPregunta';

function DetalleEvaluacion() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [evaluacion, setEvaluacion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mostrarFormPregunta, setMostrarFormPregunta] = useState(false);
    const [preguntaEditando, setPreguntaEditando] = useState(null);

    useEffect(() => {
        cargarEvaluacion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const cargarEvaluacion = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:4000/api/evaluaciones/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Error al cargar la evaluación');
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

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de eliminar esta evaluación?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:4000/api/evaluaciones/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Error al eliminar');
            }

            navigate('/profesor/evaluaciones');
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar la evaluación');
        }
    };

    const handleEliminarPregunta = async (preguntaId) => {
        if (!confirm('¿Estás seguro de eliminar esta pregunta?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:4000/api/preguntas/${preguntaId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Error al eliminar pregunta');
            }

            // Recargar evaluación para actualizar lista de preguntas
            cargarEvaluacion();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar la pregunta');
        }
    };

    const handleEditarPregunta = (pregunta) => {
        setPreguntaEditando(pregunta);
        setMostrarFormPregunta(true);
    };

    const handleAgregarPregunta = () => {
        setPreguntaEditando(null);
        setMostrarFormPregunta(true);
    };

    const handleGuardarPregunta = async (preguntaData) => {
        try {
            const token = localStorage.getItem('token');
            const isEditing = !!preguntaEditando;
            const url = isEditing
                ? `http://localhost:4000/api/preguntas/${preguntaEditando.id}`
                : `http://localhost:4000/api/preguntas`;

            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...preguntaData,
                    evaluacion_id: id,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al guardar pregunta');
            }

            // Cerrar formulario y recargar
            setMostrarFormPregunta(false);
            setPreguntaEditando(null);
            cargarEvaluacion();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar la pregunta');
        }
    };

    const handleCancelarPregunta = () => {
        setMostrarFormPregunta(false);
        setPreguntaEditando(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Cargando evaluación...</p>
                </div>
            </div>
        );
    }

    if (error || !evaluacion) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-8 flex items-center justify-center">
                <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-8 max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                    <p className="text-red-700 font-semibold text-center">{error || 'Evaluación no encontrada'}</p>
                    <button
                        onClick={() => navigate('/profesor/evaluaciones')}
                        className="mt-4 w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Volver a Evaluaciones
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header con botón volver */}
                <button
                    onClick={() => navigate('/profesor/evaluaciones')}
                    className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver a Evaluaciones
                </button>

                {/* Card Principal */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-slate-800 mb-2">
                                    {evaluacion.titulo}
                                </h1>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        evaluacion.activa
                                            ? 'bg-green-100 text-green-700 border border-green-300'
                                            : 'bg-red-100 text-red-700 border border-red-300'
                                    }`}>
                                        {evaluacion.activa ? '✓ Activa' : '✗ Inactiva'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate(`/profesor/evaluaciones/editar/${id}`)}
                                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
                            >
                                <Edit className="w-4 h-4" />
                                Editar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
                            >
                                <Trash2 className="w-4 h-4" />
                                Eliminar
                            </button>
                        </div>
                    </div>

                    {/* Descripción */}
                    {evaluacion.descripcion && (
                        <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-slate-700 leading-relaxed">{evaluacion.descripcion}</p>
                        </div>
                    )}

                    {/* Grid de información */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium text-slate-600">Duración</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">{evaluacion.duracion_minutos} min</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Trophy className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium text-slate-600">Intentos Máx.</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600">{evaluacion.max_intentos}</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-5 h-5 text-purple-600" />
                                <span className="text-sm font-medium text-slate-600">Inicio</span>
                            </div>
                            <p className="text-lg font-bold text-purple-600">
                                {evaluacion.comienza_en 
                                    ? new Date(evaluacion.comienza_en).toLocaleDateString('es-ES')
                                    : 'No definida'}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-5 h-5 text-orange-600" />
                                <span className="text-sm font-medium text-slate-600">Fin</span>
                            </div>
                            <p className="text-lg font-bold text-orange-600">
                                {evaluacion.termina_en 
                                    ? new Date(evaluacion.termina_en).toLocaleDateString('es-ES')
                                    : 'No definida'}
                            </p>
                        </div>
                    </div>

                    {/* Preguntas */}
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl p-2 shadow-lg">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">
                                    Preguntas ({evaluacion.Preguntas?.length || 0})
                                </h2>
                            </div>
                            <button
                                onClick={handleAgregarPregunta}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
                            >
                                <Plus className="w-5 h-5" />
                                Agregar Pregunta
                            </button>
                        </div>

                        {/* Formulario de pregunta (agregar/editar) */}
                        {mostrarFormPregunta && (
                            <div className="mb-6 bg-blue-50 border-2 border-blue-300 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {preguntaEditando ? 'Editar Pregunta' : 'Nueva Pregunta'}
                                    </h3>
                                    <button
                                        onClick={handleCancelarPregunta}
                                        className="text-slate-600 hover:text-red-600 transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <FormularioPregunta
                                    preguntaInicial={preguntaEditando}
                                    onGuardar={handleGuardarPregunta}
                                    onCancelar={handleCancelarPregunta}
                                />
                            </div>
                        )}

                        {/* Lista de preguntas */}
                        {evaluacion.Preguntas && evaluacion.Preguntas.length > 0 ? (
                            <div className="space-y-3">
                                {evaluacion.Preguntas.map((pregunta, index) => (
                                    <div key={pregunta.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-blue-300 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-800">
                                                    {index + 1}. {pregunta.texto}
                                                </p>
                                                <p className="text-sm text-slate-600 mt-1">
                                                    Tipo: {pregunta.tipo} | Dificultad: {pregunta.dificultad} | Puntos: {pregunta.puntos}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    onClick={() => handleEditarPregunta(pregunta)}
                                                    className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                                                    title="Editar pregunta"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEliminarPregunta(pregunta.id)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                    title="Eliminar pregunta"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center">
                                <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                <p className="text-slate-600 font-medium mb-2">No hay preguntas aún</p>
                                <p className="text-sm text-slate-500">Haz clic en "Agregar Pregunta" para comenzar</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetalleEvaluacion;
