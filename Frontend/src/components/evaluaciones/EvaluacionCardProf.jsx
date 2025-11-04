import { Edit3, Trash2, Clock, CalendarDays, User, Eye } from "lucide-react";
import PropTypes from 'prop-types';

function EvaluacionCardProf({ evaluacion, onEdit, onDelete, onView }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-slate-200 transform hover:-translate-y-2">
      {/* Badge de estado */}
      <div className="mb-3">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
          evaluacion?.activa
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {evaluacion?.activa ? '✓ Activa' : '✗ Inactiva'}
        </span>
      </div>

      {/* Header con título y acciones */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800 mb-2 line-clamp-2">
            {evaluacion?.titulo || "Título de evaluación"}
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg w-fit">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{evaluacion?.duracion || "45 min"}</span>
          </div>
        </div>

        <div className="flex gap-2 ml-3">
          <button
            onClick={onEdit}
            className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-all duration-200 shadow-sm hover:shadow-md border border-amber-200"
            title="Editar evaluación"
          >
            <Edit3 className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 shadow-sm hover:shadow-md border border-red-200"
            title="Eliminar evaluación"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Descripción */}
      <p className="text-slate-600 mb-5 leading-relaxed line-clamp-3 text-sm">
        {evaluacion?.descripcion ||
          "Descripción de la evaluación. Explica los temas de programación, conceptos clave, estructuras de datos o algoritmos que el estudiante encontrará en esta prueba."}
      </p>

      {/* Información de fechas e intentos */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 mb-4 border border-slate-200">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-slate-500 text-xs">Inicio</p>
              <p className="font-semibold text-slate-800">
                {evaluacion?.fechaInicio || "18 Oct"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <div>
              <p className="text-slate-500 text-xs">Fin</p>
              <p className="font-semibold text-slate-800">
                {evaluacion?.fechaFin || "25 Oct"}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-600">Intentos máximos:</span>
          <span className="font-bold text-blue-600 text-lg">{evaluacion?.intentosMax || 3}</span>
        </div>
      </div>

      {/* Footer con creador y botón de vista */}
      <div className="flex items-center justify-between pt-4 border-t-2 border-slate-100">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <User className="w-4 h-4 text-blue-600" />
          <span className="line-clamp-1">{evaluacion?.creador || "Profesor Juan Pérez"}</span>
        </div>
        <button 
          onClick={onView}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-semibold transform hover:-translate-y-0.5"
        >
          <Eye className="w-4 h-4" />
          Ver
        </button>
      </div>
    </div>
  );
}

EvaluacionCardProf.propTypes = {
  evaluacion: PropTypes.shape({
    titulo: PropTypes.string,
    duracion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    descripcion: PropTypes.string,
    fechaInicio: PropTypes.string,
    fechaFin: PropTypes.string,
    intentosMax: PropTypes.number,
    creador: PropTypes.string,
    activa: PropTypes.bool,
  }),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
};

export default EvaluacionCardProf;
