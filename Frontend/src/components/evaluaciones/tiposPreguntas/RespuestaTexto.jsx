import { useState, useEffect } from "react";

function RespuestaTexto({ tipo = "corta", initialValue = "", onChange }) {
  const [respuesta, setRespuesta] = useState(initialValue);

  const isLarga = tipo === "larga";

  // Notificar cambios al padre
  useEffect(() => {
    if (onChange) {
      const opciones = [{ texto: respuesta, es_correcta: true }];
      onChange(opciones);
    }
  }, [respuesta]);

  return (
    <div className="bg-gray-50 rounded-lg p-3 border space-y-2">

      {isLarga ? (
        <textarea
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
          placeholder="Escribe la respuesta esperada..."
          className="w-full border rounded-md p-2 focus:outline-none resize-y min-h-[100px]"
        />
      ) : (
        <input
          type="text"
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
          placeholder="Escribe la respuesta esperada..."
          className="w-full border rounded-md p-2 focus:outline-none"
        />
      )}
    </div>
  );
}

export default RespuestaTexto;
