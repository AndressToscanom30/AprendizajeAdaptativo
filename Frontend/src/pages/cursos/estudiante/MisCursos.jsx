import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import { BookOpen, Users, FileText, TrendingUp, Clock, Award } from "lucide-react";

function MisCursos() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/cursos/estudiante", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCursos(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar cursos:", err);
      setError("No se pudieron cargar los cursos");
    } finally {
      setLoading(false);
    }
  };

  const verDetalleCurso = (cursoId) => {
    navigate(`/estudiante/cursos/${cursoId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando tus cursos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
          <button
            onClick={cargarCursos}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Mis Cursos 📚
              </h1>
              <p className="text-gray-600 text-lg">
                Bienvenido, <span className="font-semibold text-blue-600">{user?.nombre}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total de cursos</div>
              <div className="text-3xl font-bold text-blue-600">{cursos.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cursos Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {cursos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <BookOpen className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No hay cursos asignados
            </h3>
            <p className="text-gray-600">
              Aún no tienes cursos asignados. Espera a que tu profesor te inscriba en uno.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.map((curso) => (
              <div
                key={curso.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
                onClick={() => verDetalleCurso(curso.id)}
              >
                {/* Header del curso */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{curso.titulo}</h3>
                  <p className="text-blue-100 text-sm line-clamp-2">
                    {curso.descripcion || "Sin descripción"}
                  </p>
                </div>

                {/* Información del profesor */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-3">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Profesor</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {curso.profesor?.nombre || "No asignado"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Fecha de inscripción */}
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Inscrito</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {new Date(curso.CourseStudent?.inscrito_en).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Estado */}
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Estado</p>
                        <span
                          className={`text-sm font-semibold ${
                            curso.CourseStudent?.estado === "activo"
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          {curso.CourseStudent?.estado || "Activo"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón de acción */}
                <div className="p-6">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Ver Detalles</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MisCursos;
