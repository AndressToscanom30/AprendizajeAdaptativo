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
  // apply left offset only when the student sidebar is actually present
  const offsetClass = (user && user.rol === 'estudiante') ? (sidebarCollapsed ? 'md:ml-16' : 'md:ml-64') : '';

  return (
    <footer className={`mt-8 transition-all duration-300 ${offsetClass}`} style={{ background: '#EAF4FF', color: '#0f172a' }}>
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <img
            src="/finalaa.png"
            alt="Logo Aprendizaje Adaptativo"
            className="h-12 w-12 md:h-10 md:w-10 rounded-lg object-cover shadow-sm flex-shrink-0"
          />
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg">Aprendizaje Adaptativo</h3>
            <p className="text-sm" style={{ color: '#64748B' }}>Plataforma educativa para aprendizaje personalizado</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Enlaces</h4>
            <ul className="space-y-1 text-sm">
              <li className="hover:underline cursor-pointer" onClick={() => navigate('/')}>Inicio</li>
              <li className="hover:underline cursor-pointer" onClick={() => navigate('/about')}>Sobre nosotros</li>
              <li className="hover:underline cursor-pointer" onClick={() => navigate('/contact')}>Contacto</li>
              <li className="hover:underline cursor-pointer" onClick={() => navigate('/diagnostico')}>Diagnóstico</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Legal</h4>
            <ul className="space-y-1 text-sm">
              <li className="hover:underline cursor-pointer">Términos y Condiciones</li>
              <li className="hover:underline cursor-pointer">Política de Privacidad</li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Contacto</h4>
          <p className="text-sm" style={{ color: '#64748B' }}>Correo: keivercito@gmail.com</p>
          <p className="text-sm" style={{ color: '#64748B' }}>Tel: +57 320 3722941</p>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Síguenos</h4>
            <div className="flex items-center gap-3">
              <a className="h-8 w-8 rounded-full" style={{ background: '#D7EAFB', color: '#0f172a' }} href="#">FB</a>
              <a className="h-8 w-8 rounded-full" style={{ background: '#D7EAFB', color: '#0f172a' }} href="#">TW</a>
              <a className="h-8 w-8 rounded-full" style={{ background: '#D7EAFB', color: '#0f172a' }} href="#">IG</a>
            </div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #D7EAFB' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:justify-between items-center text-sm" style={{ color: '#64748B' }}>
          <span>© {new Date().getFullYear()} Aprendizaje Adaptativo. Todos los derechos reservados.</span>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            {user ? (
              <>
                <button className="text-sm underline" onClick={() => navigate('/perfil')}>Mi perfil</button>
                <button className="text-sm underline" onClick={() => { logout?.(); navigate('/'); }}>Cerrar sesión</button>
              </>
            ) : (
              <>
                <button className="text-sm underline" onClick={() => navigate('/login')}>Iniciar sesión</button>
                <button className="text-sm underline" onClick={() => navigate('/register')}>Registrarse</button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
