import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate(); 
    return (
        <div>
            <div className="bg-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">
                        <div className="text-left md:ml-10 w-full md:w-1/2 px-4 md:px-0">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">Aprendizaje<br /></h1>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-blue-500">Adaptativo</h1>
                            <div className="max-w-md">
                                <p className="text-gray-600 mb-4 text-sm md:text-base">
                                    Un sistema de evaluación inteligente que se adapta a tu ritmo y estilo de aprendizaje, proporcionando una experiencia personalizada única.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                                <button 
                                    onClick={() => navigate("/test")} 
                                    className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Comenzar test
                                </button>
                                <button 
                                    onClick={() => navigate("/about")} 
                                    className="w-full sm:w-auto text-gray-700 px-6 py-2 rounded-lg border hover:bg-gray-50"
                                >
                                    Más información
                                </button>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 flex justify-center p-4">
                            <img
                                src="/robot-miromeo.png"
                                alt="Robot Asistente"
                                className="w-full max-w-[300px] md:max-w-[400px] object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 py-8 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-xl md:text-2xl font-bold text-center mb-3">¿Cómo Funciona?</h2>
                        <p className="text-center mb-8 md:mb-15 text-sm md:text-base px-4">
                            Nuestro sistema utiliza algoritmos de IA para crear una experiencia de aprendizaje completamente personalizada y adaptativa.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-12 px-4">
                            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                                <div className="flex justify-center mb-4">
                                    <img src="/cebero.png" alt="IA" className="w-12 h-12 md:w-16 md:h-16" />
                                </div>
                                <p className="text-xs md:text-sm text-center">Implementación de inteligencia artificial que analiza tu patrón de respuesta.</p>
                            </div>
                            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                                <div className="flex justify-center mb-4">
                                    <img src="/pc.png" alt="Test" className="w-12 h-12 md:w-16 md:h-16" />
                                </div>
                                <p className="text-xs md:text-sm text-center">El test se ajusta automáticamente a tu nivel de conocimiento y velocidad de aprendizaje.</p>
                            </div>
                            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                                <div className="flex justify-center mb-4">
                                    <img src="/ex.png" alt="Personalización" className="w-12 h-12 md:w-16 md:h-16" />
                                </div>
                                <p className="text-xs md:text-sm text-center">Cada experiencia es única, creada específicamente para maximizar tu rendimiento.</p>
                            </div>
                            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                                <div className="flex justify-center mb-4">
                                    <img src="/barras.png" alt="Progreso" className="w-12 h-12 md:w-16 md:h-16" />
                                </div>
                                <p className="text-xs md:text-sm text-center">Obtén análisis detallados sobre tu progreso y áreas de mejora en tiempo real.</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-8 md:mt-16 bg-white p-4 md:p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
                        <h2 className="text-xl md:text-2xl font-bold mb-4">¿Listo para una experiencia de aprendizaje innovadora?</h2>
                        <p className="mb-6 text-sm md:text-base px-4">Descubre cómo la inteligencia artificial puede transformar tu proceso de evaluación y aprendizaje</p>
                        <button 
                            onClick={() => navigate("/test")} 
                            className="w-full sm:w-auto bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600"
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