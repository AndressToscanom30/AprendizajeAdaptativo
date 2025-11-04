import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Home, Info, Mail, LogIn, UserPlus, Menu, X } from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuth();

    const currentPath = location.pathname;

    const primaryNav = [
        { name: "Inicio", href: "/", icon: Home },
        { name: "Sobre Nosotros", href: "/about", icon: Info },
        { name: "Contacto", href: "/contact", icon: Mail },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div
                        className="flex items-center gap-3 group cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                            <img
                                src="/finalaa.png"
                                width={48}
                                height={48}
                                alt="AA Logo"
                                className="relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 rounded-xl"
                            />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xl font-light text-slate-800">Aprendizaje</span>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent ml-1">
                                Adaptativo
                            </span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        {primaryNav.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPath === item.href;
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => navigate(item.href)}
                                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                                        isActive
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                            : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                </button>
                            );
                        })}

                        <div className="ml-4 h-8 w-px bg-slate-200"></div>

                        {user ? (
                            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl border border-blue-100">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {(user.nombre || user.email)[0].toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-slate-700">
                                    {user.nombre || user.email}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 transition-all duration-300 rounded-xl hover:bg-blue-50"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Iniciar sesión
                                </button>

                                <button
                                    onClick={() => navigate('/register')}
                                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Registrarse
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    <div className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-white z-50 md:hidden shadow-2xl transform transition-transform duration-300 overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                                <img src="/finalaa.png" width={40} height={40} alt="Logo" className="rounded-lg" />
                                <div>
                                    <span className="text-lg font-light text-slate-800">Aprendizaje</span>
                                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent ml-1">
                                        Adaptativo
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <nav className="p-6 space-y-2">
                            {primaryNav.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentPath === item.href;
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => {
                                            navigate(item.href);
                                            setIsMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                                            isActive
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.name}
                                    </button>
                                );
                            })}

                            {user ? (
                                <div className="pt-6 border-t border-slate-200 mt-6">
                                    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            {(user.nombre || user.email)[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Bienvenido</p>
                                            <p className="text-sm font-medium text-slate-700">{user.nombre || user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="pt-6 border-t border-slate-200 mt-6 space-y-3">
                                    <button
                                        onClick={() => {
                                            navigate('/login');
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-medium text-slate-700 border-2 border-slate-200 hover:border-blue-300 hover:text-blue-600 rounded-xl transition-all duration-300"
                                    >
                                        <LogIn className="w-5 h-5" />
                                        Iniciar sesión
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate('/register');
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl transition-all duration-300"
                                    >
                                        <UserPlus className="w-5 h-5" />
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
