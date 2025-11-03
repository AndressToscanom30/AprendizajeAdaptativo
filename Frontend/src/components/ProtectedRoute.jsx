import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (typeof children === 'function') {
    return children(user);
  }

  return children;
}

export default ProtectedRoute;
