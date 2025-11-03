import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, GraduationCap, TrendingUp, Search, Mail, BookOpen, Loader2, AlertCircle } from "lucide-react";

export default function Estudiantes() {
  const { user } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [cursoSeleccionado, setCursoSeleccionado] = useState('todos');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Cargar cursos del profesor
      const resCursos = await fetch('http://localhost:4000/api/cursos/profesor', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!resCursos.ok) throw new Error('Error al cargar cursos');
      const dataCursos = await resCursos.json();
      setCursos(dataCursos);

      // Extraer todos los estudiantes únicos de todos los cursos
      const todosEstudiantes = new Map();
      
      dataCursos.forEach(curso => {
        curso.estudiantes?.forEach(est => {
          if (!todosEstudiantes.has(est.id)) {
            todosEstudiantes.set(est.id, {
              ...est,
              cursos: []
            });
          }
          todosEstudiantes.get(est.id).cursos.push({
            id: curso.id,
            titulo: curso.titulo,
            codigo: curso.codigo,
            estado: est.CourseStudent?.estado,
            inscrito_en: est.CourseStudent?.inscrito_en
          });
        });
      });

      setEstudiantes(Array.from(todosEstudiantes.values()));
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar estudiantes
  const estudiantesFiltrados = estudiantes.filter(est => {
    const matchBusqueda = est.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          est.email.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchCurso = cursoSeleccionado === 'todos' || 
                       est.cursos.some(c => c.id === cursoSeleccionado);
    
    return matchBusqueda && matchCurso;
  });

  // Calcular estadísticas
  const totalEstudiantes = estudiantes.length;
  const estudiantesActivos = estudiantes.filter(e => 
    e.cursos.some(c => c.estado === 'activo')
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Cargando estudiantes...</p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Mis Estudiantes</h1>
              <p className="text-slate-600 mt-1">Gestiona y visualiza tus estudiantes inscritos</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <select
              value={cursoSeleccionado}
              onChange={(e) => setCursoSeleccionado(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            >
              <option value="todos">Todos los cursos</option>
              {cursos.map(curso => (
                <option key={curso.id} value={curso.id}>
                  {curso.titulo} ({curso.codigo})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-blue-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total de</p>
                <p className="text-xl font-bold text-slate-800">Estudiantes</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-blue-600">{totalEstudiantes}</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-green-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Estudiantes</p>
                <p className="text-xl font-bold text-slate-800">Activos</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-green-600">{estudiantesActivos}</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-indigo-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Cursos</p>
                <p className="text-xl font-bold text-slate-800">Creados</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-indigo-600">{cursos.length}</p>
          </div>
        </div>

        {/* Lista de Estudiantes */}
        {estudiantesFiltrados.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-xl text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              {busqueda || cursoSeleccionado !== 'todos' 
                ? 'No se encontraron estudiantes'
                : 'No tienes estudiantes aún'
              }
            </h3>
            <p className="text-slate-600">
              {busqueda || cursoSeleccionado !== 'todos'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Crea un curso e inscribe estudiantes para comenzar'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {estudiantesFiltrados.map(estudiante => (
              <div
                key={estudiante.id}
                className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Avatar y nombre */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {estudiante.nombre.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800">
                      {estudiante.nombre}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{estudiante.email}</span>
                    </div>
                  </div>
                </div>

                {/* Cursos */}
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                    Inscrito en {estudiante.cursos.length} curso(s)
                  </p>
                  <div className="space-y-2">
                    {estudiante.cursos.map(curso => (
                      <div
                        key={curso.id}
                        className="bg-slate-50 rounded-lg p-2 text-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-700 truncate">
                            {curso.titulo}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            curso.estado === 'activo'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {curso.estado}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          Código: {curso.codigo}
                        </span>
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
  );
}
