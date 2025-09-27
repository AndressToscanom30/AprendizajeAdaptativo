import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Home() {
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [activeCard, setActiveCard] = useState(null);

    useEffect(() => {
        setIsVisible(true);

        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX - window.innerWidth / 2) / window.innerWidth,
                y: (e.clientY - window.innerHeight / 2) / window.innerHeight
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const features = [
        {
            icon: "/cebero.png",
            title: "Inteligencia Artificial",
            description: "Algoritmos avanzados que analizan tu patrón de respuesta en tiempo real para optimizar tu experiencia de aprendizaje.",
            delay: "0ms"
        },
        {
            icon: "/pc.png",
            title: "Adaptación Dinámica",
            description: "El sistema se ajusta automáticamente a tu nivel de conocimiento y velocidad de aprendizaje única.",
            delay: "150ms"
        },
        {
            icon: "/ex.png",
            title: "Experiencia Personalizada",
            description: "Cada sesión es completamente única, diseñada específicamente para maximizar tu potencial.",
            delay: "300ms"
        },
        {
            icon: "/barras.png",
            title: "Análisis en Tiempo Real",
            description: "Obtén insights detallados sobre tu progreso y áreas de oportunidad mientras aprendes.",
            delay: "450ms"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl"
                    style={{
                        transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
                    }}
                ></div>
                <div
                    className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"
                    style={{
                        transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`
                    }}
                ></div>
                <div
                    className="absolute -bottom-20 right-1/4 w-64 h-64 bg-blue-100 rounded-full opacity-25 blur-2xl"
                    style={{
                        transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
                    }}
                ></div>

                <div className="absolute inset-0">
                    <svg className="w-full h-full opacity-5" viewBox="0 0 1000 1000">
                        <defs>
                            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1e40af" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
            </div>

            <div className="relative z-10">
                <div className="min-h-screen flex items-center">
                    <div className="container mx-auto px-4 py-8">
                        <div className={`flex flex-col lg:flex-row items-center justify-between gap-12 transition-all duration-1200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
                            <div className="lg:w-1/2 text-center lg:text-left lg:ml-10">
                                <div className="mb-8">
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4 text-slate-800 leading-tight">
                                        <span className="font-extralight">Aprendizaje</span>
                                        <br />
                                        <span className="font-bold text-blue-600 relative">
                                            Adaptativo
                                            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transform origin-left scale-x-0 animate-[scaleIn_1.5s_ease-out_1s_forwards]"></div>
                                        </span>
                                    </h1>
                                </div>

                                <div className="mb-10">
                                    <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
                                        Un sistema de evaluación <span className="text-blue-600 font-medium">inteligente</span> que se adapta a tu ritmo y estilo de aprendizaje, proporcionando una experiencia completamente <span className="text-blue-600 font-medium">personalizada</span>.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                    <button
                                        onClick={() => navigate("/diagnostico")}
                                        className="group relative px-8 py-4 bg-blue-600 text-white font-medium text-lg rounded-xl transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 hover:-translate-y-1"
                                    >
                                        <span className="flex items-center justify-center gap-3">
                                            Comenzar test
                                            <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => navigate("/about")}
                                        className="px-8 py-4 text-slate-700 font-medium text-lg rounded-xl border-2 border-slate-300 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        Más información
                                    </button>
                                </div>
                            </div>

                            <div className="w-full lg:w-1/2 flex justify-center p-4">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-full border border-blue-200 rounded-full opacity-30 animate-spin" style={{ animationDuration: '30s' }}></div>
                                    </div>
                                    <div className="absolute inset-8 flex items-center justify-center">
                                        <div className="w-full h-full border border-blue-300 rounded-full opacity-40 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }}></div>
                                    </div>

                                    <img
                                        src="/robot-miromeo.png"
                                        alt="Robot Asistente"
                                        className="relative w-full max-w-[300px] md:max-w-[400px] lg:max-w-lg object-contain transition-all duration-700 hover:scale-105 drop-shadow-xl"
                                        style={{
                                            transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
                                        }}
                                    />

                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-8 bg-blue-200 rounded-full blur-xl opacity-30"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-20 bg-white/70 backdrop-blur-sm">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-light text-slate-800 mb-6">
                                    ¿Cómo <span className="font-bold text-blue-600">Funciona</span>?
                                </h2>
                                <div className="w-24 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
                                <p className="text-slate-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
                                    Nuestro sistema utiliza algoritmos de inteligencia artificial para crear una experiencia de aprendizaje completamente personalizada.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className={`group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-blue-200 transition-all duration-500 hover:-translate-y-2 cursor-pointer ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                        style={{
                                            transitionDelay: feature.delay
                                        }}
                                        onMouseEnter={() => setActiveCard(index)}
                                        onMouseLeave={() => setActiveCard(null)}
                                    >
                                        <div className="text-center">
                                            <div className="flex justify-center mb-6">
                                                <div className="relative p-4 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
                                                    <img
                                                        src={feature.icon}
                                                        alt={feature.title}
                                                        className="w-12 h-12 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                                    />
                                                    {activeCard === index && (
                                                        <div className="absolute -inset-1 bg-blue-200 rounded-xl -z-10 animate-pulse"></div>
                                                    )}
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-semibold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                                                {feature.title}
                                            </h3>

                                            <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-20 bg-gradient-to-br from-blue-50 to-slate-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-xl border border-white/50">
                                <h2 className="text-3xl md:text-4xl font-light text-slate-800 mb-6">
                                    ¿Listo para una experiencia de
                                    <br />
                                    <span className="font-bold text-blue-600">aprendizaje innovadora</span>?
                                </h2>

                                <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                                    Descubre cómo la inteligencia artificial puede transformar tu proceso de evaluación y potenciar tu aprendizaje.
                                </p>

                                <button
                                    onClick={() => navigate("/diagnostico")}
                                    className="group relative px-12 py-5 bg-blue-600 text-white font-medium text-xl rounded-2xl transition-all duration-300 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 hover:-translate-y-2"
                                >
                                    <span className="flex items-center justify-center gap-4">
                                        Iniciar test
                                        <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                                            <div className="w-2 h-2 bg-white rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                                        </div>
                                    </span>

                                    <div className="absolute inset-0 border-2 border-blue-400 rounded-2xl scale-100 group-hover:scale-110 opacity-0 group-hover:opacity-50 transition-all duration-700"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scaleIn {
                    to {
                        transform: scaleX(1);
                    }
                }
            `}</style>
        </div>
    );
}

export default Home;