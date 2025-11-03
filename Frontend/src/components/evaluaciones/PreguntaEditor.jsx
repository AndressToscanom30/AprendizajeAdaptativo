import { useState } from "react";
import OpcionMultiple from "./tiposPreguntas/OpcionMultiple";
import SeleccionMultiple from "./tiposPreguntas/SeleccionMultiple";
import VerdaderoFalso from "./tiposPreguntas/VerdaderoFalso";
import RespuestaTexto from "./tiposPreguntas/RespuestaTexto";

function PreguntaEditor({ onChange, initialData = {} }) {
  const [tipo, setTipo] = useState(initialData.tipo || "opcion_multiple");
  const [titulo, setTitulo] = useState(initialData.titulo || "Pregunta sin título");
  const [descripcion, setDescripcion] = useState(initialData.descripcion || "");
  const [opciones, setOpciones] = useState(initialData.opciones || []);

  const handleUpdate = (updatedFields) => {
    const updated = {
      tipo,
      titulo,
      descripcion,
      opciones,
      ...updatedFields,
    };
    onChange && onChange(updated);
  };

  const handleTipoChange = (e) => {
    const newTipo = e.target.value;
    setTipo(newTipo);
    handleUpdate({ tipo: newTipo });
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

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-4 space-y-4">
      <input
        type="text"
        value={titulo}
        onChange={handleTituloChange}
        placeholder="Escribe el título de la pregunta"
        className="w-full text-lg font-medium border-b focus:outline-none pb-1"
      />

      <textarea
        value={descripcion}
        onChange={handleDescripcionChange}
        placeholder="Descripción o contexto (opcional)"
        className="w-full text-sm border rounded-md p-2 focus:outline-none resize-none"
      />

      <div>
        <label className="text-sm text-gray-600">Tipo de pregunta:</label>
        <select
          value={tipo}
          onChange={handleTipoChange}
          className="block w-full border rounded-md mt-1 p-2 focus:outline-none"
        >
          <option value="opcion_multiple">Opción múltiple</option>
          <option value="seleccion_multiple">Selección múltiple</option>
          <option value="verdadero_falso">Verdadero o falso</option>
          <option value="respuesta_corta">Respuesta corta</option>
          <option value="respuesta_larga">Respuesta larga</option>
          <option value="completar_blanco">Completar blanco</option>
          <option value="relacion_par">Relacionar par</option>
        </select>
      </div>

      {/* Render dinámico según el tipo */}
      {tipo === "opcion_multiple" && (
        <OpcionMultiple onChange={(ops) => handleUpdate({ opciones: ops })} />
      )}
      {tipo === "seleccion_multiple" && (
        <SeleccionMultiple onChange={(ops) => handleUpdate({ opciones: ops })} />
      )}
      {tipo === "verdadero_falso" && (
        <VerdaderoFalso onChange={(ops) => handleUpdate({ opciones: ops })} />
      )}
      {tipo === "respuesta_corta" && (
        <RespuestaTexto tipo="corta" onChange={(resp) => handleUpdate({ respuesta: resp })} />
      )}
      {tipo === "respuesta_larga" && (
        <RespuestaTexto tipo="larga" onChange={(resp) => handleUpdate({ respuesta: resp })} />
      )}
    </div>
  );
}

export default PreguntaEditor;
