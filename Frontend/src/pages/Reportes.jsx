import { BarChart3, TrendingUp, Users, FileText } from "lucide-react";

export default function Reportes() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-800">Reportes y Análisis</h1>
              <p className="text-slate-600 mt-2 text-lg">Visualiza estadísticas y métricas de rendimiento</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-slate-500 mb-1">Estudiantes Activos</p>
            <p className="text-3xl font-bold text-slate-800">0</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-slate-500 mb-1">Evaluaciones</p>
            <p className="text-3xl font-bold text-slate-800">0</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-slate-500 mb-1">Promedio General</p>
            <p className="text-3xl font-bold text-slate-800">0%</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-slate-500 mb-1">Tasa de Éxito</p>
            <p className="text-3xl font-bold text-slate-800">0%</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Análisis Detallado</h2>
          <p className="text-slate-600 text-lg">Página en construcción...</p>
          <p className="text-sm text-slate-500 mt-2">Próximamente: gráficos de progreso, análisis comparativo y reportes personalizados.</p>
        </div>
      </div>
    </div>
  );
}
