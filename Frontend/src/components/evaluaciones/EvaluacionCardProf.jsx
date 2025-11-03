import { Edit3, Trash2, Clock, CalendarDays, User } from "lucide-react";

function EvaluacionCardProf({ evaluacion, onEdit, onDelete }) {
  return (
    <div className="bg- rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 max-w-xl mx-auto my-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            {evaluacion?.titulo || "Título de evaluación"}
          </h1>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>{evaluacion?.duracion || "45 min"}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
            title="Editar evaluación"
          >
            <Edit3 className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            title="Eliminar evaluación"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-5 leading-relaxed">
        {evaluacion?.descripcion ||
          "Descripción de la evaluación. Explica los temas, objetivos o tipo de preguntas que el estudiante encontrará en esta prueba."}
      </p>

      <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
        <div className="flex items-center">
          <CalendarDays className="w-4 h-4 mr-1" />
          <span>
            Inicio:{" "}
            <strong>
              {evaluacion?.fechaInicio || "2025-10-18"}
            </strong>
          </span>
        </div>
        <div className="flex items-center">
          <CalendarDays className="w-4 h-4 mr-1" />
          <span>
            Fin:{" "}
            <strong>
              {evaluacion?.fechaFin || "2025-10-25"}
            </strong>
          </span>
        </div>
        <div>
          <span>
            Intentos máx:{" "}
            <strong>{evaluacion?.intentosMax || 3}</strong>
          </span>
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-500 border-t pt-3">
        <User className="w-4 h-4 mr-1" />
        <span>Creado por {evaluacion?.creador || "Profesor Juan Pérez"}</span>
      </div>
    </div>
  );
}

export default EvaluacionCardProf;
