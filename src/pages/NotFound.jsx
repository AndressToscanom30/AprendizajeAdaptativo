import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Lightbulb, 
  GraduationCap, 
  Search, 
  Home, 
  ArrowRight,
  Sparkles,
  Target,
  Brain
} from 'lucide-react';

function NotFound() {
   const [searchQuery, setSearchQuery] = useState('');
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        console.log('Searching for:', searchQuery);
     }
};

  const suggestions = [
    'Operadores lógicos',
    'Operadores aritméticos',
    'Condicionales',
    'Búcles',
    'Algoritmos'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 overflow-hidden relative">

      <div className="absolute inset-0 pointer-events-none">

        <div className="absolute top-20 left-10 animate-float">
          <BookOpen className="w-8 h-8 text-blue-300 opacity-60" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <GraduationCap className="w-10 h-10 text-green-300 opacity-60" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-float-slow">
          <Lightbulb className="w-6 h-6 text-yellow-300 opacity-60" />
        </div>
        <div className="absolute top-1/2 right-10 animate-float">
          <Brain className="w-8 h-8 text-purple-300 opacity-60" />
        </div>
        <div className="absolute bottom-20 right-1/3 animate-float-delayed">
          <Sparkles className="w-7 h-7 text-pink-300 opacity-60" />
        </div>
        <div className="absolute top-1/3 left-1/5 animate-float-slow">
          <Target className="w-6 h-6 text-orange-300 opacity-60" />
        </div>
      </div>

      <div className={`max-w-2xl mx-auto text-center transition-all duration-1000 ${
        isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="mb-8">
          <div className="relative mb-6">
            <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-pulse-gentle">
              404
            </h1>
            <div className="absolute -top-4 -right-4 animate-spin-slow">
              <Lightbulb className="w-12 h-12 text-yellow-400" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 animate-fade-in-up">
            ¡Ups! Esta lección se escondió
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed animate-fade-in-up-delayed">
            Parece que el contenido que buscas decidió tomarse un recreo. 
            <br className="hidden sm:block" />
            ¡Pero no te preocupes, hay muchas otras lecciones esperándote!
          </p>
        </div>

        <div className="mb-8 animate-fade-in-up-delayed-2">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="¿Qué quieres aprender hoy?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 text-lg border-2 border-blue-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Search className="w-6 h-6" />
              </button>
            </div>
          </form>

          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-3">Sugerencias populares:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(suggestion)}
                  className="px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md text-sm">
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up-delayed-3">
            
        <Link to={"/"}>
            <button className="group flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
                <a >Ir al inicio</a>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
          
          <button className="group flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <BookOpen className="w-5 h-5 transition-transform group-hover:scale-110" />
            Explorar cursos
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mt-12 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl animate-fade-in-up-delayed-4">
          <blockquote className="text-gray-700 italic text-lg mb-2">
            "El aprendizaje nunca agota la mente. Cada error es una oportunidad para crecer."
          </blockquote>
          <cite className="text-gray-500 text-sm">- Leonardo da Vinci (adaptado)</cite>
        </div>
      </div>
    </div>
  );
}

export default NotFound;