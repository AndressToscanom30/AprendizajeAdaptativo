
function Contact() {
    return (
        <div>
            
            <div className="bg-white">
                <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="w-full md:w-1/2 text-left md:ml-10 mb-8 md:mb-0">
                        <h1 className="text-4xl font-bold mb-2">¡Hablemos!</h1>
                        <p className="text-gray-600 mb-4 max-w-lg">
                            ¿Tienes dudas, sugerencias o quieres colaborar con nosotros? Nuestro equipo está listo para escucharte y ayudarte.
                        </p>
                        <div className="flex gap-6 mt-6">
                            <a href="mailto:contacto@aprendizajeadaptativo.com" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">Escríbenos</a>
                            <a href="/about" className="text-gray-700 px-6 py-2 rounded-lg border hover:bg-gray-50">Sobre Nosotros</a>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-blue-600 mb-2">Información de contacto</h3>
                            <ul className="text-gray-600 text-sm">
                                <li><span className="font-bold">Email:</span> keivercito@gmail.com</li>
                                <li><span className="font-bold">Teléfono:</span> +57 320 3722941</li>
                                <li><span className="font-bold">Dirección:</span> Cúcuta,Colombia</li>
                            </ul>
                        </div>
                        <div className="mt-8 flex gap-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Facebook</a>
                            <a href="https://twitter.com" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Twitter</a>
                            <a href="https://instagram.com" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Instagram</a>
                        </div>
                    </div>
                    <div className="w-full flex justify-center md:w-1/2">
                        <img
                            src="/AA-logo.png"
                            alt="Logo Aprendizaje Adaptativo"
                            className="max-w-[200px] sm:max-w-[260px] w-full object-contain rounded-2xl shadow-md"
                        />
                    </div>
                </div>
            </div>

                    
                    <div className="bg-gray-50 py-12">
                        <div className="container mx-auto px-4 max-w-2xl">
                            <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg">
                                <h2 className="text-xl font-bold text-blue-600 mb-4">Envíanos un mensaje</h2>
                                <form className="w-full">
                                    <div className="mb-4">
                                        <label className="block text-gray-700 mb-1" htmlFor="nombre">Nombre</label>
                                        <input id="nombre" type="text" placeholder="Tu nombre" className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 mb-1" htmlFor="email">Correo electrónico</label>
                                        <input id="email" type="email" placeholder="tucorreo@email.com" className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 mb-1" htmlFor="mensaje">Mensaje</label>
                                        <textarea id="mensaje" rows={4} placeholder="Escribe tu mensaje aquí..." className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"></textarea>
                                    </div>
                                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition">Enviar mensaje</button>
                                </form>
                            </div>
                        </div>
                    </div>


            
            <div className="bg-blue-50 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">¿Listo para aprender con nosotros?</h2>
                    <p className="mb-6 text-gray-700">Regístrate y recibe atención personalizada de nuestro equipo.</p>
                    <a href="/register" className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600">Registrarse</a>
                </div>
            </div>
        </div>
    );
}

export default Contact;

