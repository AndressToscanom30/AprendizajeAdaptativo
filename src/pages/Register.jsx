function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f8fd] px-2 sm:px-0">
      <div className="bg-white rounded-2xl shadow-lg px-4 sm:px-8 py-8 w-full max-w-md flex flex-col items-center">
        <img
          src="/AA-logo.png"
          className="w-32 h-32 sm:w-40 sm:h-40 object-contain mb-4"
          alt="Logo Aprendizaje Adaptativo"
        />
        <div className="text-center mb-6">
          <h2 className="text-base font-normal text-gray-800">
            Únete y comienza tu experiencia de aprendizaje adaptativo
          </h2>
        </div>
        <form className="w-full">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-gray-700 mb-1" htmlFor="nombre">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                placeholder="Tu nombre"
                className="register-input w-full px-3 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block text-gray-700 mb-1" htmlFor="apellidos">
                Apellidos
              </label>
              <input
                id="apellidos"
                type="text"
                placeholder="Tus apellidos"
                className="register-input w-full px-3 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="tucorreo@gmail.com"
              className="register-input w-full px-3 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              className="register-input w-full px-3 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="confirm-password">
              Confirmar contraseña
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirmar contraseña"
              className="register-input w-full px-3 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
            />
          </div>
          <div className="flex items-center mb-6">
            <input
              id="terms"
              type="checkbox"
              className="register-checkbox mr-2"
            />
            <label htmlFor="terms" className="text-xs text-gray-500">
              Acepto los términos y condiciones y la política de privacidad
            </label>
          </div>
          <button
            type="submit"
            className="register-btn w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Crear cuenta
          </button>
        </form>
        <hr className="my-6 w-full border-gray-200" />
        <div className="register-bottom text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="register-link text-blue-600 font-semibold hover:underline">
            Inicia sesión aquí
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register; 