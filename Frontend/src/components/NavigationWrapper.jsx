import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "./Navbar";
import NavBarEstudiantes from "./navBarEstudiantes.jsx";
import NavBarProfesores from "./navBarProfesores.jsx";

export default function NavigationWrapper() {
  const { user } = useAuth();

  if (!user) {
    return <Navbar />;
  }

  if (user.rol === "estudiante") {
    return <NavBarEstudiantes />;
  }

  if (user.rol === "profesor") {
    return <NavBarProfesores />;
  }

  return <Navbar />;
}
