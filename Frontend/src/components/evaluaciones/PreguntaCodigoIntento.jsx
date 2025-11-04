import { useState, useRef } from 'react';
import { Play, Terminal, RotateCcw, Lightbulb, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

function PreguntaCodigoIntento({ pregunta, respuesta, onChange }) {
  // Obtener datos del metadata
  const dataPregunta = pregunta.opciones[0]?.metadata || {};
  const codigoInicial = dataPregunta.codigo_inicial || '// Escribe tu código aquí\n';
  
  const [codigo, setCodigo] = useState(respuesta?.codigo || codigoInicial);
  const [output, setOutput] = useState('');
  const [ejecutando, setEjecutando] = useState(false);
  const [error, setError] = useState(false);
  const [pistaActual, setPistaActual] = useState(0);
  const [mostrarSolucion, setMostrarSolucion] = useState(false);
  const textareaRef = useRef(null);

  const pistas = dataPregunta.pistas || [];
  const solucion = dataPregunta.solucion || '';
  const salidaEsperada = dataPregunta.salida_esperada || '';
  const lenguaje = dataPregunta.lenguaje || 'javascript';

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      setCodigo(newValue);
      onChange({ codigo: newValue });
      setTimeout(() => {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
      }, 0);
    }
  };

  const ejecutarCodigo = () => {
    setEjecutando(true);
    setError(false);
    setOutput('');

    setTimeout(() => {
      try {
        // Capturar console.log
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '));
        };

        // Ejecutar código
        const func = new Function(codigo);
        func();

        // Restaurar console.log
        console.log = originalLog;

        const resultado = logs.join('\n');
        setOutput(resultado);
        
        // Actualizar respuesta con el código y output
        onChange({ 
          codigo: codigo,
          output: resultado,
          es_correcta: resultado.trim() === salidaEsperada.trim()
        });

      } catch (err) {
        setError(true);
        setOutput(`Error: ${err.message}`);
        onChange({ 
          codigo: codigo,
          output: `Error: ${err.message}`,
          es_correcta: false
        });
      } finally {
        setEjecutando(false);
      }
    }, 300);
  };

  const reiniciarCodigo = () => {
    const codigoInicial = dataPregunta.codigo_inicial || '';
    setCodigo(codigoInicial);
    setOutput('');
    setError(false);
    onChange({ codigo: codigoInicial });
  };

  const siguientePista = () => {
    if (pistaActual < pistas.length - 1) {
      setPistaActual(pistaActual + 1);
    }
  };

  const handleCodigoChange = (e) => {
    const newCodigo = e.target.value;
    setCodigo(newCodigo);
    onChange({ codigo: newCodigo });
  };

  const outputCoincide = output.trim() === salidaEsperada.trim();

  return (
    <div className="space-y-4">
      {/* Editor de Código */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-green-600" />
            Editor de Código ({lenguaje || 'JavaScript'})
          </label>
          <button
            type="button"
            onClick={reiniciarCodigo}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar
          </button>
        </div>
        
        <div className="bg-slate-900 rounded-lg overflow-hidden border-2 border-slate-700">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-slate-400 text-sm font-mono">{lenguaje || 'javascript'}</span>
          </div>
          <textarea
            ref={textareaRef}
            value={codigo}
            onChange={handleCodigoChange}
            onKeyDown={handleKeyDown}
            className="w-full h-64 p-4 bg-slate-900 text-green-400 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            style={{ lineHeight: '1.5' }}
            spellCheck={false}
            placeholder="// Escribe tu código aquí..."
          />
        </div>
      </div>

      {/* Botón Ejecutar */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={ejecutarCodigo}
          disabled={ejecutando || !codigo.trim()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {ejecutando ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Ejecutando...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Ejecutar Código
            </>
          )}
        </button>

        {pistas.length > 0 && pistaActual < pistas.length && (
          <button
            type="button"
            onClick={siguientePista}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <Lightbulb className="w-5 h-5" />
            Ver Pista ({pistaActual + 1}/{pistas.length})
          </button>
        )}

        <button
          type="button"
          onClick={() => setMostrarSolucion(!mostrarSolucion)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium"
        >
          {mostrarSolucion ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          {mostrarSolucion ? 'Ocultar' : 'Ver'} Solución
        </button>
      </div>

      {/* Pista Actual */}
      {pistas.length > 0 && pistaActual < pistas.length && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 text-sm mb-1">💡 Pista {pistaActual + 1}:</p>
              <p className="text-amber-800">{pistas[pistaActual]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Solución */}
      {mostrarSolucion && solucion && (
        <div className="bg-slate-900 rounded-lg overflow-hidden border-2 border-emerald-700">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-400 text-sm font-medium">Solución</span>
            </div>
          </div>
          <pre className="p-4 text-emerald-400 font-mono text-sm overflow-x-auto">
            {solucion}
          </pre>
        </div>
      )}

      {/* Output */}
      {output && (
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-600" />
            Salida del Programa
          </label>
          <div className={`bg-slate-900 rounded-lg overflow-hidden border-2 ${
            error ? 'border-red-700' : outputCoincide ? 'border-green-700' : 'border-blue-700'
          }`}>
            <div className={`flex items-center justify-between px-4 py-2 border-b ${
              error ? 'bg-red-900/30 border-red-700' : outputCoincide ? 'bg-green-900/30 border-green-700' : 'bg-slate-800 border-slate-700'
            }`}>
              <div className="flex items-center gap-2">
                {error ? (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm font-medium">Error</span>
                  </>
                ) : outputCoincide ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">¡Correcto!</span>
                  </>
                ) : (
                  <>
                    <Terminal className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 text-sm font-medium">Output</span>
                  </>
                )}
              </div>
            </div>
            <pre className={`p-4 font-mono text-sm overflow-x-auto ${
              error ? 'text-red-400' : outputCoincide ? 'text-green-400' : 'text-blue-400'
            }`}>
              {output}
            </pre>
          </div>

          {/* Salida Esperada */}
          {salidaEsperada && !outputCoincide && !error && (
            <div className="mt-3 bg-slate-100 border-2 border-slate-300 rounded-lg p-4">
              <p className="text-sm font-semibold text-slate-700 mb-2">Salida Esperada:</p>
              <pre className="text-sm text-slate-800 font-mono">{salidaEsperada}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PreguntaCodigoIntento;
