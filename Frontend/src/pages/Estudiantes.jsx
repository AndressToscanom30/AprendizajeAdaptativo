import { Users, GraduationCap, TrendingUp } from "lucide-react";

export default function Estudiantes() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-800">Gestión de Estudiantes</h1>
              <p className="text-slate-600 mt-2 text-lg">Administra y visualiza el progreso de tus estudiantes</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total de</p>
                <p className="text-2xl font-bold text-slate-800">Estudiantes</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-blue-600 mb-2">0</p>
            <p className="text-slate-600 text-sm">Página en construcción...</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-green-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Estudiantes</p>
                <p className="text-2xl font-bold text-slate-800">Activos</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-green-600 mb-2">0</p>
            <p className="text-slate-600 text-sm">Próximamente disponible</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Promedio</p>
                <p className="text-2xl font-bold text-slate-800">General</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-indigo-600 mb-2">0%</p>
            <p className="text-slate-600 text-sm">Próximamente disponible</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Lista de Estudiantes</h2>
          <p className="text-slate-600 text-lg">Página en construcción...</p>
          <p className="text-sm text-slate-500 mt-2">Próximamente: lista completa de estudiantes, filtros avanzados y gestión individual.</p>
        </div>
      </div>
    </div>
  );
}
