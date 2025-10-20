import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useSidebar } from "../context/SidebarContext.jsx";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  UserCircle, 
  ClipboardList, 
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  Settings,
  LogOut
} from "lucide-react";

export default function NavBarEstudiantes() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { sidebarOpen, sidebarCollapsed, closeSidebar } = useSidebar();

  useEffect(() => {
    closeSidebar();
  }, [location.pathname, closeSidebar]);

  if (!user || user.rol !== "estudiante") return null;

  const studentMenuItems = [
    { name: "Dashboard", href: "/dashboardE", icon: LayoutDashboard },
    { name: "Diagnóstico", href: "/diagnostico", icon: ClipboardList },
    { name: "Perfil", href: "/perfil", icon: UserCircle },
  ];

  const generalMenuItems = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Recursos", href: "/recursos", icon: BookOpen },
  ];

  const getLinkClass = ({ isActive }, collapsed = false) => {
    const baseClass = `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative`;
    const activeClass = isActive 
      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg" 
      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600";
    
    return `${baseClass} ${activeClass} ${collapsed ? 'justify-center' : ''}`;
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] border-r z-40 
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
        ${sidebarCollapsed ? "md:w-16" : "md:w-64"} w-64`}
        style={{ background: '#EAF4FF', borderColor: '#D7EAFB' }}
      >
        <div className={`p-4 border-b border-gray-200 ${sidebarCollapsed ? 'px-2' : ''}`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#93c5fd,#60a5fa)' }}>
              <UserCircle className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Estudiante</p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.nombre || user?.email}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-3">
          <div className={`${sidebarCollapsed ? '' : 'mb-4'}`}>
            {!sidebarCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
                Panel de Estudiante
              </h3>
            )}
            <nav className="space-y-1">
              {studentMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) => getLinkClass({ isActive }, sidebarCollapsed)}
                    onClick={closeSidebar}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {item.name}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-gray-200">
            {!sidebarCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
                General
              </h3>
            )}
            <nav className="space-y-1">
              {generalMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) => getLinkClass({ isActive }, sidebarCollapsed)}
                    onClick={closeSidebar}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {item.name}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        <div className={`mt-auto p-3 border-t border-gray-200 ${sidebarCollapsed ? 'px-2' : ''}`}>
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">Cerrar Sesión</span>}
            {sidebarCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Cerrar Sesión
              </div>
            )}
          </button>
        </div>
      </aside>

      <div className={`hidden md:block transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} flex-shrink-0`} />
    </>
  );
}

