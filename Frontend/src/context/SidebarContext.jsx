import { createContext, useState, useContext } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const toggleSidebarCollapse = () => setSidebarCollapsed(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <SidebarContext.Provider value={{
      sidebarOpen,
      sidebarCollapsed,
      toggleSidebar,
      toggleSidebarCollapse,
      closeSidebar,
      setSidebarOpen,
      setSidebarCollapsed
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
