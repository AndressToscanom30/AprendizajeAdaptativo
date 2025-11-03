import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

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
                        credentials: 'include' // Incluir cookies si las usas
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
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Mis Evaluaciones ({evaluaciones.length})</h2>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    + Nueva Evaluación
                </button>
            </div>
            
            {evaluaciones.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No has creado evaluaciones aún</p>
                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Crear mi primera evaluación
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {evaluaciones.map(evaluacion => (
                        <div key={evaluacion.id} className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="font-semibold text-lg mb-2">{evaluacion.titulo}</h3>
                            
                            {evaluacion.descripcion && (
                                <p className="text-gray-600 text-sm mb-3">{evaluacion.descripcion}</p>
                            )}
                            
                            <div className="flex items-center justify-between mb-3">
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                    evaluacion.activa
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {evaluacion.activa ? 'Activa' : 'Inactiva'}
                                </span>
                                
                                {evaluacion.fecha_creacion && (
                                    <span className="text-xs text-gray-500">
                                        {new Date(evaluacion.fecha_creacion).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex gap-2 mt-4 border-t pt-3">
                                <button 
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                    title="Ver detalles"
                                >
                                    <FaEye /> Ver
                                </button>
                                <button 
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                                    title="Editar"
                                >
                                    <FaEdit /> Editar
                                </button>
                                <button 
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                    title="Eliminar"
                                >
                                    <FaTrash /> Eliminar
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