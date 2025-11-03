import { useState, useEffect } from 'react';
import { Search, Users, GraduationCap, CheckCircle, XCircle, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function GestionRelaciones() {
    const navigate = useNavigate();
    const [vista, setVista] = useState('estudiantes'); // 'estudiantes' o 'profesores'
    const [estudiantes, setEstudiantes] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [verificando, setVerificando] = useState(false);
    const [resultadoVerificacion, setResultadoVerificacion] = useState(null);

    useEffect(() => {
        cargarDatos();
    }, [vista]);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const endpoint = vista === 'estudiantes' 
                ? 'http://localhost:4000/api/users/estudiantes-profesores'
                : 'http://localhost:4000/api/users/profesores-estudiantes';

            const response = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Error al cargar datos');

            const data = await response.json();
            
            if (vista === 'estudiantes') {
                setEstudiantes(data);
            } else {
                setProfesores(data);
            }
            
            setError(null);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const verificarRelacion = async (estudianteId, profesorId) => {
        setVerificando(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:4000/api/users/verificar-relacion?estudianteId=${estudianteId}&profesorId=${profesorId}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (!response.ok) throw new Error('Error al verificar');

            const data = await response.json();
            setResultadoVerificacion(data);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al verificar relación');
        } finally {
            setVerificando(false);
        }
    };

    // Filtrar por búsqueda
    const datosFiltrados = vista === 'estudiantes' 
        ? estudiantes.filter(e => 
            e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            e.email.toLowerCase().includes(busqueda.toLowerCase())
          )
        : profesores.filter(p => 
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.email.toLowerCase().includes(busqueda.toLowerCase())
          );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Cargando datos...</p>
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
                {/* Botón Volver */}
                <button
                    onClick={() => navigate('/dashboardP')}
                    className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver al Dashboard
                </button>

                {/* Header */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-800">Gestión de Relaciones</h1>
                            <p className="text-slate-600 mt-1">Estudiantes y Profesores</p>
                        </div>
                    </div>

                    {/* Selector de vista */}
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={() => setVista('estudiantes')}
                            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                vista === 'estudiantes'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <Users className="w-5 h-5 inline mr-2" />
                            Ver por Estudiantes
                        </button>
                        <button
                            onClick={() => setVista('profesores')}
                            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                vista === 'profesores'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <GraduationCap className="w-5 h-5 inline mr-2" />
                            Ver por Profesores
                        </button>
                    </div>

                    {/* Botón de Verificación Rápida */}
                    <div className="mb-6">
                        <button
                            onClick={() => navigate('/admin/verificar')}
                            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            Verificación Rápida: ¿Este estudiante está con este profesor?
                        </button>
                    </div>

                    {/* Búsqueda */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        />
                    </div>
                </div>

                {/* Vista de Estudiantes */}
                {vista === 'estudiantes' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {datosFiltrados.length === 0 ? (
                            <div className="col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200 p-12 text-center">
                                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-600 text-lg">No hay estudiantes para mostrar</p>
                            </div>
                        ) : (
                            datosFiltrados.map((estudiante) => (
                                <div
                                    key={estudiante.id}
                                    className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-3">
                                            <Users className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-slate-800">{estudiante.nombre}</h3>
                                            <p className="text-slate-600 text-sm">{estudiante.email}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-200 pt-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <GraduationCap className="w-5 h-5 text-slate-600" />
                                            <span className="font-semibold text-slate-700">
                                                Profesores Asignados ({estudiante.profesores.length})
                                            </span>
                                        </div>

                                        {estudiante.profesores.length === 0 ? (
                                            <p className="text-slate-500 text-sm italic">Sin profesores asignados</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {estudiante.profesores.map((profesor) => (
                                                    <div
                                                        key={profesor.id}
                                                        className="bg-slate-50 rounded-xl p-3 border border-slate-200"
                                                    >
                                                        <div className="font-semibold text-slate-800 mb-1">
                                                            {profesor.nombre}
                                                        </div>
                                                        <div className="text-sm text-slate-600 mb-2">
                                                            {profesor.email}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {profesor.cursos.length} curso(s):
                                                            <div className="mt-1 space-y-1">
                                                                {profesor.cursos.map(curso => (
                                                                    <div key={curso.id} className="flex items-center gap-2">
                                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                                            curso.estado === 'activo'
                                                                                ? 'bg-green-100 text-green-700'
                                                                                : 'bg-slate-100 text-slate-700'
                                                                        }`}>
                                                                            {curso.estado}
                                                                        </span>
                                                                        <span>{curso.titulo}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Vista de Profesores */}
                {vista === 'profesores' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {datosFiltrados.length === 0 ? (
                            <div className="col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200 p-12 text-center">
                                <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-600 text-lg">No hay profesores para mostrar</p>
                            </div>
                        ) : (
                            datosFiltrados.map((profesor) => (
                                <div
                                    key={profesor.id}
                                    className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-3">
                                            <GraduationCap className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-slate-800">{profesor.nombre}</h3>
                                            <p className="text-slate-600 text-sm">{profesor.email}</p>
                                            <p className="text-slate-500 text-xs mt-1">
                                                {profesor.totalCursos} curso(s) creado(s)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-200 pt-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Users className="w-5 h-5 text-slate-600" />
                                            <span className="font-semibold text-slate-700">
                                                Estudiantes Asignados ({profesor.estudiantes.length})
                                            </span>
                                        </div>

                                        {profesor.estudiantes.length === 0 ? (
                                            <p className="text-slate-500 text-sm italic">Sin estudiantes asignados</p>
                                        ) : (
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {profesor.estudiantes.map((estudiante) => (
                                                    <div
                                                        key={estudiante.id}
                                                        className="bg-slate-50 rounded-xl p-3 border border-slate-200"
                                                    >
                                                        <div className="font-semibold text-slate-800 mb-1">
                                                            {estudiante.nombre}
                                                        </div>
                                                        <div className="text-sm text-slate-600 mb-2">
                                                            {estudiante.email}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {estudiante.cursos.length} curso(s):
                                                            <div className="mt-1 space-y-1">
                                                                {estudiante.cursos.map(curso => (
                                                                    <div key={curso.id} className="flex items-center gap-2">
                                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                                            curso.estado === 'activo'
                                                                                ? 'bg-green-100 text-green-700'
                                                                                : 'bg-slate-100 text-slate-700'
                                                                        }`}>
                                                                            {curso.estado}
                                                                        </span>
                                                                        <span>{curso.titulo} ({curso.codigo})</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GestionRelaciones;
