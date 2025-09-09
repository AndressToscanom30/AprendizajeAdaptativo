function Contact() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f8fd]">
            <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-md flex flex-col items-center">
                <img
                    src="/AA-logo.png"
                    alt="Logo Aprendizaje Adaptativo"
                    className="w-32 h-32 object-contain mb-4"
                />
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Contáctanos</h2>
                    <p className="text-base text-gray-600">
                        ¿Tienes dudas, sugerencias o quieres colaborar con nosotros? ¡Escríbenos!
                    </p>
                </div>
                <form className="w-full">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1" htmlFor="nombre">
                            Nombre
                        </label>
                        <input
                            id="nombre"
                            type="text"
                            placeholder="Tu nombre"
                            className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                        />
                    </div>
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
                        <label className="block text-gray-700 mb-1" htmlFor="mensaje">
                            Mensaje
                        </label>
                        <textarea
                            id="mensaje"
                            rows={4}
                            placeholder="Escribe tu mensaje aquí..."
                            className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
                    >
                        Enviar mensaje
                    </button>
                </form>
                <hr className="my-6 w-full border-gray-200" />
                <div className="text-center text-sm text-gray-500">
                    También puedes escribirnos a <a href="mailto:contacto@aprendizajeadaptativo.com" className="text-blue-600 font-semibold hover:underline">contacto@aprendizajeadaptativo.com</a>
                </div>
            </div>
        </div>
    );
}

export default Contact;

