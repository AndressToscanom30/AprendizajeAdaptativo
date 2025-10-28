import { useState } from "react";
import { PlusCircle, Clock, Calendar, Shuffle, Save } from "lucide-react";
import PreguntaEditor from "../../../components/evaluaciones/PreguntaEditor.jsx";

function CrearEvaluacionForm() {
    const [preguntas, setPreguntas] = useState([]);
    const [evaluacion, setEvaluacion] = useState({
        titulo: "",
        descripcion: "",
        duracion_minutos: "",
        comienza_en: "",
        termina_en: "",
        preguntas_revueltas: false,
        max_intentos: "",
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

    // 🧩 Agregar nueva pregunta
    const agregarPregunta = () => {
        setPreguntas((prev) => [
            ...prev,
            {
                id: Date.now(),
                titulo: "Pregunta sin título",
                descripcion: "",
                tipo: "opcion_multiple",
                opciones: [],
                obligatoria: false,
            },
        ]);
    };

    // ❌ Eliminar pregunta
    const eliminarPregunta = (id) => {
        setPreguntas((prev) => prev.filter((p) => p.id !== id));
    };

    // 🧠 Actualizar pregunta desde el hijo (PreguntaEditor)
    const actualizarPregunta = (id, nuevosDatos) => {
        setPreguntas((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...nuevosDatos } : p))
        );
    };

    // 💾 Guardar evaluación completa
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje("");

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:4000/api/evaluaciones", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    ...evaluacion,
                    configuracion: { preguntas },
                }),
            });

            if (!res.ok) throw new Error("Error al crear la evaluación");

            setMensaje("✅ Evaluación creada correctamente");
            setEvaluacion({
                titulo: "",
                descripcion: "",
                duracion_minutos: "",
                comienza_en: "",
                termina_en: "",
                preguntas_revueltas: false,
                max_intentos: "",
            });
            setPreguntas([]);
        } catch (error) {
            console.error(error);
            setMensaje("❌ Error al crear la evaluación");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full px-4 sm:px-8 py-10 bg-gray-50 min-h-screen transition-all duration-300">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                ✏️ Crear nueva evaluación
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-2xl p-6 space-y-6 border border-gray-100"
            >
                {/* ------------------ DATOS GENERALES ------------------ */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                        Título de la evaluación
                    </label>
                    <input
                        name="titulo"
                        value={evaluacion.titulo}
                        onChange={handleChange}
                        type="text"
                        placeholder="Ej: Evaluación de Lógica y Programación"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                        Descripción
                    </label>
                    <textarea
                        name="descripcion"
                        value={evaluacion.descripcion}
                        onChange={handleChange}
                        placeholder="Describe el propósito o los temas de la evaluación..."
                        className="w-full border border-gray-300 rounded-lg p-3 min-h-[120px] focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Duración (minutos)
                        </label>
                        <input
                            name="duracion_minutos"
                            value={evaluacion.duracion_minutos}
                            onChange={handleChange}
                            type="number"
                            min="1"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                            Intentos máximos permitidos
                        </label>
                        <input
                            name="max_intentos"
                            value={evaluacion.max_intentos}
                            onChange={handleChange}
                            type="number"
                            min="1"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Fecha de inicio
                        </label>
                        <input
                            name="comienza_en"
                            value={evaluacion.comienza_en}
                            onChange={handleChange}
                            type="date"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                            Fecha de finalización
                        </label>
                        <input
                            name="termina_en"
                            value={evaluacion.termina_en}
                            onChange={handleChange}
                            type="date"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Shuffle className="text-gray-600 w-5 h-5" />
                    <label className="text-gray-700 font-medium">
                        ¿Revolver preguntas?
                    </label>
                    <input
                        name="preguntas_revueltas"
                        checked={evaluacion.preguntas_revueltas}
                        onChange={handleChange}
                        type="checkbox"
                        className="w-5 h-5 accent-purple-600"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 shadow-md ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
                            }`}
                    >
                        <Save className="w-5 h-5" />
                        {loading ? "Guardando..." : "Guardar evaluación"}
                    </button>
                </div>
            </form>

            {/* MENSAJE */}
            {mensaje && (
                <p
                    className={`mt-4 text-center font-medium ${mensaje.includes("✅")
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                >
                    {mensaje}
                </p>
            )}

            {/* ------------------ PREGUNTAS ------------------ */}
            <div className="max-w-4xl mx-auto mt-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Preguntas de la evaluación
                </h2>

                {preguntas.map((p) => (
                    <PreguntaEditor
                        key={p.id}
                        pregunta={p}
                        onDelete={() => eliminarPregunta(p.id)}
                        onChange={(newP) => actualizarPregunta(p.id, newP)}
                    />
                ))}

                <div className="flex justify-center mt-6">
                    <button
                        type="button"
                        onClick={agregarPregunta}
                        className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Agregar pregunta
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CrearEvaluacionForm;
