import { useAuth } from "../context/AuthContext.jsx";
import { useSidebar } from "../context/SidebarContext.jsx";

export default function PublicLayout({ children }) {
  const { user } = useAuth();
  const { sidebarCollapsed } = useSidebar();

  // Si no hay usuario autenticado, no aplicar margen
  if (!user) {
    return <div>{children}</div>;
  }

  // Si hay usuario, aplicar margen según el estado del sidebar
  return (
    <div>
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {children}
      </main>
    </div>
  );
}
