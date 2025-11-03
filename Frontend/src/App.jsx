import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SidebarProvider } from "./context/SidebarContext.jsx";
import Home from "./pages/Home";
import NavigationWrapper from "./components/NavigationWrapper.jsx";
import StudentLayout from "./components/StudentLayout.jsx";
import ProfessorLayout from "./components/ProfessorLayout.jsx";
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
import Estudiantes from "./pages/Estudiantes.jsx";
import Reportes from "./pages/Reportes.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import RecuperarPassword from "./pages/RecuperarPassword.jsx";
import EvaluacionesProfesor from "./pages/evaluaciones/profesor/EvaluacionesProfesor.jsx";
import CrearEvaluacionForm from "./pages/evaluaciones/profesor/CrearEvaluacionForm.jsx";
import Evaluacion from "./pages/evaluaciones/Evaluaciones.jsx";


function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white">
            <NavigationWrapper />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />

              <Route path="/recursos" element={
                <ProtectedRoute roles={["estudiante", "profesor"]}>
                  {(user) => {
                    const content = (
                      <div className="p-8">
                        <h1 className="text-2xl font-bold">Recursos de Aprendizaje</h1>
                        <p>Página en construcción...</p>
                      </div>
                    );
                    return user.rol === "profesor" ? (
                      <ProfessorLayout>{content}</ProfessorLayout>
                    ) : (
                      <StudentLayout>{content}</StudentLayout>
                    );
                  }}
                </ProtectedRoute>
              } />
              <Route path="/recuperarPass" element={<RecuperarPassword />} />

              <Route path="/evaluaciones/profesor" element={
                <ProtectedRoute roles={["profesor"]}>
                  <ProfessorLayout>
                    <EvaluacionesProfesor />
                  </ProfessorLayout>
                </ProtectedRoute>
              }/>
              <Route path="/evaluaciones" element={
                <ProtectedRoute roles={["estudiante"]}>
                  <StudentLayout>
                    <Evaluacion />
                  </StudentLayout>
                </ProtectedRoute>
              } />
              <Route path="/crearEvaluacion" element={
                <ProtectedRoute roles={["profesor"]}>
                  <ProfessorLayout>
                    <CrearEvaluacionForm />
                  </ProfessorLayout>
                </ProtectedRoute>
              }/>
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
                    <ProfessorLayout>
                      <DashboardP />
                    </ProfessorLayout>
                  </ProtectedRoute>}
              />

              <Route path="/estudiantes"
                element={
                  <ProtectedRoute roles={["profesor"]}>
                    <ProfessorLayout>
                      <Estudiantes />
                    </ProfessorLayout>
                  </ProtectedRoute>}
              />

              <Route path="/reportes"
                element={
                  <ProtectedRoute roles={["profesor"]}>
                    <ProfessorLayout>
                      <Reportes />
                    </ProfessorLayout>
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
                  <ProtectedRoute roles={["estudiante", "profesor"]}>
                    {(user) => user.rol === "profesor" ? (
                      <ProfessorLayout>
                        <Perfil />
                      </ProfessorLayout>
                    ) : (
                      <StudentLayout>
                        <Perfil />
                      </StudentLayout>
                    )}
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