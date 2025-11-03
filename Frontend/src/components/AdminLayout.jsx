import { useSidebar } from "../context/SidebarContext";

export default function AdminLayout({ children }) {
  const { sidebarCollapsed } = useSidebar();

  return (
    <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
      <main className="pt-4">
        {children}
      </main>
    </div>
  );
}
