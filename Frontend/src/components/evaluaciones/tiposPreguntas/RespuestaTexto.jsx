import { useState } from "react";

function RespuestaTexto({ tipo = "corta" }) {
  const [respuesta, setRespuesta] = useState("");

  const isLarga = tipo === "larga";

  return (
    <div className="bg-gray-50 rounded-lg p-3 border space-y-2">

      {isLarga ? (
        <textarea
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
          placeholder="Escribe la respuesta del estudiante..."
          className="w-full border rounded-md p-2 focus:outline-none resize-y min-h-[100px]"
        />
      ) : (
        <input
          type="text"
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
          placeholder="Escribe la respuesta del estudiante..."
          className="w-full border rounded-md p-2 focus:outline-none"
        />
      )}
    </div>
  );
}

export default RespuestaTexto;
