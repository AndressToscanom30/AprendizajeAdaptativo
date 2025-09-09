function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f8fd] px-2 sm:px-0">
      <div className="flex flex-col md:flex-row gap-6 md:gap-12 w-full max-w-3xl items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 flex items-center justify-center w-full md:w-auto mb-6 md:mb-0">
          <img
            src="/AA-logo.png"
            className="w-40 h-40 sm:w-[220px] sm:h-[220px] object-contain"
            alt="Logo Aprendizaje Adaptativo"
          />
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 w-full max-w-xs sm:max-w-sm flex flex-col justify-center">
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1" htmlFor="email">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="tucorreo@email.com"
                className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="********"
                className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex items-center mb-6">
              <input
                id="remember"
                type="checkbox"
                className="mr-2"
              />
              <label htmlFor="remember" className="text-gray-700 text-sm">
                Recordarme
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              Iniciar Sesión
              <span className="ml-1">→</span>
            </button>
          </form>
          <div className="mt-6 text-center text-sm">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-blue-600 font-semibold hover:underline">
              Regístrate aquí
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;