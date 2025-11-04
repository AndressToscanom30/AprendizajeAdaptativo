import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext.jsx";

export default function Footer() {
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;
  const { sidebarCollapsed } = useSidebar();

  const hasSidebar = user && (user.rol === 'estudiante' || user.rol === 'profesor' || user.rol === 'admin');
  const offsetClass = hasSidebar ? (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72') : '';

  const handleEvaluacioPage = () => {
    if (!user) {
      navigate("/login");
    }
    else if (user.rol === "profesor") {
      navigate("/evaluaciones/profesor");
      return;
    }
    else if (user.rol === "estudiante") {
      navigate("/estudiante/evaluaciones")
      return;
    }
  }

  const handleIAPage = () => {
    if (!user) {
      navigate("/login");
    }
    else if (user.rol === "estudiante") {
      navigate("/estudiante/analisis-ia");
      return;
    }
  }

  return (
    <footer className={`transition-all duration-300 ${offsetClass} w-full`} style={{ background: '#1a1a2e', color: '#e0e0e0' }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-12 md:mb-16 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
            <img
              src="/finalaa.png"
              alt="Logo Aprendizaje Adaptativo"
              className="h-16 w-16 rounded-lg object-cover shadow-lg flex-shrink-0"
            />
            <div>
              <h3 className="font-bold text-2xl md:text-3xl text-white mb-2">APRENDIZAJE ADAPTATIVO</h3>
              <p className="text-sm md:text-base" style={{ color: '#9ca3af' }}>Plataforma educativa de programación inteligente</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-6 mb-12 text-center md:text-left">
          <div>
            <h4 className="font-bold text-white mb-4 text-sm md:text-base uppercase tracking-wider">Servicios</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('/diagnostico')}
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Diagnóstico
                </button>
              </li>
              <li>
                <button
                  onClick={handleEvaluacioPage}
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Evaluaciones
                </button>
              </li>
              <li>
                <button onClick={handleIAPage}>
                  <span className="hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                    IA Adaptativa
                  </span>
                </button>

              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 text-sm md:text-base uppercase tracking-wider">Nosotros</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Sobre Nosotros
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Contacto
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Equipo
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-sm md:text-base uppercase tracking-wider">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Inicio
                </button>
              </li>
              <li>
                <span className="hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                  Documentación
                </span>
              </li>
              <li>
                <span className="hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                  Blog
                </span>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm md:text-base uppercase tracking-wider">Soporte</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Ayuda
                </button>
              </li>
              <li>
                <span className="hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                  FAQ
                </span>
              </li>
              <li>
                <span className="hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                  Tickets
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-sm md:text-base uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                  Términos
                </span>
              </li>
              <li>
                <span className="hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                  Privacidad
                </span>
              </li>
              <li>
                {user ? (
                  <button
                    onClick={() => navigate('/perfil')}
                    className="hover:text-blue-400 transition-colors duration-200"
                  >
                    Mi Perfil
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="hover:text-blue-400 transition-colors duration-200"
                  >
                    Iniciar Sesión
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 pt-8 border-t border-gray-700">
          <a
            href="https://www.facebook.com/"
            className="h-10 w-10 rounded-full border-2 border-gray-600 flex items-center justify-center hover:border-blue-400 hover:text-blue-400 transition-all duration-300 hover:scale-110"
            aria-label="Facebook"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a
            href="https://x.com/"
            className="h-10 w-10 rounded-full border-2 border-gray-600 flex items-center justify-center hover:border-blue-400 hover:text-blue-400 transition-all duration-300 hover:scale-110"
            aria-label="X"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.5 11.24H16.54l-5.236-6.843L5.31 21.75H2l7.73-8.847L1.5 2.25h5.884l4.713 6.153 6.147-6.153zM17.31 20.07h1.833L7.013 3.83H5.054l12.256 16.24z" />
            </svg>
          </a>
          <a
            href="https://instagram.com/"
            className="h-10 w-10 rounded-full border-2 border-gray-600 flex items-center justify-center hover:border-pink-500 hover:text-pink-500 transition-all duration-300 hover:scale-110"
            aria-label="Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #374151' }}>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 text-xs md:text-sm" style={{ color: '#9ca3af' }}>
            <span>©Copyright. Todos los derechos reservados 2025.</span>
            {user && (
              <>
                <span className="hidden md:inline">|</span>
                <button
                  onClick={() => { logout?.(); navigate('/'); }}
                  className="hover:text-blue-400 transition-colors duration-200 underline"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
