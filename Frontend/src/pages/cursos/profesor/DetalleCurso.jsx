import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, UserPlus, Trash2, Loader2, AlertCircle, BookOpen, Mail } from 'lucide-react';

function DetalleCurso() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [curso, setCurso] = useState(null);
    const [estudiantes, setEstudiantes] = useState([]);
    const [todosEstudiantes, setTodosEstudiantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState('');

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const cargarDatos = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Cargar estudiantes del curso
            const resEstudiantes = await fetch(
                `http://localhost:4000/api/cursos/${id}/estudiantes`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            if (!resEstudiantes.ok) throw new Error('Error al cargar estudiantes');
            const dataEstudiantes = await resEstudiantes.json();
            setEstudiantes(dataEstudiantes);

            // Cargar todos los estudiantes para el modal
            const resTodosEstudiantes = await fetch(
                'http://localhost:4000/api/users',
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            if (resTodosEstudiantes.ok) {
                const allUsers = await resTodosEstudiantes.json();
                const soloEstudiantes = allUsers.filter(u => u.rol === 'estudiante');
                setTodosEstudiantes(soloEstudiantes);
            }

            setError(null);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInscribir = async () => {
        if (!estudianteSeleccionado) {
            alert('Selecciona un estudiante');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/cursos/inscribir', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cursoId: id,
                    estudianteId: estudianteSeleccionado
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error al inscribir');
            }

            alert('✓ Estudiante inscrito exitosamente');
            setShowModal(false);
            setEstudianteSeleccionado('');
            cargarDatos();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    const handleEliminar = async (estudianteId) => {
        if (!confirm('¿Estás seguro de eliminar este estudiante del curso?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:4000/api/cursos/${id}/estudiantes/${estudianteId}`,
                {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (!response.ok) throw new Error('Error al eliminar');

            alert('✓ Estudiante eliminado del curso');
            cargarDatos();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar estudiante');
        }
    };

    // Filtrar estudiantes que NO están en el curso
    const estudiantesDisponibles = todosEstudiantes.filter(
        e => !estudiantes.some(est => est.id === e.id)
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Cargando curso...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-8">
                <div className="max-w-md mx-auto bg-red-50 border-2 border-red-300 rounded-3xl p-8">
                    <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                    <p className="text-red-700 font-semibold text-center">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <button
                    onClick={() => navigate('/profesor/cursos')}
                    className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver a Cursos
                </button>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-800">Gestión de Estudiantes</h1>
                            <p className="text-slate-600 mt-1">{estudiantes.length} estudiantes inscritos</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                    >
                        <UserPlus className="w-5 h-5" />
                        Inscribir Estudiante
                    </button>
                </div>

                {/* Lista de estudiantes */}
                {estudiantes.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 text-center">
                        <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600 text-lg">No hay estudiantes inscritos aún</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Inscribir estudiantes
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {estudiantes.map((estudiante) => (
                            <div
                                key={estudiante.id}
                                className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-3">
                                        <Users className="w-6 h-6 text-green-600" />
                                    </div>
                                    <button
                                        onClick={() => handleEliminar(estudiante.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 mb-2">{estudiante.nombre}</h3>
                                
                                <div className="flex items-center gap-2 text-slate-600 text-sm">
                                    <Mail className="w-4 h-4" />
                                    <span>{estudiante.email}</span>
                                </div>

                                {estudiante.CourseStudent && (
                                    <div className="mt-4 pt-4 border-t border-slate-200">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            estudiante.CourseStudent.estado === 'activo'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-slate-100 text-slate-700'
                                        }`}>
                                            {estudiante.CourseStudent.estado}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal inscribir estudiante */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Inscribir Estudiante</h2>
                            
                            {estudiantesDisponibles.length === 0 ? (
                                <>
                                    <p className="text-slate-600 mb-6">No hay estudiantes disponibles para inscribir</p>
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setEstudianteSeleccionado('');
                                        }}
                                        className="w-full px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-semibold"
                                    >
                                        Cerrar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Seleccionar Estudiante
                                        </label>
                                        <select
                                            value={estudianteSeleccionado}
                                            onChange={(e) => setEstudianteSeleccionado(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        >
                                            <option value="">Selecciona un estudiante...</option>
                                            {estudiantesDisponibles.map((est) => (
                                                <option key={est.id} value={est.id}>
                                                    {est.nombre} ({est.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowModal(false);
                                                setEstudianteSeleccionado('');
                                            }}
                                            className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-semibold"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleInscribir}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                                        >
                                            Inscribir
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetalleCurso;
