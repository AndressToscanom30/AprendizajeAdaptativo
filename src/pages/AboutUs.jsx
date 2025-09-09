


function AboutUs() {
    return (
        <div>
            {/* Hero Section */}
            <div className="bg-white">
                <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-1/2 text-left md:ml-10 mb-8 md:mb-0">
                        <h1 className="text-4xl font-bold mb-2">Conócenos</h1>
                        <p className="text-gray-600 mb-4 max-w-lg">
                            En Aprendizaje Adaptativo creemos que la educación debe ser personalizada, inclusiva y emocionante. Nuestra misión es transformar la manera en que las personas aprenden, conectando tecnología, pasión y comunidad.
                        </p>
                        <div className="flex gap-6 mt-6">
                            <a href="/contact" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">Contáctanos</a>
                            <a href="/register" className="text-gray-700 px-6 py-2 rounded-lg border hover:bg-gray-50">Únete</a>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center md:w-1/2">
                        <img
                            src="/AA-logo.png"
                            alt="Logo Aprendizaje Adaptativo"
                            className="max-w-[260px] w-full object-contain rounded-2xl shadow-md"
                        />
                    </div>
                </div>
            </div>

            {/* Misión, Visión y Valores */}
            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold text-blue-600 mb-2">Misión</h3>
                            <p className="text-gray-600 text-sm">Empoderar a cada persona para que alcance su máximo potencial a través de experiencias de aprendizaje adaptativas y tecnológicas.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold text-blue-600 mb-2">Visión</h3>
                            <p className="text-gray-600 text-sm">Ser la plataforma líder en educación personalizada, inspirando a millones a aprender de manera inteligente y colaborativa.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold text-blue-600 mb-2">Valores</h3>
                            <ul className="list-disc list-inside text-gray-600 text-sm text-left mt-2">
                                <li>Innovación</li>
                                <li>Inclusión</li>
                                <li>Colaboración</li>
                                <li>Pasión por enseñar</li>
                                <li>Transparencia</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Equipo */}
            <div className="bg-white py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-2xl font-bold text-center mb-8">Nuestro Equipo</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-sm">
                            <img src="/Ferb.webp" alt="Miembro del equipo" className="w-20 h-20 object-contain rounded-full mb-4" />
                            <h4 className="font-semibold text-blue-600">Andres Toscano</h4>
                            <p className="text-sm text-gray-600">Frontend/UX</p>
                        </div>
                        <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-sm">
                            <img src="/Baljeet.png" alt="Miembro del equipo" className="w-20 h-20 object-contain rounded-full mb-4" />
                            <h4 className="font-semibold text-blue-600">Yeremy Silva</h4>
                            <p className="text-sm text-gray-600">Backend/IA</p>
                        </div>
                        <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-sm">
                            <img src="/Phineas.webp" alt="Miembro del equipo" className="w-20 h-20 object-contain rounded-full mb-4" />
                            <h4 className="font-semibold text-blue-600">Keivercito</h4>
                            <p className="text-sm text-gray-600">Gay</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA final */}
            <div className="bg-blue-50 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">¿Quieres formar parte de nuestra comunidad?</h2>
                    <p className="mb-6 text-gray-700">Regístrate y comienza tu viaje de aprendizaje adaptativo con nosotros.</p>
                    <a href="/register" className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600">Registrarse</a>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;