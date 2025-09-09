
function AboutUs() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f8fd]">
            <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-md flex flex-col items-center">
                <img
                    src="/AA-logo.png"
                    alt="Logo Aprendizaje Adaptativo"
                    className="w-32 h-32 object-contain mb-4"
                />
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Sobre Nosotros</h2>
                    <p className="text-base text-gray-600">
                        Somos una plataforma dedicada a ofrecer experiencias de aprendizaje personalizadas y adaptativas para todos. Nuestro objetivo es potenciar el desarrollo académico y profesional de nuestros usuarios, utilizando tecnología y metodologías innovadoras.
                    </p>
                </div>
                <div className="w-full mt-4">
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">¿Qué nos hace diferentes?</h3>
                    <ul className="list-disc list-inside text-gray-600 text-sm mb-4">
                        <li>Contenidos adaptados a tu ritmo y nivel.</li>
                        <li>Seguimiento personalizado de tu progreso.</li>
                        <li>Comunidad activa y soporte constante.</li>
                        <li>Acceso a recursos exclusivos y actualizados.</li>
                    </ul>
                </div>
                <hr className="my-6 w-full border-gray-200" />
                <div className="text-center text-sm text-gray-500">
                    ¿Quieres saber más? <a href="/contact" className="text-blue-600 font-semibold hover:underline">Contáctanos</a>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;