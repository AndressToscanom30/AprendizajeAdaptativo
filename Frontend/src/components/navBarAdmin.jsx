import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useSidebar } from "../context/SidebarContext.jsx";
import { 
  Menu, 
  LayoutDashboard, 
  UserCircle, 
  BookOpen,
  Home,
  LogOut,
  Shield,
  Users,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
  Info,
  Mail,
  Settings,
  Database
} from "lucide-react";

export default function NavBarAdmin() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar, closeSidebar, sidebarCollapsed, toggleSidebarCollapse } = useSidebar();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    closeSidebar();
  }, [location.pathname, closeSidebar]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(globalThis.scrollY > 20);
    };
    globalThis.addEventListener("scroll", handleScroll);
    return () => globalThis.removeEventListener("scroll", handleScroll);
  }, []);

  if (!user?.rol || user.rol !== "admin") return null;

  const adminMenuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Usuarios", href: "/admin/usuarios", icon: Users },
    { name: "Reportes", href: "/admin/reportes", icon: BarChart3 },
    { name: "Configuración", href: "/admin/configuracion", icon: Settings },
    { name: "Base de Datos", href: "/admin/database", icon: Database },
    { name: "Perfil", href: "/perfil", icon: UserCircle },
  ];

  const generalMenuItems = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Sobre Nosotros", href: "/about", icon: Info },
    { name: "Contacto", href: "/contact", icon: Mail },
    { name: "Recursos", href: "/recursos", icon: BookOpen },
  ];

  return (
    <>
      <nav className={`sticky top-0 z-50 bg-white border-b transition-all duration-300 overflow-x-hidden ${scrolled ? 'shadow-lg border-slate-200' : 'border-slate-100'}`}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleSidebar}
                className="lg:hidden p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div
                className="flex items-center gap-3 group cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
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
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-400 bg-clip-text text-transparent ml-1">
                    Adaptativo
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <Shield className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-slate-500">Administrador</p>
                  <p className="text-sm font-semibold text-slate-800">{user?.nombre || user?.email}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm mt-20"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-200 z-30 
        transform transition-all duration-300 ease-in-out shadow-xl pt-20
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 ${sidebarCollapsed ? 'lg:w-20' : 'w-72'}`}
      >
        <div className="flex flex-col h-[calc(100vh-5rem)] overflow-y-auto">
          <div className={`p-6 border-b border-slate-200 ${sidebarCollapsed ? 'lg:p-4' : ''}`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'lg:justify-center' : 'gap-3'}`}>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">Admin</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {user?.nombre || user?.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              {!sidebarCollapsed && (
                <h3 className="text-xs font-bold uppercase tracking-wide mb-3 px-3 text-slate-500">
                  Panel de Admin
                </h3>
              )}
              <nav className="space-y-1">
                {adminMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={closeSidebar}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-200'
                          : 'text-slate-600 hover:bg-purple-50 hover:text-purple-600'
                      } ${sidebarCollapsed ? 'lg:justify-center' : ''}`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <>
                          <span className="font-medium">{item.name}</span>
                          {isActive && (
                            <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </>
                      )}
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                          {item.name}
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-200">
              {!sidebarCollapsed && (
                <h3 className="text-xs font-bold uppercase tracking-wide mb-3 px-3 text-slate-500">
                  Navegación
                </h3>
              )}
              <nav className="space-y-1">
                {generalMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={closeSidebar}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200'
                          : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                      } ${sidebarCollapsed ? 'lg:justify-center' : ''}`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                          {item.name}
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="border-t border-slate-200">
            <button
              onClick={logout}
              className={`w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-300 group ${sidebarCollapsed ? 'lg:justify-center' : ''} relative`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0 group-hover:rotate-12 transition-transform" />
              {!sidebarCollapsed && <span className="font-medium">Cerrar Sesión</span>}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  Cerrar Sesión
                </div>
              )}
            </button>

            <button
              onClick={toggleSidebarCollapse}
              className="hidden lg:flex w-full items-center justify-center gap-2 px-4 py-3 text-slate-600 hover:bg-slate-100 border-t border-slate-200 transition-all duration-300"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">Colapsar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      <div className={`hidden lg:block transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-72'} flex-shrink-0`} />
    </>
  );
}
