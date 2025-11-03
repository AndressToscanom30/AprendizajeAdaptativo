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
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
  Info,
  Mail,
  GraduationCap
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
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!user || user.rol !== "admin") return null;

  const adminMenuItems = [
    { name: "Dashboard", href: "/dashboardP", icon: LayoutDashboard },
    { name: "Gestión Relaciones", href: "/admin/relaciones", icon: Users },
    { name: "Verificar Relación", href: "/admin/verificar", icon: Search },
    { name: "Evaluaciones", href: "/evaluaciones/profesor", icon: FileText },
    { name: "Cursos", href: "/profesor/cursos", icon: BookOpen },
    { name: "Usuarios", href: "/estudiantes", icon: GraduationCap },
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
                className="lg:hidden p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div
                className="flex items-center gap-3 group cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
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
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent ml-1">
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
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar móvil/desktop */}
      <div className={`fixed inset-0 z-40 ${sidebarOpen ? 'block' : 'hidden'} lg:hidden`}>
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeSidebar}></div>
        <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-3">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Administrador</p>
                <p className="text-sm font-semibold text-slate-800">{user?.nombre}</p>
              </div>
            </div>
          </div>

          <nav className="p-4">
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Panel Admin</p>
              {adminMenuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 mb-1 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-slate-600 hover:bg-purple-50 hover:text-purple-600'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">General</p>
              {generalMenuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className="flex items-center gap-3 px-4 py-3 mb-1 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all duration-300"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        </aside>
      </div>

      {/* Sidebar desktop colapsable */}
      <aside className={`hidden lg:block fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-30 pt-20 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      }`}>
        <div className="h-[calc(100vh-5rem)] overflow-y-auto">
        <button
          onClick={toggleSidebarCollapse}
          className="absolute -right-3 top-24 bg-white border-2 border-slate-200 rounded-full p-1 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 shadow-md"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4 text-slate-600" /> : <ChevronLeft className="w-4 h-4 text-slate-600" />}
        </button>

        <nav className="p-4 h-full overflow-y-auto">
          <div className="mb-6">
            {!sidebarCollapsed && (
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Panel Admin</p>
            )}
            {adminMenuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 mb-1 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-slate-600 hover:bg-purple-50 hover:text-purple-600'
                  } ${sidebarCollapsed ? 'justify-center' : ''}`
                }
                title={sidebarCollapsed ? item.name : ''}
              >
                <item.icon className="w-5 h-5" />
                {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
              </NavLink>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-4">
            {!sidebarCollapsed && (
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">General</p>
            )}
            {generalMenuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all duration-300 ${
                  sidebarCollapsed ? 'justify-center' : ''
                }`}
                title={sidebarCollapsed ? item.name : ''}
              >
                <item.icon className="w-5 h-5" />
                {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
              </NavLink>
            ))}
          </div>
        </nav>
        </div>
      </aside>
    </>
  );
}
