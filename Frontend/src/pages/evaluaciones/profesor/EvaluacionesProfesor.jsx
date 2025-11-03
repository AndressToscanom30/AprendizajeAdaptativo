import EvaluacionCardProf from "../../../components/evaluaciones/EvaluacionCardProf.jsx";
import { Search, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function EvaluacionesProfesor() {
    const navigate = useNavigate();
    const handleActionAndNavigate = () => {
        navigate('/crearEvaluacion');
    };

    return (
        <div className="flex flex-col w-full px-4 sm:px-8 py-8 bg-gray-50 min-h-screen transition-all duration-300">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    ¡Hola, Profesor X!
                </h1>
                <p className="text-gray-600 text-lg">
                    Gestiona las evaluaciones y contenidos de tus estudiantes 📚
                </p>
            </header>
            <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <h3 className="text-xl font-semibold text-gray-700">
                    🧠 Evaluaciones
                </h3>

                <button
                onClick={handleActionAndNavigate}
                    type="button"
                    className="flex items-center justify-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    <PlusCircle className="w-5 h-5" />
                    Crear evaluación
                </button>
            </section>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar evaluaciones..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                    />
                </div>

                <select
                    className="w-full md:w-[200px] py-3 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-700 transition-all"
                    aria-label="Filtrar evaluaciones"
                    defaultValue=""
                >
                    <option value="">Filtrar por...</option>
                    <option value="completadas">Completadas</option>
                    <option value="pendientes">Pendientes</option>
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                {[...Array(9)].map((_, i) => (
                    <EvaluacionCardProf key={i} />
                ))}
            </div>
        </div>
    );
}

export default EvaluacionesProfesor;
