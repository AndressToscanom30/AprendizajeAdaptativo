import { useState } from "react";

function VerdaderoFalso() {
  const [correcta, setCorrecta] = useState("verdadero");

  return (
    <div className="bg-gray-50 rounded-lg p-3 border space-y-2">
      <h4 className="font-medium text-gray-700 mb-2">Verdadero o Falso</h4>

      {["verdadero", "falso"].map((opcion) => (
        <label
          key={opcion}
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
        >
          <input
            type="radio"
            name="vf"
            value={opcion}
            checked={correcta === opcion}
            onChange={() => setCorrecta(opcion)}
            className="h-4 w-4 text-purple-600"
          />
          <span className="capitalize">{opcion}</span>
        </label>
      ))}

      <div className="mt-2 text-sm text-gray-500">
        Correcta: <strong>{correcta}</strong>
      </div>
    </div>
  );
}

export default VerdaderoFalso;
