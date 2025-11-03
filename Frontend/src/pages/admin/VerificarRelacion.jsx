import { useState } from 'react';
import { Search, CheckCircle, XCircle, Loader2, Users, GraduationCap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function VerificarRelacion() {
    const navigate = useNavigate();
    const [estudiantes, setEstudiantes] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState('');
    const [profesorSeleccionado, setProfesorSeleccionado] = useState('');
    const [resultado, setResultado] = useState(null);
    const [verificando, setVerificando] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    const cargarUsuarios = async () => {
        setLoadingData(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Error al cargar usuarios');

            const users = await response.json();
            setEstudiantes(users.filter(u => u.rol === 'estudiante'));
            setProfesores(users.filter(u => u.rol === 'profesor'));
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar usuarios');
        } finally {
            setLoadingData(false);
        }
    };

    const verificar = async () => {
        if (!estudianteSeleccionado || !profesorSeleccionado) {
            alert('Selecciona un estudiante y un profesor');
            return;
        }

        setVerificando(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:4000/api/users/verificar-relacion?estudianteId=${estudianteSeleccionado}&profesorId=${profesorSeleccionado}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (!response.ok) throw new Error('Error al verificar');

            const data = await response.json();
            setResultado(data);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al verificar relación');
        } finally {
            setVerificando(false);
        }
    };

    const estudianteNombre = estudiantes.find(e => e.id === estudianteSeleccionado)?.nombre || '';
    const profesorNombre = profesores.find(p => p.id === profesorSeleccionado)?.nombre || '';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Botón Volver */}
                <button
                    onClick={() => navigate('/admin/relaciones')}
                    className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver a Relaciones
                </button>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg">
                            <Search className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-800">Verificar Relación</h1>
                            <p className="text-slate-600 mt-1">¿Este estudiante está con este profesor?</p>
                        </div>
                    </div>

                    {!loadingData && estudiantes.length === 0 && (
                        <button
                            onClick={cargarUsuarios}
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold mb-6"
                        >
                            Cargar Usuarios
                        </button>
                    )}

                    {loadingData && (
                        <div className="text-center py-8">
                            <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                            <p className="text-slate-600">Cargando usuarios...</p>
                        </div>
                    )}

                    {!loadingData && estudiantes.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Selector de estudiante */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <Users className="w-4 h-4" />
                                        Estudiante
                                    </label>
                                    <select
                                        value={estudianteSeleccionado}
                                        onChange={(e) => {
                                            setEstudianteSeleccionado(e.target.value);
                                            setResultado(null);
                                        }}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                    >
                                        <option value="">Selecciona un estudiante...</option>
                                        {estudiantes.map((est) => (
                                            <option key={est.id} value={est.id}>
                                                {est.nombre} ({est.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Selector de profesor */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <GraduationCap className="w-4 h-4" />
                                        Profesor
                                    </label>
                                    <select
                                        value={profesorSeleccionado}
                                        onChange={(e) => {
                                            setProfesorSeleccionado(e.target.value);
                                            setResultado(null);
                                        }}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                    >
                                        <option value="">Selecciona un profesor...</option>
                                        {profesores.map((prof) => (
                                            <option key={prof.id} value={prof.id}>
                                                {prof.nombre} ({prof.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={verificar}
                                disabled={verificando || !estudianteSeleccionado || !profesorSeleccionado}
                                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {verificando ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        Verificando...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        Verificar Relación
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>

                {/* Resultado de la verificación */}
                {resultado && (
                    <div className={`bg-white rounded-3xl shadow-xl border-2 p-8 ${
                        resultado.estaRelacionado 
                            ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' 
                            : 'border-red-300 bg-gradient-to-br from-red-50 to-pink-50'
                    }`}>
                        <div className="flex items-center gap-4 mb-6">
                            {resultado.estaRelacionado ? (
                                <div className="bg-green-100 rounded-2xl p-4">
                                    <CheckCircle className="w-12 h-12 text-green-600" />
                                </div>
                            ) : (
                                <div className="bg-red-100 rounded-2xl p-4">
                                    <XCircle className="w-12 h-12 text-red-600" />
                                </div>
                            )}
                            <div>
                                <h2 className={`text-3xl font-bold ${
                                    resultado.estaRelacionado ? 'text-green-700' : 'text-red-700'
                                }`}>
                                    {resultado.estaRelacionado ? '✓ Sí están relacionados' : '✗ No están relacionados'}
                                </h2>
                                <p className="text-slate-700 mt-1">
                                    <span className="font-semibold">{estudianteNombre}</span>
                                    {resultado.estaRelacionado ? ' está con ' : ' NO está con '}
                                    <span className="font-semibold">{profesorNombre}</span>
                                </p>
                            </div>
                        </div>

                        {resultado.estaRelacionado && resultado.cursos.length > 0 && (
                            <div className="border-t-2 border-green-200 pt-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-4">
                                    Cursos compartidos ({resultado.cursos.length})
                                </h3>
                                <div className="space-y-3">
                                    {resultado.cursos.map((curso) => (
                                        <div
                                            key={curso.id}
                                            className="bg-white rounded-xl p-4 border border-green-200 shadow-sm"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-slate-800 text-lg">
                                                        {curso.titulo}
                                                    </h4>
                                                    <p className="text-sm text-slate-600">
                                                        Código: <span className="font-mono">{curso.codigo}</span>
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    curso.estado === 'activo'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {curso.estado}
                                                </span>
                                            </div>
                                            {curso.inscrito_en && (
                                                <p className="text-xs text-slate-500 mt-2">
                                                    Inscrito: {new Date(curso.inscrito_en).toLocaleDateString('es-ES')}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default VerificarRelacion;
