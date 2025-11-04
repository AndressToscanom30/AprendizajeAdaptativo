import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, Save, Loader2, AlertCircle, BookOpen, List } from 'lucide-react';

function EditarEvaluacionForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        duracion_minutos: '',
        max_intentos: '',
        comienza_en: '',
        termina_en: '',
        activa: true,
    });

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
            
            // Formatear fechas para input datetime-local (YYYY-MM-DDTHH:mm)
            const formatearFecha = (fecha) => {
                if (!fecha) return '';
                const date = new Date(fecha);
                // Ajustar a zona horaria local
                const offset = date.getTimezoneOffset();
                const localDate = new Date(date.getTime() - (offset * 60 * 1000));
                return localDate.toISOString().slice(0, 16);
            };

            setFormData({
                titulo: data.titulo || '',
                descripcion: data.descripcion || '',
                duracion_minutos: data.duracion_minutos || '',
                max_intentos: data.max_intentos || '',
                comienza_en: formatearFecha(data.comienza_en),
                termina_en: formatearFecha(data.termina_en),
                activa: data.activa !== undefined ? data.activa : true,
            });
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGuardando(true);

        try {
            const token = localStorage.getItem('token');
            const dataToSend = {
                ...formData,
                duracion_minutos: parseInt(formData.duracion_minutos),
                max_intentos: parseInt(formData.max_intentos),
                comienza_en: formData.comienza_en || null,
                termina_en: formData.termina_en || null,
                profesor_id: user.id,
            };

            const response = await fetch(
                `http://localhost:4000/api/evaluaciones/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend)
                }
            );

            if (!response.ok) {
                throw new Error('Error al actualizar la evaluación');
            }

            alert('✓ Evaluación actualizada exitosamente');
            navigate('/profesor/evaluaciones');
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar la evaluación: ' + error.message);
        } finally {
            setGuardando(false);
        }
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

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-8 flex items-center justify-center">
                <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-8 max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                    <p className="text-red-700 font-semibold text-center">{error}</p>
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
            <div className="max-w-4xl mx-auto">
                {/* Header con botón volver */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate('/profesor/evaluaciones')}
                        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver a Evaluaciones
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => navigate(`/profesor/evaluaciones/detalle/${id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md"
                    >
                        <List className="w-5 h-5" />
                        Gestionar Preguntas
                    </button>
                </div>

                {/* Card Principal */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-800">Editar Evaluación</h1>
                            <p className="text-slate-600 mt-1">Modifica los datos de la evaluación</p>
                        </div>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Título */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Título *
                            </label>
                            <input
                                type="text"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                placeholder="Ej: Evaluación Final de Matemáticas"
                            />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                                placeholder="Descripción detallada de la evaluación..."
                            />
                        </div>

                        {/* Grid de configuración */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Duración */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Duración (minutos) *
                                </label>
                                <input
                                    type="number"
                                    name="duracion_minutos"
                                    value={formData.duracion_minutos}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                    placeholder="60"
                                />
                            </div>

                            {/* Intentos máximos */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Intentos Máximos *
                                </label>
                                <input
                                    type="number"
                                    name="max_intentos"
                                    value={formData.max_intentos}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                    placeholder="3"
                                />
                            </div>

                            {/* Fecha inicio */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Fecha y Hora de Inicio
                                </label>
                                <input
                                    type="datetime-local"
                                    name="comienza_en"
                                    value={formData.comienza_en}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                />
                            </div>

                            {/* Fecha fin */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Fecha y Hora de Fin
                                </label>
                                <input
                                    type="datetime-local"
                                    name="termina_en"
                                    value={formData.termina_en}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Estado activa */}
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <input
                                type="checkbox"
                                id="activa"
                                name="activa"
                                checked={formData.activa}
                                onChange={handleChange}
                                className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-2 focus:ring-blue-500"
                            />
                            <label htmlFor="activa" className="text-sm font-semibold text-slate-700 cursor-pointer">
                                Evaluación activa (visible para estudiantes)
                            </label>
                        </div>

                        {/* Info sobre preguntas */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Nota:</strong> Para agregar, editar o eliminar preguntas, haz clic en el botón "Gestionar Preguntas" en la parte superior de esta página.
                            </p>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/profesor/evaluaciones')}
                                className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all duration-300 font-semibold"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={guardando}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {guardando ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Guardar Cambios
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditarEvaluacionForm;
