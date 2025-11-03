import { useAuth } from "../context/AuthContext.jsx";
import { useSidebar } from "../context/SidebarContext.jsx";

export default function ProfessorLayout({ children }) {
  const { user } = useAuth();
  const { sidebarCollapsed } = useSidebar();

  if (!user || user.rol !== "profesor") {
    return <div>{children}</div>;
  }

  return (
    <div>
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {children}
      </main>
    </div>
  );
}
