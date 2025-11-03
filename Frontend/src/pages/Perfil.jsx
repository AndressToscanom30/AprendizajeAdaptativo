import { useState } from 'react';
import { useAuth } from "../context/AuthContext.jsx";
import { User, Mail, Shield, Edit2, Save, X, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Perfil() {
  const { user, setUser } = useAuth();
  const [editando, setEditando] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [datosEditados, setDatosEditados] = useState({
    nombre: user?.nombre || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleEditar = () => {
    setEditando(true);
    setDatosEditados({
      nombre: user?.nombre || '',
      email: user?.email || ''
    });
  };

  const handleCancelar = () => {
    setEditando(false);
    setDatosEditados({
      nombre: user?.nombre || '',
      email: user?.email || ''
    });
    setError('');
  };

  const handleGuardar = async () => {
    setLoading(true);
    setError('');
    setMensaje('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosEditados)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar perfil');
      }

      const data = await response.json();

      // Actualizar el contexto de autenticación
      setUser({
        ...user,
        nombre: datosEditados.nombre,
        email: datosEditados.email
      });

      setMensaje('✓ Perfil actualizado correctamente');
      setEditando(false);
      
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarPassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');
    setMensaje('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/users/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (!response.ok) throw new Error('Error al cambiar contraseña');

      setMensaje('✓ Contraseña actualizada correctamente');
      setCambiandoPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      setError('Error al cambiar la contraseña. Verifica tu contraseña actual.');
    } finally {
      setLoading(false);
    }
  };

  const getRolColor = (rol) => {
    switch(rol) {
      case 'admin': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'profesor': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'estudiante': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getRolIcon = () => {
    if (user?.rol === 'admin') return '👑';
    if (user?.rol === 'profesor') return '👨‍🏫';
    return '🎓';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Mensajes */}
        {mensaje && (
          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 text-green-700 font-semibold">
            {mensaje}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-700 font-semibold">
            {error}
          </div>
        )}

        {/* Perfil Principal */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-3xl font-bold text-slate-800">Mi Perfil</h1>
            {!editando && (
              <button
                onClick={handleEditar}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-4xl font-bold">
                {user?.nombre?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>

            {/* Información */}
            <div className="flex-1 space-y-4 w-full">
              {/* Nombre */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <User className="w-4 h-4" />
                  Nombre Completo
                </label>
                {editando ? (
                  <input
                    type="text"
                    value={datosEditados.nombre}
                    onChange={(e) => setDatosEditados({ ...datosEditados, nombre: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                ) : (
                  <p className="text-xl font-semibold text-slate-800">{user?.nombre}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Correo Electrónico
                </label>
                {editando ? (
                  <input
                    type="email"
                    value={datosEditados.email}
                    onChange={(e) => setDatosEditados({ ...datosEditados, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                ) : (
                  <p className="text-lg text-slate-700">{user?.email}</p>
                )}
              </div>

              {/* Rol */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Shield className="w-4 h-4" />
                  Rol en el Sistema
                </label>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 ${getRolColor(user?.rol)}`}>
                  <span>{getRolIcon()}</span>
                  {user?.rol?.charAt(0).toUpperCase() + user?.rol?.slice(1)}
                </span>
              </div>

              {/* Botones de edición */}
              {editando && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleGuardar}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Guardar
                  </button>
                  <button
                    onClick={handleCancelar}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-semibold"
                  >
                    <X className="w-5 h-5" />
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cambiar Contraseña */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-2">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Seguridad</h2>
            </div>
            {!cambiandoPassword && (
              <button
                onClick={() => setCambiandoPassword(true)}
                className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-semibold text-sm"
              >
                Cambiar Contraseña
              </button>
            )}
          </div>

          {cambiandoPassword ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Contraseña Actual
                </label>
                <div className="relative">
                  <input
                    type={mostrarPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none pr-12"
                  />
                  <button
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {mostrarPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCambiarPassword}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                  Actualizar Contraseña
                </button>
                <button
                  onClick={() => {
                    setCambiandoPassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setError('');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-semibold"
                >
                  <X className="w-5 h-5" />
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-slate-600">
              Última actualización de contraseña: <span className="font-semibold">Nunca</span>
            </p>
          )}
        </div>

        {/* Información Adicional */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Información de la Cuenta</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-500 mb-1">ID de Usuario</p>
              <p className="text-xs font-mono text-slate-700 break-all">{user?.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
