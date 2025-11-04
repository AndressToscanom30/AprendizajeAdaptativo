import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SidebarProvider } from "./context/SidebarContext.jsx";
import Home from "./pages/Home";
import NavigationWrapper from "./components/NavigationWrapper.jsx";
import StudentLayout from "./components/StudentLayout.jsx";
import ProfessorLayout from "./components/ProfessorLayout.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import PublicLayout from "./components/PublicLayout.jsx";
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
import Recursos from "./pages/Recursos.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import RecuperarPassword from "./pages/RecuperarPassword.jsx";
import EvaluacionesProfesor from "./pages/evaluaciones/profesor/EvaluacionesProfesor.jsx";
import CrearEvaluacionForm from "./pages/evaluaciones/profesor/CrearEvaluacionForm.jsx";
import DetalleEvaluacion from "./pages/evaluaciones/profesor/DetalleEvaluacion.jsx";
import EditarEvaluacionForm from "./pages/evaluaciones/profesor/EditarEvaluacionForm.jsx";
import Evaluacion from "./pages/evaluaciones/Evaluaciones.jsx";
import CursosProfesor from "./pages/cursos/profesor/CursosProfesor.jsx";
import DetalleCurso from "./pages/cursos/profesor/DetalleCurso.jsx";
import MisCursos from "./pages/cursos/estudiante/MisCursos.jsx";
import DetalleCursoEstudiante from "./pages/cursos/estudiante/DetalleCursoEstudiante.jsx";
import EvaluacionesEstudiante from "./pages/evaluaciones/EvaluacionesEstudiante.jsx";
import DetalleEvaluacionEstudiante from "./pages/evaluaciones/estudiante/DetalleEvaluacionEstudiante.jsx";
import EvaluacionIntento from "./pages/evaluaciones/estudiante/EvaluacionIntento.jsx";
import AnalisisIA from "./pages/evaluaciones/estudiante/AnalisisIA.jsx";
import GestionRelaciones from "./pages/admin/GestionRelaciones.jsx";
import VerificarRelacion from "./pages/admin/VerificarRelacion.jsx";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
            <NavigationWrapper />
            <div className="flex-1 w-full overflow-x-hidden">
              <Routes>
                <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<PublicLayout><AboutUs /></PublicLayout>} />
                <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

                <Route path="/recursos" element={
                  <ProtectedRoute roles={["estudiante", "profesor"]}>
                    {(user) => {
                      const content = <Recursos />;
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
                } />
                <Route path="/profesor/evaluaciones" element={
                  <ProtectedRoute roles={["profesor"]}>
                    <ProfessorLayout>
                      <EvaluacionesProfesor />
                    </ProfessorLayout>
                  </ProtectedRoute>
                } />
                <Route path="/profesor/evaluaciones/crear" element={
                  <ProtectedRoute roles={["profesor"]}>
                    <ProfessorLayout>
                      <CrearEvaluacionForm />
                    </ProfessorLayout>
                  </ProtectedRoute>
                } />
                <Route path="/profesor/evaluaciones/detalle/:id" element={
                  <ProtectedRoute roles={["profesor"]}>
                    <ProfessorLayout>
                      <DetalleEvaluacion />
                    </ProfessorLayout>
                  </ProtectedRoute>
                } />
                <Route path="/profesor/evaluaciones/editar/:id" element={
                  <ProtectedRoute roles={["profesor"]}>
                    <ProfessorLayout>
                      <EditarEvaluacionForm />
                    </ProfessorLayout>
                  </ProtectedRoute>
                } />
                <Route path="/profesor/cursos" element={
                  <ProtectedRoute roles={["profesor"]}>
                    <ProfessorLayout>
                      <CursosProfesor />
                    </ProfessorLayout>
                  </ProtectedRoute>
                } />
                <Route path="/profesor/cursos/:id" element={
                  <ProtectedRoute roles={["profesor"]}>
                    <ProfessorLayout>
                      <DetalleCurso />
                    </ProfessorLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/relaciones" element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminLayout>
                      <GestionRelaciones />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/verificar" element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminLayout>
                      <VerificarRelacion />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
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
                } />
                <Route path="/dashboardE"
                  element={
                    <ProtectedRoute roles={["estudiante"]}>
                      <StudentLayout>
                        <DashboardE />
                      </StudentLayout>
                    </ProtectedRoute>}
                />

                {/* Rutas de Cursos Estudiante */}
                <Route path="/estudiante/cursos"
                  element={
                    <ProtectedRoute roles={["estudiante"]}>
                      <StudentLayout>
                        <MisCursos />
                      </StudentLayout>
                    </ProtectedRoute>}
                />

                <Route path="/estudiante/cursos/:id"
                  element={
                    <ProtectedRoute roles={["estudiante"]}>
                      <StudentLayout>
                        <DetalleCursoEstudiante />
                      </StudentLayout>
                    </ProtectedRoute>}
                />

                {/* Rutas de Evaluaciones Estudiante */}
                <Route path="/estudiante/evaluaciones"
                  element={
                    <ProtectedRoute roles={["estudiante"]}>
                      <StudentLayout>
                        <EvaluacionesEstudiante />
                      </StudentLayout>
                    </ProtectedRoute>}
                />

                <Route path="/estudiante/evaluacion/:id"
                  element={
                    <ProtectedRoute roles={["estudiante"]}>
                      <StudentLayout>
                        <DetalleEvaluacionEstudiante />
                      </StudentLayout>
                    </ProtectedRoute>}
                />

                <Route path="/estudiante/evaluacion/:id/intento"
                  element={
                    <ProtectedRoute roles={["estudiante"]}>
                      <EvaluacionIntento />
                    </ProtectedRoute>}
                />

                {/* Ruta de Análisis IA */}
                <Route path="/estudiante/analisis-ia"
                  element={
                    <ProtectedRoute roles={["estudiante"]}>
                      <StudentLayout>
                        <AnalisisIA />
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
            </div>
            <Footer />
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;