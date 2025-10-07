import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useSidebar } from "../context/SidebarContext.jsx";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { toggleSidebar, toggleSidebarCollapse } = useSidebar();

    const getNavItems = () => {
        if (user && user.rol === "estudiante") {
            return [
                { name: "Inicio", href: "/" },
                { name: "Recursos", href: "/recursos" },
            ];
        }
        return [
            { name: "Home", href: "/" },
            { name: "Sobre Nosotros", href: "/about" },
            { name: "Contáctanos", href: "/contact" },
        ];
    };

    const navItems = getNavItems();
    const currentPath = location.pathname;

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xl">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-4">
                        {user && user.rol === "estudiante" && (
                            <button
                                onClick={toggleSidebar}
                                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                aria-label="Toggle menu"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        )}
                        
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
                            <span className="text-lg md:text-xl font-bold text-gray-800">
                                Aprendizaje Adaptativo
                            </span>
                        </div>
                    </div>

                    {user && user.rol === "estudiante" ? (
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-blue-700">
                                    {user?.nombre || user?.email}
                                </span>
                            </div>
                            
                            <button
                                onClick={toggleSidebarCollapse}
                                className="hidden md:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                aria-label="Toggle sidebar"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {isMenuOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>

                            <div className="hidden md:flex items-center space-x-3">
                                {navItems.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => navigate(item.href)}
                                        className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                                            currentPath === item.href
                                                ? "text-blue-600 bg-blue-50"
                                                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        {item.name}
                                        {currentPath === item.href && (
                                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="hidden md:flex items-center space-x-3">
                                {user ? (
                                    <>
                                        <span className="px-4 py-2 text-sm font-medium text-gray-700">
                                            Hola, {user.nombre}
                                        </span>
                                        <button
                                            onClick={logout}
                                            className="px-4 py-2 text-sm font-medium rounded-lg border bg-white text-gray-700 hover:bg-gray-100"
                                        >
                                            Cerrar sesión
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => navigate("/login")}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-300 ${
                                                currentPath === "/login"
                                                    ? "bg-blue-600 text-white border-blue-700 shadow-md"
                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                            }`}
                                        >
                                            Iniciar Sesión
                                        </button>
                                        <button
                                            onClick={() => navigate("/register")}
                                            className={`px-6 py-2 text-sm font-medium rounded-lg shadow-lg transition-all duration-300 ${
                                                currentPath === "/register"
                                                    ? "bg-purple-600 text-white"
                                                    : "bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-400 hover:to-blue-700"
                                            }`}
                                        >
                                            Registrarse
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {user?.rol !== "estudiante" && isMenuOpen && (
                    <div className="md:hidden py-4 space-y-4">
                        <div className="flex flex-col space-y-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        navigate(item.href);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                                        currentPath === item.href
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                            {user ? (
                                <>
                                    <span className="px-4 py-2 text-sm font-medium text-gray-700">
                                        Hola, {user.nombre}
                                    </span>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="px-4 py-2 text-sm font-medium rounded-lg border bg-white text-gray-700 hover:bg-gray-100"
                                    >
                                        Cerrar sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            navigate("/login");
                                            setIsMenuOpen(false);
                                        }}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-300 ${
                                            currentPath === "/login"
                                                ? "bg-blue-600 text-white border-blue-700"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                        }`}
                                    >
                                        Iniciar Sesión
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate("/register");
                                            setIsMenuOpen(false);
                                        }}
                                        className={`px-6 py-2 text-sm font-medium rounded-lg shadow-lg transition-all duration-300 ${
                                            currentPath === "/register"
                                                ? "bg-purple-600 text-white"
                                                : "bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-400 hover:to-blue-700"
                                        }`}
                                    >
                                        Registrarse
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
