import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Contact() {
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simular envío
        setTimeout(() => {
            setIsSubmitting(false);
            alert('¡Mensaje enviado correctamente! Te responderemos pronto.');
            setFormData({ nombre: '', email: '', mensaje: '' });
        }, 1000);
    };

    const contactInfo = [
        {
            icon: "📧",
            title: "Email",
            detail: "keivercito@gmail.com",
            description: "Respuesta en menos de 24 horas",
            delay: "0ms"
        },
        {
            icon: "📱",
            title: "Teléfono",
            detail: "+57 320 3722941",
            description: "Disponible de 9AM a 6PM",
            delay: "150ms"
        },
        {
            icon: "📍",
            title: "Ubicación",
            detail: "Cúcuta, Colombia",
            description: "Oficina principal",
            delay: "300ms"
        }
    ];

    const socialLinks = [
        { name: "Facebook", url: "https://facebook.com", icon: "👥" },
        { name: "Twitter", url: "https://twitter.com", icon: "🐦" },
        { name: "Instagram", url: "https://instagram.com", icon: "📸" },
        { name: "LinkedIn", url: "https://linkedin.com", icon: "💼" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
            <div className="fixed inset-0 -z-10 overflow-hidden">
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
                                        <span className="font-extralight">¡Hablemos</span>
                                        <br />
                                        <span className="font-bold text-blue-600 relative">
                                            Juntos!
                                            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transform origin-left scale-x-0 animate-[scaleIn_1.5s_ease-out_1s_forwards]"></div>
                                        </span>
                                    </h1>
                                </div>

                                <div className="mb-10">
                                    <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
                                        ¿Tienes <span className="text-blue-600 font-medium">dudas</span>, sugerencias o quieres colaborar con nosotros? Nuestro equipo está listo para <span className="text-blue-600 font-medium">escucharte y ayudarte</span>.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                    <a
                                        href="mailto:keivercito@gmail.com"
                                        className="group relative px-8 py-4 bg-blue-600 text-white font-medium text-lg rounded-xl transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 hover:-translate-y-1"
                                    >
                                        <span className="flex items-center justify-center gap-3">
                                            Escríbenos
                                            <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        </span>
                                    </a>

                                    <button
                                        onClick={() => navigate("/about")}
                                        className="px-8 py-4 text-slate-700 font-medium text-lg rounded-xl border-2 border-slate-300 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        Sobre Nosotros
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
                                        src="/finalaa.png"
                                        alt="Logo Aprendizaje Adaptativo"
                                        className="relative w-full max-w-[300px] md:max-w-[400px] lg:max-w-lg object-contain transition-all duration-700 hover:scale-105 drop-shadow-xl rounded-2xl"
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
                                    Información de <span className="font-bold text-blue-600">Contacto</span>
                                </h2>
                                <div className="w-24 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
                                <p className="text-slate-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
                                    Múltiples formas de conectar contigo. Elige la que más te convenga.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                                {contactInfo.map((info, index) => (
                                    <div
                                        key={index}
                                        className={`group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-blue-200 transition-all duration-500 hover:-translate-y-2 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                        style={{
                                            transitionDelay: info.delay
                                        }}
                                    >
                                        <div className="text-center">
                                            <div className="flex justify-center mb-6">
                                                <div className="relative p-4 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
                                                    <div className="text-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                                                        {info.icon}
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                                {info.title}
                                            </h3>

                                            <p className="text-blue-600 font-medium mb-2">
                                                {info.detail}
                                            </p>

                                            <p className="text-slate-600 text-sm leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                                                {info.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center">
                                <h3 className="text-xl font-semibold text-slate-800 mb-6">Síguenos en redes sociales</h3>
                                <div className="flex justify-center gap-6 flex-wrap">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                                                {social.icon}
                                            </span>
                                            <span className="text-slate-700 group-hover:text-blue-600 transition-colors duration-300">
                                                {social.name}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-20 bg-gradient-to-br from-blue-50 to-slate-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-xl border border-white/50">
                                <div className="text-center mb-10">
                                    <h2 className="text-2xl md:text-3xl font-light text-slate-800 mb-4">
                                        Envíanos un <span className="font-bold text-blue-600">mensaje</span>
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed">
                                        Completa el formulario y te responderemos lo antes posible
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="nombre" className="block text-slate-700 font-medium mb-2">
                                                Nombre completo
                                            </label>
                                            <input
                                                type="text"
                                                id="nombre"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleInputChange}
                                                placeholder="Tu nombre"
                                                required
                                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors duration-300 placeholder-slate-400"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-slate-700 font-medium mb-2">
                                                Correo electrónico
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="tucorreo@email.com"
                                                required
                                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors duration-300 placeholder-slate-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="mensaje" className="block text-slate-700 font-medium mb-2">
                                            Mensaje
                                        </label>
                                        <textarea
                                            id="mensaje"
                                            name="mensaje"
                                            value={formData.mensaje}
                                            onChange={handleInputChange}
                                            rows="5"
                                            placeholder="Escribe tu mensaje aquí..."
                                            required
                                            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors duration-300 placeholder-slate-400 resize-none"
                                        ></textarea>
                                    </div>

                                    <div className="text-center pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="group relative px-12 py-4 bg-blue-600 text-white font-medium text-lg rounded-xl transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="flex items-center justify-center gap-3">
                                                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                                                {!isSubmitting && (
                                                    <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    </div>
                                                )}
                                            </span>

                                            <div className="absolute inset-0 border-2 border-blue-400 rounded-xl scale-100 group-hover:scale-105 opacity-0 group-hover:opacity-50 transition-all duration-500"></div>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-20 bg-white/70 backdrop-blur-sm">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-xl border border-white/50">
                                <h2 className="text-3xl md:text-4xl font-light text-slate-800 mb-6">
                                    ¿Listo para aprender
                                    <br />
                                    <span className="font-bold text-blue-600">con nosotros</span>?
                                </h2>

                                <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                                    Únete a nuestra plataforma y recibe atención personalizada de nuestro equipo.
                                </p>

                                <button
                                    onClick={() => navigate("/test")}
                                    className="group relative px-12 py-5 bg-blue-600 text-white font-medium text-xl rounded-2xl transition-all duration-300 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 hover:-translate-y-2"
                                >
                                    <span className="flex items-center justify-center gap-4">
                                        Comenzar ahora
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

export default Contact;

