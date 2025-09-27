function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Acceso denegado</h1>
        <p className="text-gray-700 mb-6">
          No tienes permisos para acceder a esta página.
        </p>
        <a 
          href="/" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ir al inicio
        </a>
      </div>
    </div>
  );
}
export default Unauthorized;
