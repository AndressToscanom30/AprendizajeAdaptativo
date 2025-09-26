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

        <Route path="/dashboardE" element={<DashboardE />} />
        <Route path="/dashboardP" element={<DashboardP />} />
        <Route path="/diagnostico" element={<Diagnostico />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;