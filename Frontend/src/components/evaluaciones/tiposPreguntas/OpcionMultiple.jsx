import { useState, useRef, useEffect } from "react";

function OpcionMultiple({ initialOpciones = [], onChange }) {
  const [opciones, setOpciones] = useState(
    initialOpciones.length > 0 
      ? initialOpciones.map((op, idx) => ({ id: idx + 1, texto: op.texto, correcta: op.es_correcta }))
      : [
          { id: 1, texto: "Opción 1", correcta: false },
          { id: 2, texto: "Opción 2", correcta: false },
        ]
  );
  const [correcto, setCorrecto] = useState(() => {
    const correctaIndex = initialOpciones.findIndex(op => op.es_correcta);
    return correctaIndex >= 0 ? correctaIndex + 1 : null;
  });
  const nextId = useRef(initialOpciones.length > 0 ? initialOpciones.length + 1 : 3);
  const radioNameRef = useRef(`opciones-${Date.now()}`);

  useEffect(() => {
    if (onChange) {
      const opcionesFormateadas = opciones.map(op => ({
        texto: op.texto,
        es_correcta: op.id === correcto
      }));
      onChange(opcionesFormateadas);
    }
  }, [opciones, correcto]);

  const agregarOpcion = () => {
    const id = nextId.current++;
    setOpciones((prev) => [...prev, { id, texto: `Opción ${id}`, correcta: false }]);
  };

  const cambiarTexto = (id, nuevoTexto) => {
    setOpciones((prev) =>
      prev.map((o) => (o.id === id ? { ...o, texto: nuevoTexto } : o))
    );
  };

  const eliminarOpcion = (id) => {
    if (opciones.length <= 2) return;
    setOpciones((prev) => prev.filter((o) => o.id !== id));
    if (correcto === id) setCorrecto(null);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3 border space-y-2">
      <h4 className="font-medium text-gray-700 mb-2">Opciones</h4>

      {opciones.map((opcion) => (
        <div
          key={opcion.id}
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
        >
          <input
            type="radio"
            name={radioNameRef.current}
            checked={correcto === opcion.id}
            onChange={() => setCorrecto(opcion.id)}
            className="h-4 w-4 text-purple-600"
          />
          <input
            value={opcion.texto}
            onChange={(e) => cambiarTexto(opcion.id, e.target.value)}
            className="flex-1 border rounded px-2 py-1 focus:outline-none text-sm"
          />
          <button
            onClick={() => eliminarOpcion(opcion.id)}
            className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
            disabled={opciones.length <= 2}
            title={
              opciones.length <= 2
                ? "Se requieren al menos 2 opciones"
                : "Eliminar opción"
            }
          >
            ✕
          </button>
        </div>
      ))}

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={agregarOpcion}
          className="text-purple-600 text-sm hover:text-green-600 transition-colors"
        >
          + Añadir opción
        </button>
        <div className="text-xs text-gray-500">
          Correcta:{" "}
          {correcto
            ? `Opción ${
                opciones.findIndex((o) => o.id === correcto) + 1
              } seleccionada`
            : "No seleccionada"}
        </div>
      </div>
    </div>
  );
}

export default OpcionMultiple;
