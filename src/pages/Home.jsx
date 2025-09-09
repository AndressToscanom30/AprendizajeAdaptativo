import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate(); 
    return (
        <div>
            <div className="bg-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between w-full">
                        <div className="text-left ml-10">
                            <h1 className="text-4xl font-bold mb-2">Aprendizaje<br /></h1>
                            <h1 className="text-4xl font-bold mb-2 text-blue-500">Adaptativo</h1>
                            <div className="w-200">
                                <p className="text-gray-600 mb-4">
                                    Un sistema de evaluación inteligente que se adapta a tu ritmo y estilo de aprendizaje, proporcionando una experiencia personalizada única.
                                </p>
                            </div>
                            <div className="flex gap-8">
                                <button 
                                    onClick={() => navigate("/test")} 
                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Comenzar test
                                </button>
                                <button 
                                    onClick={() => navigate("/about")} 
                                    className="text-gray-700 px-6 py-2 rounded-lg border hover:bg-gray-50"
                                >
                                    Más información
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <img
                                src="/robot-miromeo.png"
                                alt="Robot Asistente"
                                className="max-w-[400px] w-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 py-16">
                <div className="container mx-auto px-4 justify-items-center">
                    <div className="w-300 ">
                        <h2 className="text-2xl font-bold text-center mb-3">¿Cómo Funciona?</h2>
                        <p className="text-center mb-15">
                            Nuestro sistema utiliza algoritmos de IA para crear una experiencia de aprendizaje completamente personalizada y adaptativa.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex justify-center mb-4">
                                    <img src="/cebero.png" alt="IA" className="w-16 h-16" />
                                </div>
                                <p className="text-sm">Implementación de inteligencia artificial que analiza tu patrón de respuesta.</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex justify-center mb-4">
                                    <img src="/pc.png" alt="Test" className="w-16 h-16" />
                                </div>
                                <p className="text-sm">El test se ajusta automáticamente a tu nivel de conocimiento y velocidad de aprendizaje.</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex justify-center mb-4">
                                    <img src="/ex.png" alt="Personalización" className="w-16 h-16" />
                                </div>
                                <p className="text-sm">Cada experiencia es única, creada específicamente para maximizar tu rendimiento.</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex justify-center mb-4">
                                    <img src="/barras.png" alt="Progreso" className="w-16 h-16" />
                                </div>
                                <p className="text-sm">Obtén análisis detallados sobre tu progreso y áreas de mejora en tiempo real.</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-16 bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-bold mb-4">¿Listo para una experiencia de aprendizaje innovadora?</h2>
                        <p className="mb-6">Descubre cómo la inteligencia artificial puede transformar tu proceso de evaluación y aprendizaje</p>
                        <button 
                            onClick={() => navigate("/test")} 
                            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600"
                        >
                            Iniciar test
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;