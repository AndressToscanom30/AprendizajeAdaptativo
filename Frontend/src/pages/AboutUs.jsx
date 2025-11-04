import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AboutUs() {
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [activeTeamMember, setActiveTeamMember] = useState(null);

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

    const teamMembers = [
        {
            name: "Andres Toscano",
            role: "Frontend/UX",
            image: "/Ferb.webp",
            description: "Experto en crear experiencias de usuario excepcionales y interfaces modernas.",
            delay: "0ms"
        },
        {
            name: "Yeremy Silva",
            role: "Backend Developer",
            image: "/Baljeet.png",
            description: "Arquitecto de sistemas robustos y soluciones escalables.",
            delay: "150ms"
        },
        {
            name: "Keiver Castellanos",
            role: "Líder y Arquitecto",
            image: "/Phineas.webp",
            description: "Visionario tecnológico y líder del equipo de desarrollo.",
            delay: "300ms"
        }
    ];

    const values = [
        {
            title: "Misión",
            description: "Empoderar a cada persona para que alcance su máximo potencial a través de experiencias de aprendizaje adaptativas y tecnológicas.",
            icon: "🎯",
            delay: "0ms"
        },
        {
            title: "Visión",
            description: "Ser la plataforma líder en educación personalizada, inspirando a millones a aprender de manera inteligente y colaborativa.",
            icon: "👁️",
            delay: "150ms"
        },
        {
            title: "Valores",
            description: "Innovación, Inclusión, Colaboración, Pasión por enseñar y Transparencia guían cada decisión que tomamos.",
            icon: "⭐",
            delay: "300ms"
        }
    ];

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Fondo con efectos parallax */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
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

                {/* Grid de fondo */}
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

            <div className="relative z-10 w-full">
                {/* Hero Section */}
                <div className="min-h-[85vh] flex items-center py-16 md:py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className={`flex flex-col lg:flex-row items-center justify-between gap-12 transition-all duration-1200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
                            {/* Contenido izquierdo */}
                            <div className="lg:w-1/2 text-center lg:text-left w-full">
                                <div className="mb-8">
                                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-6 text-slate-800 leading-tight">
                                        <span className="font-extralight">Conoce</span>
                                        <br />
                                        <span className="font-bold text-blue-600 relative">
                                            Nuestro Equipo
                                            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transform origin-left scale-x-0 animate-[scaleIn_1.5s_ease-out_1s_forwards]"></div>
                                        </span>
                                    </h1>
                                </div>

                                <div className="mb-10">
                                    <p className="text-lg sm:text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light text-slate-600">
                                        En Aprendizaje Adaptativo creemos que la educación debe ser <span className="text-blue-600 font-medium">personalizada</span>, inclusiva y emocionante. Nuestra misión es transformar la manera en que las personas aprenden, conectando <span className="text-blue-600 font-medium">tecnología, pasión y comunidad</span>.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <button
                                        onClick={() => navigate("/contact")}
                                        className="group relative px-10 py-5 bg-blue-600 text-white font-medium text-lg rounded-2xl transition-all duration-300 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 hover:-translate-y-1 w-full sm:w-auto"
                                    >
                                        <span className="flex items-center justify-center gap-3">
                                            Contáctanos
                                            <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => navigate("/test")}
                                        className="px-10 py-5 text-slate-700 font-medium text-lg rounded-2xl border-2 border-slate-300 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
                                    >
                                        Comenzar test
                                    </button>
                                </div>
                            </div>

                            {/* Logo animado */}
                            <div className="w-full lg:w-1/2 flex justify-center p-4 mt-8 lg:mt-0">
                                <div className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px] lg:max-w-lg">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-full border border-blue-200 rounded-full opacity-30 animate-spin" style={{ animationDuration: '30s' }}></div>
                                    </div>
                                    <div className="absolute inset-8 flex items-center justify-center">
                                        <div className="w-full h-full border border-blue-300 rounded-full opacity-40 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }}></div>
                                    </div>

                                    <img
                                        src="/finalaa.png"
                                        alt="Logo Aprendizaje Adaptativo"
                                        className="relative w-full object-contain transition-all duration-700 hover:scale-105 drop-shadow-2xl rounded-2xl"
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

                {/* Sección Filosofía */}
                <div className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30 backdrop-blur-sm">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-800 mb-6">
                                    Nuestra <span className="font-bold text-blue-600">Filosofía</span>
                                </h2>
                                <div className="w-24 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
                                <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-light text-slate-600">
                                    Los principios que guían nuestro trabajo y definen nuestro compromiso con la excelencia educativa.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {values.map((value, index) => (
                                    <div
                                        key={index}
                                        className={`group bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-white/80 hover:border-blue-200 transition-all duration-500 hover:-translate-y-2 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                        style={{
                                            transitionDelay: value.delay
                                        }}
                                    >
                                        <div className="text-center">
                                            <div className="flex justify-center mb-6">
                                                <div className="relative p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 shadow-md">
                                                    <div className="text-4xl opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-110 transform">
                                                        {value.icon}
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-semibold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                                                {value.title}
                                            </h3>

                                            <p className="text-base text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                                                {value.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección Equipo */}
                <div className="py-20 bg-white/80 backdrop-blur-sm">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-800 mb-6">
                                    Conoce a <span className="font-bold text-blue-600">Nuestro Equipo</span>
                                </h2>
                                <div className="w-24 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
                                <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-light text-slate-600">
                                    Un grupo apasionado de profesionales dedicados a revolucionar la educación.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {teamMembers.map((member, index) => (
                                    <div
                                        key={index}
                                        className={`group bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-white/80 hover:border-blue-200 transition-all duration-500 hover:-translate-y-2 cursor-pointer ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                        style={{
                                            transitionDelay: member.delay
                                        }}
                                        onMouseEnter={() => setActiveTeamMember(index)}
                                        onMouseLeave={() => setActiveTeamMember(null)}
                                    >
                                        <div className="text-center">
                                            <div className="flex justify-center mb-6">
                                                <div className="relative">
                                                    <img
                                                        src={member.image}
                                                        alt={member.name}
                                                        className="w-24 h-24 object-cover rounded-full transition-all duration-300 group-hover:scale-110 shadow-lg"
                                                    />
                                                    {activeTeamMember === index && (
                                                        <div className="absolute -inset-2 bg-blue-200 rounded-full -z-10 animate-pulse"></div>
                                                    )}
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                                {member.name}
                                            </h3>

                                            <p className="text-blue-600 font-medium mb-4 text-sm uppercase tracking-wide">
                                                {member.role}
                                            </p>

                                            <p className="text-base text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                                                {member.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Final */}
                <div className="py-20 bg-gradient-to-br from-blue-50 to-slate-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="max-w-5xl mx-auto text-center">
                            <div className="bg-white/90 backdrop-blur-sm p-12 sm:p-16 rounded-3xl shadow-2xl border border-white/80">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-800 mb-6">
                                    ¿Quieres formar parte de
                                    <br />
                                    <span className="font-bold text-blue-600">nuestra comunidad</span>?
                                </h2>

                                <p className="text-lg sm:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                                    Únete a miles de estudiantes que ya están transformando su manera de aprender con nuestra tecnología adaptativa.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => navigate("/test")}
                                        className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-xl rounded-2xl transition-all duration-300 hover:from-blue-700 hover:to-blue-600 hover:shadow-2xl hover:shadow-blue-300 hover:-translate-y-2 w-full sm:w-auto"
                                    >
                                        <span className="flex items-center justify-center gap-4">
                                            Comenzar ahora
                                            <div className="w-7 h-7 border-2 border-white rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                                                <div className="w-2 h-2 bg-white rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                                            </div>
                                        </span>

                                        <div className="absolute inset-0 border-2 border-blue-300 rounded-2xl scale-100 group-hover:scale-110 opacity-0 group-hover:opacity-50 transition-all duration-700"></div>
                                    </button>

                                    <button
                                        onClick={() => navigate("/contact")}
                                        className="px-12 py-6 text-slate-700 font-semibold text-xl rounded-2xl border-2 border-slate-300 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:-translate-y-2 w-full sm:w-auto"
                                    >
                                        Contáctanos
                                    </button>
                                </div>
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

export default AboutUs;