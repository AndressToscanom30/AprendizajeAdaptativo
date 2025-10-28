import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SidebarProvider } from "./context/SidebarContext.jsx";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import NavBarEstudiantes from "./components/navBarEstudiantes.jsx";
import StudentLayout from "./components/StudentLayout.jsx";
import Footer from "./components/Footer";
import DashboardE from "./pages/DashboardEstudiante";
import DashboardP from "./pages/DashboardProfesor";
import Login from "./pages/Login"
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Diagnostico from "./pages/Diagnostico";
import Perfil from "./pages/Perfil.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import RecuperarPassword from "./pages/RecuperarPassword.jsx";


function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white">
            <Navbar />
            <NavBarEstudiantes />
          <Routes>
          <Route path="/" element={<StudentLayout><Home /></StudentLayout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<StudentLayout><AboutUs /></StudentLayout>} />
          <Route path="/contact" element={<StudentLayout><Contact /></StudentLayout>} />
          <Route path="/recursos" element={
            <StudentLayout>
              <div className="p-8">
                <h1 className="text-2xl font-bold">Recursos de Aprendizaje</h1>
                <p>Página en construcción...</p>
              </div>
            </StudentLayout>
          } />
          <Route path="/recuperarPass" element={<RecuperarPassword />} />
          
        <Route path="/dashboardE" 
          element={
            <ProtectedRoute roles={["estudiante"]}>
              <StudentLayout>
                <DashboardE />
              </StudentLayout>
            </ProtectedRoute>} 
          />

              <Route path="/dashboardP"
                element={
                  <ProtectedRoute roles={["profesor"]}>
                    <DashboardP />
                  </ProtectedRoute>}
              />

              <Route path="/diagnostico"
                element={
                  <ProtectedRoute roles={["estudiante"]}>
                    <StudentLayout>
                      <Diagnostico />
                    </StudentLayout>
                  </ProtectedRoute>}
              />

        <Route path="/perfil" 
          element={
            <ProtectedRoute roles={["estudiante"]}>
              <StudentLayout>
                <Perfil />
              </StudentLayout>
            </ProtectedRoute>} 
          />

              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </SidebarProvider>
    </AuthProvider>
  )
}

export default App;