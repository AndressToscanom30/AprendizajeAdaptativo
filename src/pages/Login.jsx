function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f8fd]">
      <div className="flex gap-12">
        <div className="bg-white rounded-2xl shadow-lg p-12 flex items-center justify-center">
          <img
            src="/AA-logo.png"
            alt="Logo Aprendizaje Adaptativo"
            className="w-[220px] h-[220px] object-contain"
          />
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-10 w-[350px] flex flex-col justify-center">
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
            <a href="#" className="text-blue-600 font-semibold hover:underline">
              Regístrate aquí
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;