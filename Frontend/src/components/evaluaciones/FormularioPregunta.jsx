import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

function FormularioPregunta({ preguntaInicial, onGuardar, onCancelar }) {
    const [formData, setFormData] = useState({
        texto: '',
        tipo: 'opcion_multiple',
        dificultad: 'medio',
        puntos: 1,
        tiempo_sugerido: 60,
        opciones: []
    });

    useEffect(() => {
        if (preguntaInicial) {
            // Procesar opciones según el tipo
            let opcionesProcesadas = preguntaInicial.opciones || [];
            
            // Para verdadero/falso, crear opciones predeterminadas si no existen
            if (preguntaInicial.tipo === 'verdadero_falso' && opcionesProcesadas.length === 0) {
                opcionesProcesadas = [
                    { texto: 'Verdadero', es_correcta: false },
                    { texto: 'Falso', es_correcta: false }
                ];
            }
            
            setFormData({
                texto: preguntaInicial.texto || '',
                tipo: preguntaInicial.tipo || 'opcion_multiple',
                dificultad: preguntaInicial.dificultad || 'medio',
                puntos: preguntaInicial.puntos || 1,
                tiempo_sugerido: preguntaInicial.tiempo_sugerido || 60,
                opciones: opcionesProcesadas
            });
        }
    }, [preguntaInicial]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.texto.trim()) {
            alert('El texto de la pregunta es requerido');
            return;
        }

        // Validar opciones para tipos que las requieren
        if (['opcion_multiple', 'seleccion_multiple', 'verdadero_falso'].includes(formData.tipo)) {
            if (formData.opciones.length === 0) {
                alert('Debes agregar al menos una opción');
                return;
            }
            
            const tieneCorrecta = formData.opciones.some(op => op.es_correcta);
            if (!tieneCorrecta) {
                alert('Debes marcar al menos una opción como correcta');
                return;
            }
        }

        onGuardar(formData);
    };

    const agregarOpcion = () => {
        setFormData({
            ...formData,
            opciones: [...formData.opciones, { texto: '', es_correcta: false }]
        });
    };

    const handleTipoChange = (nuevoTipo) => {
        let nuevasOpciones = [];
        
        // Para verdadero/falso, crear opciones predeterminadas
        if (nuevoTipo === 'verdadero_falso') {
            nuevasOpciones = [
                { texto: 'Verdadero', es_correcta: false },
                { texto: 'Falso', es_correcta: false }
            ];
        }
        
        setFormData({ ...formData, tipo: nuevoTipo, opciones: nuevasOpciones });
    };

    const actualizarOpcion = (index, campo, valor) => {
        const nuevasOpciones = [...formData.opciones];
        nuevasOpciones[index][campo] = valor;
        
        // Si es opción múltiple o verdadero/falso, solo una puede ser correcta
        if (campo === 'es_correcta' && valor && (formData.tipo === 'opcion_multiple' || formData.tipo === 'verdadero_falso')) {
            nuevasOpciones.forEach((op, i) => {
                if (i !== index) op.es_correcta = false;
            });
        }
        
        setFormData({ ...formData, opciones: nuevasOpciones });
    };

    const eliminarOpcion = (index) => {
        const nuevasOpciones = formData.opciones.filter((_, i) => i !== index);
        setFormData({ ...formData, opciones: nuevasOpciones });
    };

    const tiposRequierenOpciones = ['opcion_multiple', 'seleccion_multiple', 'verdadero_falso'];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Texto de la pregunta */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Texto de la Pregunta *
                </label>
                <textarea
                    value={formData.texto}
                    onChange={(e) => setFormData({ ...formData, texto: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
                    rows="3"
                    placeholder="Escribe la pregunta aquí..."
                    required
                />
            </div>

            {/* Tipo y configuración */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Tipo de Pregunta
                    </label>
                    <select
                        value={formData.tipo}
                        onChange={(e) => handleTipoChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    >
                        <option value="opcion_multiple">Opción Múltiple</option>
                        <option value="seleccion_multiple">Selección Múltiple</option>
                        <option value="verdadero_falso">Verdadero/Falso</option>
                        <option value="respuesta_corta">Respuesta Corta</option>
                        <option value="respuesta_larga">Respuesta Larga</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Dificultad
                    </label>
                    <select
                        value={formData.dificultad}
                        onChange={(e) => setFormData({ ...formData, dificultad: e.target.value })}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    >
                        <option value="facil">Fácil</option>
                        <option value="medio">Medio</option>
                        <option value="dificil">Difícil</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Puntos
                    </label>
                    <input
                        type="number"
                        value={formData.puntos}
                        onChange={(e) => setFormData({ ...formData, puntos: Number.parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        min="1"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Tiempo Sugerido (seg)
                    </label>
                    <input
                        type="number"
                        value={formData.tiempo_sugerido}
                        onChange={(e) => setFormData({ ...formData, tiempo_sugerido: Number.parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        min="10"
                        step="10"
                    />
                </div>
            </div>

            {/* Opciones (solo para tipos que las requieren) */}
            {tiposRequierenOpciones.includes(formData.tipo) && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-semibold text-slate-700">
                            Opciones de Respuesta * 
                            {formData.tipo === 'verdadero_falso' && 
                                <span className="text-xs text-slate-500 ml-2">(Selecciona la correcta)</span>
                            }
                        </label>
                        {/* Solo mostrar botón agregar si NO es verdadero/falso */}
                        {formData.tipo !== 'verdadero_falso' && (
                            <button
                                type="button"
                                onClick={agregarOpcion}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                + Agregar Opción
                            </button>
                        )}
                    </div>

                    <div className="space-y-2">
                        {formData.opciones.map((opcion, index) => (
                            <div key={index} className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <input
                                    type={formData.tipo === 'seleccion_multiple' ? 'checkbox' : 'radio'}
                                    checked={opcion.es_correcta}
                                    onChange={(e) => actualizarOpcion(index, 'es_correcta', e.target.checked)}
                                    className="w-4 h-4 text-green-600"
                                    title="Marcar como correcta"
                                    name={formData.tipo !== 'seleccion_multiple' ? 'respuesta_correcta' : undefined}
                                />
                                <input
                                    type="text"
                                    value={opcion.texto}
                                    onChange={(e) => actualizarOpcion(index, 'texto', e.target.value)}
                                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                    placeholder={`Opción ${index + 1}`}
                                    required
                                    disabled={formData.tipo === 'verdadero_falso'}
                                />
                                {/* Solo mostrar botón eliminar si NO es verdadero/falso */}
                                {formData.tipo !== 'verdadero_falso' && (
                                    <button
                                        type="button"
                                        onClick={() => eliminarOpcion(index)}
                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {formData.opciones.length === 0 && (
                        <p className="text-sm text-slate-500 italic mt-2">
                            Haz clic en "Agregar Opción" para añadir respuestas
                        </p>
                    )}
                </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                <button
                    type="button"
                    onClick={onCancelar}
                    className="px-6 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-semibold"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold shadow-md"
                >
                    <Save className="w-4 h-4" />
                    Guardar Pregunta
                </button>
            </div>
        </form>
    );
}

export default FormularioPregunta;
