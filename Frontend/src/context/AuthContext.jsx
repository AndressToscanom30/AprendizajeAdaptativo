// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // refs para timers para poder limpiarlos
  const logoutTimerRef = useRef(null);
  const warningTimerRef = useRef(null);

  const clearTimers = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
  };

  const scheduleTokenTimers = (token) => {
    try {
      const decoded = jwtDecode(token);
      const nowSec = Date.now() / 1000;
      const timeLeftSec = decoded.exp - nowSec;
      console.log(decoded.exp)

      if (!timeLeftSec) {
        logout();
        return;
      }

      if (timeLeftSec <= -5) {
        Swal.fire("Sesión expirada", "Tu sesión ha expirado. Vuelve a iniciar sesión.", "info");
        logout();
        return;
      }

      clearTimers();

      const warningBeforeSec = 2 * 60;
      const warningTimeMs = (timeLeftSec - warningBeforeSec) * 1000;

      if (warningTimeMs > 0) {
        warningTimerRef.current = setTimeout(() => {
          Swal.fire({
            title: "Tu sesión está por expirar",
            text: "¿Deseas extenderla por 1 hora más?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Extender sesión",
            cancelButtonText: "Cerrar sesión",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const ok = await extendSession();
              if (!ok) logout();
            } else {
              logout();
            }
          });
        }, warningTimeMs);
      }

      // timer para logout al expirar
      logoutTimerRef.current = setTimeout(() => {
        // token expiró: hacer logout y notificar
        logout();
        Swal.fire("Sesión expirada", "Tu sesión ha expirado. Vuelve a iniciar sesión.", "info");
      }, timeLeftSec * 1000);
    } catch (err) {
      console.error("Error scheduleTokenTimers:", err);
      logout();
    }
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        scheduleTokenTimers(storedToken);
      }
    } catch (err) {
      console.error("Error restoring auth from localStorage:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }

    return () => {
      clearTimers();
    };
  }, []);

  const login = (userData, token) => {
    try {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      // programar timers según token
      scheduleTokenTimers(token);
    } catch (err) {
      console.error("Error en login:", err);
    }
  };

  // logout limpia todo
  const logout = () => {
    clearTimers();
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // redirigir al login o home
    window.location.href = "/login";
  };

  // intenta extender la sesión (si tienes endpoint /api/auth/refresh)
  const extendSession = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const res = await fetch("http://localhost:4000/api/auth/refresh", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.warn("refresh token failed:", res.status);
        return false;
      }

      const data = await res.json();
      if (data.token) {
        // actualizar token y reprogramar timers
        localStorage.setItem("token", data.token);
        // si quieres, también actualizar user con info del backend si viene
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
        scheduleTokenTimers(data.token);
        Swal.fire("Sesión extendida", "Tu sesión fue renovada.", "success");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error extendSession:", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, extendSession }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
