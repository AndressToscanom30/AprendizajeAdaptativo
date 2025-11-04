import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye, Edit, Trash2, BookOpen, Plus, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

function Evaluaciones() {
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const cargarEvaluaciones = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                console.log('Usuario autenticado:', user);
                
                const token = localStorage.getItem('token');
                
                if (!token) {
                    throw new Error('No hay token de autenticación');
                }

                console.log('Intentando cargar evaluaciones para:', user.id);
                
                const response = await fetch(
                    `http://localhost:4000/api/evaluaciones/profesor/${user.id}`, 
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        credentials: 'include'
                    }
                );

                console.log('Status de respuesta:', response.status);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('Error del servidor:', errorData);
                    throw new Error(`Error del servidor: ${response.status}`);
                }

                const data = await response.json();
                console.log('Evaluaciones cargadas:', data);
                setEvaluaciones(data);
                setError(null);

            } catch (error) {
                console.error('Error al cargar evaluaciones:', error);
                console.error('Error detallado:', error);
                setError(error.message || 'Error al cargar las evaluaciones. Por favor, intenta de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        cargarEvaluaciones();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
                    <p className="mt-4 text-slate-600 font-medium">Cargando evaluaciones...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-8 flex items-center justify-center">
                <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-8 max-w-md shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-red-100 rounded-full p-3">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-red-800">Error al cargar</h3>
                    </div>
                    <p className="text-red-700 mb-6">{error}</p>
                    <button 
                        onClick={() => globalThis.location.reload()} 
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-8">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 mb-8 transform transition-all duration-300 hover:shadow-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Mis Evaluaciones
                            </h2>
                            <p className="text-slate-600 mt-1">
                                {evaluaciones.length} {evaluaciones.length === 1 ? 'evaluación' : 'evaluaciones'} disponibles
                            </p>
                        </div>
                    </div>
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold">
                        <Plus className="w-5 h-5" />
                        Nueva Evaluación
                    </button>
                </div>
            </div>
            
            {evaluaciones.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 text-center transform transition-all duration-300 hover:shadow-2xl">
                    <div className="bg-gradient-to-br from-slate-100 to-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">No hay evaluaciones aún</h3>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        Comienza creando tu primera evaluación para tus estudiantes
                    </p>
                    <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-lg">
                        <Plus className="w-6 h-6" />
                        Crear mi primera evaluación
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {evaluaciones.map(evaluacion => (
                        <div 
                            key={evaluacion.id} 
                            className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                        >
                            {/* Header de la card */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-xl text-slate-800 mb-2 line-clamp-2">
                                        {evaluacion.titulo}
                                    </h3>
                                    {evaluacion.descripcion && (
                                        <p className="text-slate-600 text-sm line-clamp-2">
                                            {evaluacion.descripcion}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            {/* Badge de estado y fecha */}
                            <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-slate-100">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    evaluacion.activa
                                        ? 'bg-green-100 text-green-700 border border-green-300'
                                        : 'bg-red-100 text-red-700 border border-red-300'
                                }`}>
                                    {evaluacion.activa ? '✓ Activa' : '✗ Inactiva'}
                                </span>
                                
                                {evaluacion.fecha_creacion && (
                                    <span className="text-xs text-slate-500 font-medium">
                                        {new Date(evaluacion.fecha_creacion).toLocaleDateString('es-ES', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                )}
                            </div>
                            
                            {/* Botones de acción */}
                            <div className="flex gap-2">
                                <button 
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-semibold transform hover:-translate-y-0.5"
                                    title="Ver detalles"
                                >
                                    <Eye className="w-4 h-4" /> 
                                    Ver
                                </button>
                                <button 
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-semibold transform hover:-translate-y-0.5"
                                    title="Editar"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-semibold transform hover:-translate-y-0.5"
                                    title="Eliminar"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Evaluaciones;