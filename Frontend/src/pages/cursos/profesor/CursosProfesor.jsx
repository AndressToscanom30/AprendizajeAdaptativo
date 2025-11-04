import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Users, BookOpen, PlusCircle, Loader2, AlertCircle, Trash2, Edit2, X } from 'lucide-react';

function CursosProfesor() {
    const { user } = useAuth();
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        codigo: ''
    });

    useEffect(() => {
        cargarCursos();
    }, []);

    const cargarCursos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/cursos/profesor', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Error al cargar cursos');

            const data = await response.json();
            setCursos(data);
            setError(null);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/cursos', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Error al crear curso');

            alert('✓ Curso creado exitosamente');
            setShowModal(false);
            setFormData({ titulo: '', descripcion: '', codigo: '' });
            cargarCursos();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear curso: ' + error.message);
        }
    };

    const handleEdit = (curso) => {
        setCursoSeleccionado(curso);
        setFormData({
            titulo: curso.titulo,
            descripcion: curso.descripcion || '',
            codigo: curso.codigo || ''
        });
        setShowEditModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4000/api/cursos/${cursoSeleccionado.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Error al actualizar curso');

            alert('✓ Curso actualizado exitosamente');
            setShowEditModal(false);
            setCursoSeleccionado(null);
            setFormData({ titulo: '', descripcion: '', codigo: '' });
            cargarCursos();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar curso: ' + error.message);
        }
    };

    const handleDeleteClick = (curso) => {
        setCursoSeleccionado(curso);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4000/api/cursos/${cursoSeleccionado.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al eliminar curso');

            alert('✓ Curso eliminado exitosamente');
            setShowDeleteModal(false);
            setCursoSeleccionado(null);
            cargarCursos();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar curso: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Cargando cursos...</p>
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
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-800">Mis Cursos</h1>
                            <p className="text-slate-600 mt-1">Gestiona tus cursos y estudiantes</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Nuevo Curso
                    </button>
                </div>

                {/* Lista de cursos */}
                {cursos.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 text-center">
                        <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600 text-lg">No tienes cursos creados aún</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Crear tu primer curso
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cursos.map((curso) => (
                            <div
                                key={curso.id}
                                className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-3">
                                        <BookOpen className="w-6 h-6 text-blue-600" />
                                    </div>
                                    {curso.codigo && (
                                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold">
                                            {curso.codigo}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 mb-2">{curso.titulo}</h3>
                                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{curso.descripcion}</p>

                                <div className="flex items-center gap-2 text-slate-600 mb-4">
                                    <Users className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        {curso.estudiantes?.length || 0} estudiantes
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => globalThis.location.href = `/profesor/cursos/${curso.id}`}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm"
                                    >
                                        Ver Detalles
                                    </button>
                                    <button
                                        onClick={() => handleEdit(curso)}
                                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                                        title="Editar curso"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(curso)}
                                        className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                        title="Eliminar curso"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal crear curso */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">Crear Nuevo Curso</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Título del Curso *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.titulo}
                                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        placeholder="Ej: Programación Orientada a Objetos"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Código del Curso
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.codigo}
                                        onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        placeholder="Ej: PROG-201"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={formData.descripcion}
                                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                        rows="4"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                                        placeholder="Descripción del curso..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-semibold"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                                    >
                                        Crear Curso
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal editar curso */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">Editar Curso</h2>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setCursoSeleccionado(null);
                                        setFormData({ titulo: '', descripcion: '', codigo: '' });
                                    }}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Título del Curso *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.titulo}
                                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        placeholder="Ej: Programación Orientada a Objetos"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Código del Curso
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.codigo}
                                        onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        placeholder="Ej: PROG-201"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={formData.descripcion}
                                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                        rows="4"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                                        placeholder="Descripción del curso..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setCursoSeleccionado(null);
                                            setFormData({ titulo: '', descripcion: '', codigo: '' });
                                        }}
                                        className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-semibold"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                                    >
                                        Actualizar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal confirmar eliminación */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-red-100 rounded-xl">
                                        <AlertCircle className="w-6 h-6 text-red-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800">Eliminar Curso</h2>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setCursoSeleccionado(null);
                                    }}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-slate-600 mb-4">
                                    ¿Estás seguro que deseas eliminar el curso <span className="font-bold text-slate-800">"{cursoSeleccionado?.titulo}"</span>?
                                </p>
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <p className="text-sm text-amber-800">
                                        <strong>⚠️ Advertencia:</strong> Esta acción eliminará el curso y todas sus relaciones con estudiantes. Esta acción no se puede deshacer.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setCursoSeleccionado(null);
                                    }}
                                    className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-semibold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CursosProfesor;