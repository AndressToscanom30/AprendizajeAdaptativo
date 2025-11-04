import { useState, useRef, useEffect } from "react";
import { Play, Terminal, Lightbulb, Code2, CheckCircle, XCircle } from "lucide-react";

function PreguntaCodigo({ initialData = {}, onChange }) {
  const [codigoInicial, setCodigoInicial] = useState(
    initialData.codigo_inicial || `function miFuncion() {\n  // Escribe tu código aquí\n  \n}\n\n// Prueba tu función\nconsole.log(miFuncion());`
  );
  const [solucion, setSolucion] = useState(initialData.solucion || "");
  const [salidaEsperada, setSalidaEsperada] = useState(initialData.salida_esperada || "");
  const [pistas, setPistas] = useState(initialData.pistas || [""]);
  const [lenguaje, setLenguaje] = useState(initialData.lenguaje || "javascript");

  useEffect(() => {
    if (onChange) {
      onChange({
        codigo_inicial: codigoInicial,
        solucion: solucion,
        salida_esperada: salidaEsperada,
        pistas: pistas.filter(p => p.trim() !== ""),
        lenguaje: lenguaje,
        tipo: "codigo"
      });
    }
  }, [codigoInicial, solucion, salidaEsperada, pistas, lenguaje, onChange]);

  const agregarPista = () => {
    setPistas([...pistas, ""]);
  };

  const cambiarPista = (index, valor) => {
    const nuevasPistas = [...pistas];
    nuevasPistas[index] = valor;
    setPistas(nuevasPistas);
  };

  const eliminarPista = (index) => {
    if (pistas.length > 1) {
      setPistas(pistas.filter((_, i) => i !== index));
    }
  };

  const handleKeyDown = (e, setter) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      setter(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="space-y-6 bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
      {/* Configuración del Lenguaje */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-600" />
          Lenguaje de Programación
        </label>
        <select
          value={lenguaje}
          onChange={(e) => setLenguaje(e.target.value)}
          className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      {/* Código Inicial */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-green-600" />
          Código Inicial (Template para el estudiante)
        </label>
        <div className="bg-slate-900 rounded-lg overflow-hidden border-2 border-slate-700">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-slate-400 text-sm font-mono">{lenguaje}</span>
          </div>
          <textarea
            value={codigoInicial}
            onChange={(e) => setCodigoInicial(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, setCodigoInicial)}
            className="w-full h-48 p-4 bg-slate-900 text-green-400 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            style={{ lineHeight: '1.5' }}
            spellCheck={false}
            placeholder="// Código inicial que verán los estudiantes..."
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">Este es el código que los estudiantes verán al comenzar</p>
      </div>

      {/* Solución */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Solución Correcta (Código Completo)
        </label>
        <div className="bg-slate-900 rounded-lg overflow-hidden border-2 border-emerald-700">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-400 text-sm font-medium">Solución</span>
            </div>
            <span className="text-slate-400 text-sm font-mono">{lenguaje}</span>
          </div>
          <textarea
            value={solucion}
            onChange={(e) => setSolucion(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, setSolucion)}
            className="w-full h-48 p-4 bg-slate-900 text-emerald-400 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-inset"
            style={{ lineHeight: '1.5' }}
            spellCheck={false}
            placeholder="// Código solución completo y correcto..."
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">Solución de referencia (no se mostrará automáticamente al estudiante)</p>
      </div>

      {/* Salida Esperada */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-600" />
          Salida Esperada en Consola
        </label>
        <div className="bg-slate-900 rounded-lg overflow-hidden border-2 border-blue-700">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Output esperado</span>
          </div>
          <textarea
            value={salidaEsperada}
            onChange={(e) => setSalidaEsperada(e.target.value)}
            className="w-full h-24 p-4 bg-slate-900 text-blue-400 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            style={{ lineHeight: '1.5' }}
            spellCheck={false}
            placeholder="Resultado exacto que debe mostrar la consola..."
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          El código del estudiante se comparará con esta salida (debe coincidir exactamente)
        </p>
      </div>

      {/* Pistas */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          Pistas (Ayuda Progresiva)
        </label>
        <div className="space-y-3">
          {pistas.map((pista, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-amber-600">Pista {index + 1}</span>
                </div>
                <input
                  type="text"
                  value={pista}
                  onChange={(e) => cambiarPista(index, e.target.value)}
                  className="w-full px-4 py-2 border-2 border-amber-300 bg-amber-50 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder={`Ej: Usa un bucle for para recorrer el array`}
                />
              </div>
              {pistas.length > 1 && (
                <button
                  type="button"
                  onClick={() => eliminarPista(index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={agregarPista}
          className="mt-3 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-medium text-sm flex items-center gap-2"
        >
          <Lightbulb className="w-4 h-4" />
          Agregar Pista
        </button>
        <p className="text-xs text-slate-500 mt-2">
          Las pistas se mostrarán una por una cuando el estudiante las solicite
        </p>
      </div>

      {/* Vista Previa */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Play className="w-4 h-4" />
          Vista Previa
        </h4>
        <div className="space-y-2 text-sm text-blue-800">
          <p>✓ Lenguaje: <span className="font-mono font-semibold">{lenguaje}</span></p>
          <p>✓ Código inicial: {codigoInicial.split('\n').length} líneas</p>
          <p>✓ Solución: {solucion ? `${solucion.split('\n').length} líneas` : 'No definida'}</p>
          <p>✓ Salida esperada: {salidaEsperada ? `"${salidaEsperada.substring(0, 50)}..."` : 'No definida'}</p>
          <p>✓ Pistas disponibles: {pistas.filter(p => p.trim()).length}</p>
        </div>
      </div>
    </div>
  );
}

export default PreguntaCodigo;
