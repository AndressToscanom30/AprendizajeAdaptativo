import { useState, useEffect } from 'react';
import EvaluacionCardProf from "../../../components/evaluaciones/EvaluacionCardProf.jsx";
import { Search, PlusCircle, Filter, BookOpen, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";

function EvaluacionesProfesor() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [mensajeExito, setMensajeExito] = useState(null);

    // Mostrar mensaje de éxito si viene del state de navegación
    useEffect(() => {
        if (location.state?.mensaje) {
            setMensajeExito(location.state.mensaje);
            // Limpiar el state para evitar que se muestre de nuevo al recargar
            window.history.replaceState({}, document.title);
            
            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                setMensajeExito(null);
            }, 5000);
        }
    }, [location.state]);

    const cargarEvaluaciones = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(
                `http://localhost:4000/api/evaluaciones/profesor/${user.id}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const data = await response.json();
            console.log('Evaluaciones cargadas:', data);
            setEvaluaciones(data);
            setError(null);
        } catch (error) {
            console.error('Error al cargar evaluaciones:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            cargarEvaluaciones();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const handleDelete = async (id) => {
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

            setEvaluaciones(evaluaciones.filter(e => e.id !== id));
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('Error al eliminar la evaluación');
        }
    };

    const handleEdit = (id) => {
        navigate(`/profesor/evaluaciones/editar/${id}`);
    };

    const handleView = (id) => {
        navigate(`/profesor/evaluaciones/detalle/${id}`);
    };
    
    const handleActionAndNavigate = () => {
        navigate('/profesor/evaluaciones/crear');
    };

    const evaluacionesFiltradas = evaluaciones.filter(evaluacion => {
        const matchSearch = evaluacion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (evaluacion.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()));
        
        if (filterStatus === '') return matchSearch;
        if (filterStatus === 'activas') return matchSearch && evaluacion.activa;
        if (filterStatus === 'inactivas') return matchSearch && !evaluacion.activa;
        
        return matchSearch;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
                {/* Mensaje de éxito */}
                {mensajeExito && (
                    <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-4 shadow-lg animate-fade-in">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                            <p className="text-green-800 font-semibold">{mensajeExito}</p>
                            <button
                                onClick={() => setMensajeExito(null)}
                                className="ml-auto text-green-600 hover:text-green-800 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-800">
                                ¡Hola, {user?.nombre || 'Profesor'}!
                            </h1>
                            <p className="text-slate-600 text-lg mt-1">
                                Gestiona las evaluaciones y contenidos de tus estudiantes 📚
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🧠</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">
                                Mis Evaluaciones {!loading && `(${evaluacionesFiltradas.length})`}
                            </h2>
                        </div>

                        <button
                            onClick={handleActionAndNavigate}
                            type="button"
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-semibold"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Crear evaluación
                        </button>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar evaluaciones..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-slate-800 placeholder:text-slate-400"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full md:w-[220px] pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 transition-all appearance-none cursor-pointer"
                                aria-label="Filtrar evaluaciones"
                            >
                                <option value="">Todas las evaluaciones</option>
                                <option value="activas">Activas</option>
                                <option value="inactivas">Inactivas</option>
                            </select>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="text-center">
                                <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                                <p className="text-slate-600 font-medium">Cargando evaluaciones...</p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 text-center">
                            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                            <p className="text-red-700 font-semibold">{error}</p>
                            <button
                                onClick={cargarEvaluaciones}
                                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Reintentar
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && evaluacionesFiltradas.length === 0 && (
                        <div className="text-center py-20">
                            <div className="bg-gradient-to-br from-slate-100 to-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                <BookOpen className="w-12 h-12 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">
                                {searchTerm || filterStatus ? 'No se encontraron evaluaciones' : 'No hay evaluaciones aún'}
                            </h3>
                            <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                {searchTerm || filterStatus 
                                    ? 'Intenta con otros filtros o términos de búsqueda' 
                                    : 'Comienza creando tu primera evaluación'}
                            </p>
                            {!searchTerm && !filterStatus && (
                                <button
                                    onClick={handleActionAndNavigate}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-lg"
                                >
                                    <PlusCircle className="w-6 h-6" />
                                    Crear primera evaluación
                                </button>
                            )}
                        </div>
                    )}

                    {/* Evaluaciones Grid */}
                    {!loading && !error && evaluacionesFiltradas.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {evaluacionesFiltradas.map((evaluacion) => (
                                <EvaluacionCardProf
                                    key={evaluacion.id}
                                    evaluacion={{
                                        titulo: evaluacion.titulo,
                                        descripcion: evaluacion.descripcion,
                                        duracion: `${evaluacion.duracion_minutos} min`,
                                        fechaInicio: evaluacion.comienza_en ? new Date(evaluacion.comienza_en).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'N/A',
                                        fechaFin: evaluacion.termina_en ? new Date(evaluacion.termina_en).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'N/A',
                                        intentosMax: evaluacion.max_intentos,
                                        creador: user?.nombre || 'Profesor',
                                        activa: evaluacion.activa
                                    }}
                                    onEdit={() => handleEdit(evaluacion.id)}
                                    onDelete={() => handleDelete(evaluacion.id)}
                                    onView={() => handleView(evaluacion.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EvaluacionesProfesor;
