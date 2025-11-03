import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Clock, Calendar, Shuffle, Save } from "lucide-react";
import PreguntaEditor from "../../../components/evaluaciones/PreguntaEditor.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";

function CrearEvaluacionForm() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [preguntas, setPreguntas] = useState([]);
    const [evaluacion, setEvaluacion] = useState({
        titulo: "",
        descripcion: "",
        duracion_minutos: "",
        comienza_en: "",
        termina_en: "",
        preguntas_revueltas: false,
        max_intentos: 3,
        curso_id: null,
        activa: true
    });
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEvaluacion({
            ...evaluacion,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const agregarPregunta = () => {
        setPreguntas((prev) => [
            ...prev,
            {
                id: Date.now(),
                texto: "",
                tipo: "opcion_multiple",
                opciones: [],
                respuesta_correcta: "",
                puntaje: 1,
            },
        ]);
    };

    const eliminarPregunta = (id) => {
        setPreguntas((prev) => prev.filter((p) => p.id !== id));
    };

    const actualizarPregunta = (id, nuevosDatos) => {
        setPreguntas((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...nuevosDatos } : p))
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            // Crear evaluación
            const evaluacionData = {
                ...evaluacion,
                profesor_id: user?.id,
                duracion_minutos: parseInt(evaluacion.duracion_minutos),
                max_intentos: parseInt(evaluacion.max_intentos),
            };

            const resEval = await fetch("http://localhost:4000/api/evaluaciones", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(evaluacionData),
            });

            if (!resEval.ok) {
                const errorData = await resEval.json();
                throw new Error(errorData.error || "Error al crear la evaluación");
            }

            const nuevaEval = await resEval.json();

            // Crear preguntas si hay
            if (preguntas.length > 0) {
                for (const pregunta of preguntas) {
                    const preguntaData = {
                        texto: pregunta.texto || pregunta.titulo || "Pregunta sin título",
                        tipo: pregunta.tipo || "opcion_multiple",
                        dificultad: pregunta.dificultad || "media",
                        metadata: JSON.stringify({
                            opciones: pregunta.opciones || [],
                            respuesta_correcta: pregunta.respuesta_correcta || "",
                        }),
                        explicacion: pregunta.descripcion || "",
                    };

                    const resCrearPregunta = await fetch("http://localhost:4000/api/preguntas", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify(preguntaData),
                    });

                    if (!resCrearPregunta.ok) {
                        console.warn("Error al crear una pregunta");
                        continue;
                    }

                    const nuevaPregunta = await resCrearPregunta.json();

                    // Asociar pregunta a evaluación
                    await fetch(
                        `http://localhost:4000/api/evaluaciones/${nuevaEval.id}/preguntas`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`,
                            },
                            body: JSON.stringify({ preguntaId: nuevaPregunta.id }),
                        }
                    );
                }
            }

            setMensaje("✅ Evaluación creada exitosamente");
            
            // Redirigir después de 1.5 segundos
            setTimeout(() => {
                navigate('/profesor/evaluaciones');
            }, 1500);

        } catch (error) {
            console.error(error);
            setMensaje(`❌ ${error.message || 'Error al crear la evaluación'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full px-4 sm:px-8 py-10 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 min-h-screen transition-all duration-300">
            {/* Header con icono */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8 transform transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-center gap-4 mb-2">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg">
                        <PlusCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Crear nueva evaluación
                        </h1>
                        <p className="text-slate-600 mt-1 text-lg">
                            Completa la información general y agrega preguntas
                        </p>
                    </div>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-xl rounded-3xl p-8 space-y-8 border border-slate-200 transform transition-all duration-300 hover:shadow-2xl"
            >
                {/* Título */}
                <div>
                    <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2 text-lg">
                        <PlusCircle className="w-5 h-5 text-blue-600" /> 
                        Título de la evaluación
                    </label>
                    <input
                        name="titulo"
                        value={evaluacion.titulo}
                        onChange={handleChange}
                        type="text"
                        placeholder="Ej: Evaluación de Lógica y Programación"
                        className="w-full border-2 border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 hover:border-blue-400"
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2 text-lg">
                        📝 Descripción
                    </label>
                    <textarea
                        name="descripcion"
                        value={evaluacion.descripcion}
                        onChange={handleChange}
                        placeholder="Describe el propósito o los temas de la evaluación..."
                        className="w-full border-2 border-slate-300 rounded-xl p-3 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none transition-all duration-200 hover:border-blue-400"
                    ></textarea>
                </div>

                {/* Duración e Intentos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                            <Clock className="w-5 h-5 text-blue-600" /> 
                            Duración (minutos)
                        </label>
                        <input
                            name="duracion_minutos"
                            value={evaluacion.duracion_minutos}
                            onChange={handleChange}
                            type="number"
                            min="1"
                            className="w-full border-2 border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 hover:border-blue-400"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                            🔄 Intentos máximos permitidos
                        </label>
                        <input
                            name="max_intentos"
                            value={evaluacion.max_intentos}
                            onChange={handleChange}
                            type="number"
                            min="1"
                            className="w-full border-2 border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 hover:border-blue-400"
                        />
                    </div>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                            <Calendar className="w-5 h-5 text-blue-600" /> 
                            Fecha de inicio
                        </label>
                        <input
                            name="comienza_en"
                            value={evaluacion.comienza_en}
                            onChange={handleChange}
                            type="date"
                            className="w-full border-2 border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 hover:border-blue-400"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                            <Calendar className="w-5 h-5 text-blue-600" /> 
                            Fecha de finalización
                        </label>
                        <input
                            name="termina_en"
                            value={evaluacion.termina_en}
                            onChange={handleChange}
                            type="date"
                            className="w-full border-2 border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 hover:border-blue-400"
                        />
                    </div>
                </div>

                {/* Checkbox Revolver Preguntas */}
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
                    <Shuffle className="text-blue-600 w-6 h-6" />
                    <label className="text-slate-700 font-medium text-lg flex-1">
                        ¿Revolver preguntas?
                    </label>
                    <input
                        name="preguntas_revueltas"
                        checked={evaluacion.preguntas_revueltas}
                        onChange={handleChange}
                        type="checkbox"
                        className="w-6 h-6 accent-blue-600 cursor-pointer transition-transform duration-200 hover:scale-110"
                    />
                </div>

                {/* Botón Guardar */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center gap-3 px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 shadow-lg transform ${loading
                            ? "bg-slate-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl hover:-translate-y-1"
                            }`}
                    >
                        <Save className="w-6 h-6" />
                        {loading ? "Guardando..." : "Guardar evaluación"}
                    </button>
                </div>
            </form>

            {/* Mensaje de éxito/error */}
            {mensaje && (
                <div
                    className={`mt-6 p-4 rounded-xl text-center font-semibold text-lg shadow-lg ${mensaje.includes("✅")
                        ? "bg-green-50 text-green-700 border-2 border-green-300"
                        : "bg-red-50 text-red-700 border-2 border-red-300"
                        }`}
                >
                    {mensaje}
                </div>
            )}

            {/* Sección de Preguntas */}
            <div className="mt-10 bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-3 shadow-lg">
                        <PlusCircle className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        Preguntas de la evaluación
                    </h2>
                </div>

                {preguntas.map((p) => (
                    <PreguntaEditor
                        key={p.id}
                        pregunta={p}
                        onDelete={() => eliminarPregunta(p.id)}
                        onChange={(newP) => actualizarPregunta(p.id, newP)}
                    />
                ))}

                {/* Botón Agregar Pregunta */}
                <div className="flex justify-center mt-8">
                    <button
                        type="button"
                        onClick={agregarPregunta}
                        className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-lg"
                    >
                        <PlusCircle className="w-6 h-6" />
                        Agregar pregunta
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CrearEvaluacionForm;
