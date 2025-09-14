import LinesChart from "../components/LinesChart";
import PiesChart from "../components/PiesChart";

function Dashboard() {
    return (
        <div className="min-h-screen bg-[#f4f8fd] py-8 px-2 sm:px-6 flex flex-col items-center">
            <div className="w-full max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <a href="/" className="text-gray-600 hover:underline text-sm">&larr; Volver al inicio</a>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm">Repetir test</button>
                </div>
                <div className="flex flex-col items-center mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <img src="/AA-logo.png" alt="Logo" className="w-8 h-8" />
                        <span className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold text-base flex items-center gap-2">
                            Análisis completado con IA
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-1">Resultados del Test</h1>
                    <p className="text-gray-600 text-center text-sm mb-2">Análisis detallado de tu rendimiento en programación</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                        <img src="/barras.png" alt="Puntuación" className="w-10 h-10 mb-2" />
                        <div className="font-bold text-2xl">0%</div>
                        <div className="text-gray-500 text-xs">Puntuación general</div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                        <img src="/cebero.png" alt="Precisión" className="w-10 h-10 mb-2" />
                        <div className="font-bold text-2xl">0%</div>
                        <div className="text-gray-500 text-xs">Precisión</div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                        <img src="/pc.png" alt="Tiempo" className="w-10 h-10 mb-2" />
                        <div className="font-bold text-2xl">5s</div>
                        <div className="text-gray-500 text-xs">Tiempo promedio</div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                        <img src="/ex.png" alt="Nivel" className="w-10 h-10 mb-2" />
                        <div className="font-bold text-xl text-blue-500">Principiante</div>
                        <div className="text-gray-500 text-xs">Nivel</div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                        <div className="font-semibold mb-2">Distribución de respuestas</div>
                        <div className="w-full flex justify-center">
                            <PiesChart />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                        <div className="font-semibold mb-2">Rendimiento por Tema</div>
                        <div className="w-full flex justify-center">
                            <LinesChart />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="font-semibold text-green-600 mb-2">Fortalezas</div>
                        <ul className="text-sm text-gray-700 list-disc list-inside">
                            <li>Velocidad de respuesta excelente</li>
                        </ul>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="font-semibold text-orange-500 mb-2">Áreas de Mejora</div>
                        <ul className="text-sm text-gray-700 list-disc list-inside">
                            <li>Necesita refuerzo en Variables y Tipos de Datos</li>
                            <li>Necesita refuerzo en Funciones</li>
                            <li>Necesita refuerzo en Arrays</li>
                            <li>Necesita refuerzo en Objetos</li>
                            <li>Necesita refuerzo en Programación Asíncrona</li>
                            <li>Necesita refuerzo en Algoritmos</li>
                        </ul>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="font-semibold text-blue-500 mb-2">Recomendaciones</div>
                        <ul className="text-sm text-gray-700 list-disc list-inside">
                            <li>Practica más ejercicios de Variables y Tipos de Datos para mejorar tu comprensión</li>
                            <li>Practica más ejercicios de Funciones para mejorar tu comprensión</li>
                            <li>Practica más ejercicios de Arrays para mejorar tu comprensión</li>
                            <li>Practica más ejercicios de Objetos para mejorar tu comprensión</li>
                            <li>Practica más ejercicios de Programación Asíncrona para mejorar tu comprensión</li>
                            <li>Practica más ejercicios de Algoritmos para mejorar tu comprensión</li>
                            <li>Considera repasar los conceptos fundamentales</li>
                        </ul>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 mb-8">
                    <div className="font-bold mb-2">Análisis Detallado por Tema</div>
                    <p className="text-gray-600 text-sm mb-4">Desglose completo de tu rendimiento en cada área</p>
                    <div className="space-y-4">
                        {[
                            {tema: "Variables y Tipos de Datos", tiempo: "4s"},
                            {tema: "Funciones", tiempo: "4s"},
                            {tema: "Arrays", tiempo: "2s"},
                            {tema: "Objetos", tiempo: "2s"},
                            {tema: "Programación Asíncrona", tiempo: "2s"},
                            {tema: "Algoritmos", tiempo: "2s"},
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
                                <div>
                                    <div className="font-semibold text-gray-800">{item.tema}</div>
                                    <div className="text-xs text-gray-500">Tiempo promedio: {item.tiempo}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-red-500 font-semibold">0/1</span>
                                    <span className="text-xs text-red-500">0%</span>
                                    <span className="text-xs text-red-500">Necesita refuerzo</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;