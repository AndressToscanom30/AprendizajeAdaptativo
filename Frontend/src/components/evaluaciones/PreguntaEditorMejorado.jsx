import { useState } from "react";
import {
  CheckSquare,
  ListChecks,
  ToggleLeft,
  Type,
  AlignLeft,
  Link,
  Trash2,
  GripVertical,
  Code,
} from "lucide-react";
import OpcionMultiple from "./tiposPreguntas/OpcionMultiple";
import SeleccionMultiple from "./tiposPreguntas/SeleccionMultiple";
import VerdaderoFalso from "./tiposPreguntas/VerdaderoFalso";
import RespuestaTexto from "./tiposPreguntas/RespuestaTexto";
import PreguntaCodigo from "./tiposPreguntas/PreguntaCodigo";

function PreguntaEditor({ onChange, onDelete, initialData = {}, numero }) {
  const [tipo, setTipo] = useState(initialData.tipo || "opcion_multiple");
  const [titulo, setTitulo] = useState(initialData.titulo || "");
  const [descripcion, setDescripcion] = useState(initialData.descripcion || "");
  const [opciones, setOpciones] = useState(initialData.opciones || []);
  const [puntaje, setPuntaje] = useState(initialData.puntaje || 1);

  const handleUpdate = (updatedFields) => {
    const updated = {
      tipo,
      titulo,
      descripcion,
      opciones,
      puntaje,
      ...updatedFields,
    };
    onChange && onChange(updated);
  };

  const handleTipoChange = (newTipo) => {
    setTipo(newTipo);
    setOpciones([]); // Resetear opciones al cambiar tipo
    handleUpdate({ tipo: newTipo, opciones: [] });
  };

  const handleTituloChange = (e) => {
    const newTitulo = e.target.value;
    setTitulo(newTitulo);
    handleUpdate({ titulo: newTitulo });
  };

  const handleDescripcionChange = (e) => {
    const newDescripcion = e.target.value;
    setDescripcion(newDescripcion);
    handleUpdate({ descripcion: newDescripcion });
  };

  const handlePuntajeChange = (e) => {
    const newPuntaje = Number.parseInt(e.target.value) || 1;
    setPuntaje(newPuntaje);
    handleUpdate({ puntaje: newPuntaje });
  };

  const tiposPreguntas = [
    { value: "opcion_multiple", label: "Opción Múltiple", icon: CheckSquare, color: "blue" },
    { value: "seleccion_multiple", label: "Selección Múltiple", icon: ListChecks, color: "green" },
    { value: "verdadero_falso", label: "Verdadero/Falso", icon: ToggleLeft, color: "purple" },
    { value: "respuesta_corta", label: "Respuesta Corta", icon: Type, color: "orange" },
    { value: "respuesta_larga", label: "Respuesta Larga", icon: AlignLeft, color: "pink" },
    { value: "codigo", label: "Código de Programación", icon: Code, color: "indigo" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
            <GripVertical className="w-5 h-5 text-white" />
          </div>
          <div className="text-white">
            <h3 className="text-lg font-bold">Pregunta {numero}</h3>
            <p className="text-sm text-blue-100">Configura el contenido y tipo</p>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-200 hover:scale-110"
          title="Eliminar pregunta"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Título de la Pregunta */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            📝 Título de la Pregunta *
          </label>
          <input
            type="text"
            value={titulo}
            onChange={handleTituloChange}
            placeholder="Ej: ¿Qué es una variable en programación?"
            className="w-full border-2 border-slate-300 rounded-xl p-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            💬 Descripción o Contexto (Opcional)
          </label>
          <textarea
            value={descripcion}
            onChange={handleDescripcionChange}
            placeholder="Agrega contexto adicional, imágenes de referencia, o instrucciones..."
            className="w-full border-2 border-slate-300 rounded-xl p-3 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none transition-all"
          />
        </div>

        {/* Tipo de Pregunta - Cards Visuales */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            🎯 Tipo de Pregunta *
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {tiposPreguntas.map((tipoPregunta) => {
              const Icon = tipoPregunta.icon;
              const isSelected = tipo === tipoPregunta.value;
              return (
                <button
                  key={tipoPregunta.value}
                  type="button"
                  onClick={() => handleTipoChange(tipoPregunta.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                    isSelected
                      ? `border-${tipoPregunta.color}-500 bg-${tipoPregunta.color}-50 shadow-lg scale-105`
                      : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                  }`}
                >
                  <Icon
                    className={`w-8 h-8 ${
                      isSelected ? `text-${tipoPregunta.color}-600` : "text-slate-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium text-center ${
                      isSelected ? `text-${tipoPregunta.color}-700` : "text-slate-600"
                    }`}
                  >
                    {tipoPregunta.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Puntaje */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            ⭐ Puntaje de la Pregunta
          </label>
          <input
            type="number"
            value={puntaje}
            onChange={handlePuntajeChange}
            min="1"
            max="100"
            className="w-32 border-2 border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
          />
          <p className="text-sm text-slate-500 mt-1">Puntos que vale esta pregunta</p>
        </div>

        {/* Divisor */}
        <div className="border-t-2 border-slate-200 my-6"></div>

        {/* Contenido Específico del Tipo */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              ?
            </span>
            Configuración de Respuestas
          </h4>

          {tipo === "opcion_multiple" && (
            <OpcionMultiple
              initialOpciones={opciones}
              onChange={(ops) => {
                setOpciones(ops);
                handleUpdate({ opciones: ops });
              }}
            />
          )}

          {tipo === "seleccion_multiple" && (
            <SeleccionMultiple
              initialOpciones={opciones}
              onChange={(ops) => {
                setOpciones(ops);
                handleUpdate({ opciones: ops });
              }}
            />
          )}

          {tipo === "verdadero_falso" && (
            <VerdaderoFalso
              initialValue={opciones.find(op => op.es_correcta)?.texto === "Verdadero"}
              onChange={(ops) => {
                setOpciones(ops);
                handleUpdate({ opciones: ops });
              }}
            />
          )}

          {tipo === "respuesta_corta" && (
            <RespuestaTexto
              tipo="corta"
              initialValue={opciones[0]?.texto || ""}
              onChange={(ops) => {
                setOpciones(ops);
                handleUpdate({ opciones: ops });
              }}
            />
          )}

          {tipo === "respuesta_larga" && (
            <RespuestaTexto
              tipo="larga"
              initialValue={opciones[0]?.texto || ""}
              onChange={(ops) => {
                setOpciones(ops);
                handleUpdate({ opciones: ops });
              }}
            />
          )}

          {tipo === "codigo" && (
            <PreguntaCodigo
              initialData={opciones[0] || {}}
              onChange={(dataCodigo) => {
                setOpciones([dataCodigo]);
                handleUpdate({ opciones: [dataCodigo] });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PreguntaEditor;
