import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeLink, setActiveLink] = useState('Home');
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', href: '#home' },
        { name: 'Sobre Nosotros', href: '#about' },
        { name: 'Contáctanos', href: '#contact' }
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/20'
                : 'bg-white shadow-sm border-b border-gray-200'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center group cursor-pointer">
                        <div className="relative">
                            <img
                                src="/AA-logo.png"
                                width={40}
                                height={40}
                                alt="AA Logo"
                                className="mr-3 transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <span className="text-xl font-bold text-gray-800">
                            Aprendizaje Adaptativo
                        </span>
                    </div>

                    <div className="hidden md:block">
                        <ul className="flex space-x-1">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        onClick={() => setActiveLink(item.name)}
                                        className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${activeLink === item.name
                                                ? 'text-blue-600 bg-blue-50'
                                                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {item.name}
                                        {activeLink === item.name && (
                                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="hidden md:flex items-center space-x-3">
                        <button onClick={() => navigate('/login')} className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-300 hover:shadow-sm">
                            Iniciar Sesión
                        </button>
                        <button className="relative px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden group">
                            <span className="relative z-10">Registrarse</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <div className="w-6 h-6 relative">
                                <span className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 top-3' : 'top-1'
                                    }`}></span>
                                <span className={`absolute h-0.5 w-6 bg-current transition-all duration-300 top-3 ${isMenuOpen ? 'opacity-0' : 'opacity-100'
                                    }`}></span>
                                <span className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 top-3' : 'top-5'
                                    }`}></span>
                            </div>
                        </button>
                    </div>
                </div>

                <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-to-br from-white to-gray-50 border-t border-gray-200 rounded-b-xl">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={() => {
                                    setActiveLink(item.name);
                                    setIsMenuOpen(false);
                                }}
                                className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${activeLink === item.name
                                        ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                    }`}
                            >
                                {item.name}
                            </a>
                        ))}

                        <div className="px-4 py-3 space-y-3 border-t border-gray-200 mt-3">
                            <button className="w-full py-3 px-4 text-base font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300">
                                Iniciar Sesión
                            </button>
                            <button className="w-full py-3 px-4 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                                Registrarse
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;