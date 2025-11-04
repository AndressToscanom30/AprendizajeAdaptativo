import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, FileText, BookOpen, Target, Loader2, AlertCircle } from "lucide-react";

export default function Reportes() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const token = localStorage.getItem('token');

      // Cargar evaluaciones
      const resEval = await fetch('http://localhost:4000/api/evaluaciones', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const evaluaciones = await resEval.json();

      // Cargar cursos
      const resCursos = await fetch('http://localhost:4000/api/cursos/profesor', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const cursos = await resCursos.json();

      const estudiantesUnicos = new Set();
      for (const curso of cursos) {
        if (curso.estudiantes) {
          for (const est of curso.estudiantes) {
            estudiantesUnicos.add(est.id);
          }
        }
      }

      const evaluacionesActivas = evaluaciones.filter(e => e.activa).length;

      setEstadisticas({
        totalEstudiantes: estudiantesUnicos.size,
        totalEvaluaciones: evaluaciones.length,
        evaluacionesActivas,
        totalCursos: cursos.length,
        evaluaciones,
        cursos
      });

      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Cargando estadísticas...</p>
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
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Reportes y Análisis</h1>
              <p className="text-slate-600 mt-1">Visualiza estadísticas y métricas de rendimiento</p>
            </div>
          </div>
        </div>

        {/* Estadísticas Principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-slate-500 mb-1">Estudiantes</p>
            <p className="text-3xl font-bold text-slate-800">{estadisticas?.totalEstudiantes || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-slate-500 mb-1">Evaluaciones</p>
            <p className="text-3xl font-bold text-slate-800">{estadisticas?.totalEvaluaciones || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-green-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-slate-500 mb-1">Activas</p>
            <p className="text-3xl font-bold text-slate-800">{estadisticas?.evaluacionesActivas || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-slate-500 mb-1">Cursos</p>
            <p className="text-3xl font-bold text-slate-800">{estadisticas?.totalCursos || 0}</p>
          </div>
        </div>

        {/* Evaluaciones Recientes */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Evaluaciones Recientes
          </h2>
          
          {estadisticas?.evaluaciones?.length > 0 ? (
            <div className="space-y-3">
              {estadisticas.evaluaciones.slice(0, 5).map(evaluacion => (
                <div
                  key={evaluacion.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{evaluacion.titulo}</h3>
                    <p className="text-sm text-slate-600">{evaluacion.descripcion || 'Sin descripción'}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      evaluacion.activa
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {evaluacion.activa ? 'Activa' : 'Inactiva'}
                    </span>
                    <span className="text-sm text-slate-500">
                      {new Date(evaluacion.fecha_creacion).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-center py-8">No hay evaluaciones creadas</p>
          )}
        </div>

        {/* Cursos Activos */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            Cursos Activos
          </h2>
          
          {estadisticas?.cursos?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {estadisticas.cursos.map(curso => (
                <div
                  key={curso.id}
                  className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <h3 className="font-semibold text-slate-800 mb-2">{curso.titulo}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Código: {curso.codigo}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {curso.estudiantes?.length || 0} estudiantes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-center py-8">No hay cursos creados</p>
          )}
        </div>
      </div>
    </div>
  );
}
