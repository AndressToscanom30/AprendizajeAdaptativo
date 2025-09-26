import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import DashboardE from "./pages/DashboardEstudiante";
import DashboardP from "./pages/DashboardProfesor";
import Login from "./pages/Login"
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Diagnostico from "./pages/Diagnostico";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/dashboardE" 
          element={
            <ProtectedRoute roles={["estudiante"]}>
              <DashboardE />
            </ProtectedRoute>} 
          />

        <Route path="/dashboardP" 
          element={
            <ProtectedRoute roles={["profesor"]}>
              <DashboardP />
            </ProtectedRoute>} 
          />

        <Route path="/diagnostico" element={<Diagnostico />} />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;