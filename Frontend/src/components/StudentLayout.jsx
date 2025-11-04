import PropTypes from 'prop-types';
import { useAuth } from "../context/AuthContext.jsx";
import { useSidebar } from "../context/SidebarContext.jsx";

export default function StudentLayout({ children }) {
  const { user } = useAuth();
  const { sidebarCollapsed } = useSidebar();

  if (!user?.rol || user.rol !== "estudiante") {
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

StudentLayout.propTypes = {
  children: PropTypes.node.isRequired
};
