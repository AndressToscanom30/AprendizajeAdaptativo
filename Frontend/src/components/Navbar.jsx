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
        <nav className="sticky top-0 z-50" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
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
                            className="mr-3 transition-transform duration-300 group-hover:scale-110 rounded-lg"
                        />
                            <span className="text-lg md:text-xl font-bold text-white">
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
                                            ? "bg-white/20 text-white backdrop-blur-sm"
                                            : "text-white/90 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {item.name}
                        </button>
                    ))}

                    {user ? (
                        <>
                            <span className="px-4 py-2 text-sm font-medium text-white/90">
                                Hola, {user.nombre || user.email}
                            </span>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                                    currentPath === '/login'
                                        ? 'bg-white text-purple-600 border-white'
                                        : 'bg-transparent text-white border-white/50 hover:bg-white/10 hover:border-white'
                                }`}
                            >
                                Iniciar sesión
                            </button>

                            <button
                                onClick={() => navigate('/register')}
                                className="px-5 py-2 text-sm font-medium rounded-lg bg-white text-purple-600 hover:bg-white/90 transition-all duration-200 shadow-lg"
                            >
                                Registrarse
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white">
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
                        style={{ background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)' }}
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
                                            ? 'bg-white/20 text-white backdrop-blur-sm' 
                                            : 'text-white/90 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {item.name}
                                </button>
                            ))}

                            {user ? (
                                <div className="pt-4 border-t border-white/20">
                                    <div className="px-4 py-2 text-sm font-medium text-white/80">
                                        Hola, {user.nombre || user.email}
                                    </div>
                                </div>
                            ) : (
                                <div className="pt-4 border-t border-white/20 space-y-2">
                                    <button
                                        onClick={() => {
                                            navigate('/login');
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-lg text-base font-medium bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                                    >
                                        Iniciar sesión
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate('/register');
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-lg text-base font-medium bg-white text-purple-600 hover:bg-white/90"
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
