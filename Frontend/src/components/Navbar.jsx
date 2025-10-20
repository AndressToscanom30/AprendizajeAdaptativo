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
            </div>
            {/* thin separator line */}
            <div className="h-px bg-gray-100 w-full" aria-hidden="true"></div>

            {/* Mobile fullscreen sidebar menu */}
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    
                    {/* Sidebar menu */}
                    <div 
                        className="fixed top-0 left-0 h-full w-64 z-50 md:hidden shadow-2xl transform transition-transform duration-300"
                        style={{ background: '#1a1d2e' }}
                    >
                        {/* Close button */}
                        <div className="flex justify-end p-4">
                            <button onClick={() => setIsMenuOpen(false)} className="text-white p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Menu items */}
                        <nav className="px-4 py-6 space-y-2">
                            {[...primaryNav].map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        navigate(item.href);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                                        currentPath === item.href 
                                            ? 'bg-blue-600 text-white' 
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                >
                                    {item.name}
                                </button>
                            ))}

                            {user ? (
                                <div className="pt-4 border-t border-gray-700">
                                    <div className="px-4 py-2 text-sm font-medium text-gray-400">
                                        Hola, {user.nombre || user.email}
                                    </div>
                                </div>
                            ) : (
                                <div className="pt-4 border-t border-gray-700 space-y-2">
                                    <button
                                        onClick={() => {
                                            navigate('/login');
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-lg text-base font-medium bg-white text-gray-900 hover:bg-gray-100"
                                    >
                                        Iniciar sesión
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate('/register');
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                                    >
                                        Registrarse
                                    </button>
                                </div>
                            )}
                        </nav>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;
