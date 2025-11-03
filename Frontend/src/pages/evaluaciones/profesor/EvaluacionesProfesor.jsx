import EvaluacionCardProf from "../../../components/evaluaciones/EvaluacionCardProf.jsx";
import { Search, PlusCircle, Filter, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";

function EvaluacionesProfesor() {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const handleActionAndNavigate = () => {
        navigate('/crearEvaluacion');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
                <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-800">
                                ¡Hola, {user?.nombre || 'Profesor'}!
                            </h1>
                            <p className="text-slate-600 text-lg mt-1">
                                Gestiona las evaluaciones y contenidos de tus estudiantes 📚
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🧠</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">
                                Mis Evaluaciones
                            </h2>
                        </div>

                        <button
                            onClick={handleActionAndNavigate}
                            type="button"
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-semibold"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Crear evaluación
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar evaluaciones..."
                                className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-slate-800 placeholder:text-slate-400"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <select
                                className="w-full md:w-[220px] pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 transition-all appearance-none cursor-pointer"
                                aria-label="Filtrar evaluaciones"
                                defaultValue=""
                            >
                                <option value="">Todas las evaluaciones</option>
                                <option value="activas">Activas</option>
                                <option value="completadas">Completadas</option>
                                <option value="pendientes">Pendientes</option>
                                <option value="archivadas">Archivadas</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[...Array(9)].map((_, i) => (
                            <EvaluacionCardProf key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EvaluacionesProfesor;
