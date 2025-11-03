import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext.jsx";

export default function Footer() {
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;
  const { sidebarCollapsed } = useSidebar();
  
  // Aplicar offset para TODOS los roles con sidebar (estudiante, profesor, admin)
  const hasSidebar = user && (user.rol === 'estudiante' || user.rol === 'profesor' || user.rol === 'admin');
  const offsetClass = hasSidebar ? (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72') : '';

  return (
    <footer className={`transition-all duration-300 ${offsetClass} w-full`} style={{ background: '#1a1a2e', color: '#e0e0e0' }}>
      {/* Main Footer Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Logo and Slogan Section */}
        <div className="mb-12 md:mb-16 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
            <img
              src="/finalaa.png"
              alt="Logo Aprendizaje Adaptativo"
              className="h-16 w-16 rounded-lg object-cover shadow-lg flex-shrink-0"
            />
            <div>
              <h3 className="font-bold text-2xl md:text-3xl text-white mb-2">APRENDIZAJE ADAPTATIVO</h3>
              <p className="text-sm md:text-base" style={{ color: '#9ca3af' }}>Plataforma educativa inteligente</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-6 mb-12 text-center md:text-left">
          {/* Services Column */}
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
                  onClick={() => navigate('/diagnostico')}
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Evaluaciones
                </button>
              </li>
              <li>
                <span className="hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                  IA Adaptativa
                </span>
              </li>
            </ul>
          </div>

          {/* About Column */}
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

          {/* Resources Column */}
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

          {/* Legal Column */}
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

        {/* Social Media Icons */}
        <div className="flex justify-center items-center gap-4 pt-8 border-t border-gray-700">
          <a 
            href="#" 
            className="h-10 w-10 rounded-full border-2 border-gray-600 flex items-center justify-center hover:border-blue-400 hover:text-blue-400 transition-all duration-300 hover:scale-110"
            aria-label="Facebook"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a 
            href="#" 
            className="h-10 w-10 rounded-full border-2 border-gray-600 flex items-center justify-center hover:border-blue-400 hover:text-blue-400 transition-all duration-300 hover:scale-110"
            aria-label="Twitter"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
          <a 
            href="#" 
            className="h-10 w-10 rounded-full border-2 border-gray-600 flex items-center justify-center hover:border-blue-400 hover:text-blue-400 transition-all duration-300 hover:scale-110"
            aria-label="RSS"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
            </svg>
          </a>
          <a 
            href="#" 
            className="h-10 w-10 rounded-full border-2 border-gray-600 flex items-center justify-center hover:border-blue-400 hover:text-blue-400 transition-all duration-300 hover:scale-110"
            aria-label="Google Plus"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.635 10.909v2.619h4.335c-.173 1.125-1.31 3.295-4.331 3.295-2.604 0-4.731-2.16-4.731-4.823 0-2.662 2.122-4.822 4.728-4.822 1.485 0 2.479.633 3.045 1.178l2.073-1.994c-1.33-1.245-3.056-1.995-5.115-1.995C3.412 4.365 0 7.785 0 12s3.414 7.635 7.635 7.635c4.41 0 7.332-3.098 7.332-7.461 0-.501-.054-.885-.12-1.265H7.635zm16.365 0h-2.183V8.726h-2.183v2.183h-2.182v2.181h2.184v2.184h2.189V13.09H24"/>
            </svg>
          </a>
          <a 
            href="#" 
            className="h-10 w-10 rounded-full border-2 border-gray-600 flex items-center justify-center hover:border-blue-400 hover:text-blue-400 transition-all duration-300 hover:scale-110"
            aria-label="More"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Copyright Bar */}
      <div style={{ borderTop: '1px solid #374151' }}>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 text-xs md:text-sm" style={{ color: '#9ca3af' }}>
            <span>©Copyright. All rights reserved.</span>
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
