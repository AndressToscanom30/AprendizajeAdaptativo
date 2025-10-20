import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuth();

    // role-based nav was removed for the simplified navbar; keep `user` available for personalization later
    const currentPath = location.pathname;

    // Static nav for the new simplified navbar
    const primaryNav = [
        { name: "Home", href: "/" },
        { name: "Sobre Nosotros", href: "/about" },
        { name: "Contáctanos", href: "/contact" },
    ];

    return (
        <nav className="sticky top-0 z-50 text-gray-800" style={{ background: '#EAF4FF', borderBottom: '1px solid #D7EAFB' }}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-4">
                    <div
                        className="flex items-center group cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <img
                            src="/finalaa.png"
                            width={40}
                            height={40}
                            alt="AA Logo"
                            className="mr-3 transition-transform duration-300 group-hover:scale-105"
                        />
                            <span className="text-lg md:text-xl font-bold text-[#0f172a]">
                            Aprendizaje Adaptativo
                        </span>
                    </div>
                    </div>
                {/* Desktop nav items */}
                <div className="hidden md:flex items-center space-x-4">
                    {primaryNav.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.href)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                currentPath === item.href
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                            }`}
                        >
                            {item.name}
                        </button>
                    ))}

                    {user ? (
                        <>
                            <span className="px-4 py-2 text-sm font-medium text-gray-700">
                                Hola, {user.nombre || user.email}
                            </span>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                                    currentPath === '/login'
                                        ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                }`}
                            >
                                Iniciar sesión
                            </button>

                            <button
                                onClick={() => navigate('/register')}
                                className={`px-5 py-2 text-sm font-medium rounded-lg shadow-lg transition-all duration-200 ${
                                    currentPath === '/register'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-400 hover:to-blue-700'
                                }`}
                            >
                                Registrarse
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
                </div>
                {isMenuOpen && (
                        <div className="md:hidden py-3 space-y-3 backdrop-blur-sm rounded-b-md" style={{ background: 'rgba(234,244,255,0.98)', borderTop: '1px solid #D7EAFB' }}>
                        <div className="flex flex-col px-2 space-y-2 text-gray-800">
                            {[...primaryNav].map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        navigate(item.href);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                                        currentPath === item.href ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                                    }`}
                                >
                                    {item.name}
                                </button>
                            ))}

                            {user ? (
                                <>
                                    <span className="px-3 py-2 text-sm font-medium text-gray-700">Hola, {user.nombre || user.email}</span>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            navigate('/login');
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300"
                                    >
                                        Iniciar sesión
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate('/register');
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                                    >
                                        Registrarse
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {/* thin separator line */}
            <div className="h-px bg-gray-100 w-full" aria-hidden="true"></div>
        </nav>
    );
};

export default Navbar;
