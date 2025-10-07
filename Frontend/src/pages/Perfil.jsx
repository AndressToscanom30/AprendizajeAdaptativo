import { useAuth } from "../context/AuthContext.jsx";

export default function Perfil() {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Perfil del Estudiante</h1>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {user?.nombre?.charAt(0) || 'E'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{user?.nombre}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Estudiante
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Información Personal</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Nombre:</span> {user?.nombre}</p>
              <p><span className="font-medium">Email:</span> {user?.email}</p>
              <p><span className="font-medium">Rol:</span> {user?.rol}</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Progreso</h3>
            <p className="text-sm text-gray-600">Funcionalidad en desarrollo...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
