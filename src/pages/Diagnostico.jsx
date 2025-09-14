import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Code, Trophy, RotateCcw } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: "¿Cuál es la diferencia principal entre una variable y una constante?",
    options: [
      "Las variables pueden cambiar su valor, las constantes no",
      "Las constantes son más rápidas que las variables",
      "No hay diferencia, son sinónimos",
      "Las variables solo almacenan números"
    ],
    correctAnswer: 0,
    explanation: "Las variables pueden modificar su valor durante la ejecución del programa, mientras que las constantes mantienen el mismo valor."
  },
  {
    id: 2,
    question: "¿Qué hace un bucle 'for'?",
    options: [
      "Ejecuta código una sola vez",
      "Repite un bloque de código un número específico de veces",
      "Solo funciona con números pares",
      "Elimina variables de la memoria"
    ],
    correctAnswer: 1,
    explanation: "Un bucle 'for' permite repetir un bloque de código un número determinado de veces, controlado por una condición."
  },
  {
    id: 3,
    question: "¿Cuál es el propósito de una función?",
    options: [
      "Ocupar más espacio en memoria",
      "Hacer el código más lento",
      "Organizar y reutilizar código",
      "Solo para matemáticas complejas"
    ],
    correctAnswer: 2,
    explanation: "Las funciones permiten organizar el código en bloques reutilizables, mejorando la legibilidad y mantenimiento."
  },
  {
    id: 4,
    question: "¿Qué es un array (arreglo)?",
    options: [
      "Un tipo de variable que solo almacena texto",
      "Una colección ordenada de elementos",
      "Un error en el programa",
      "Una función especial"
    ],
    correctAnswer: 1,
    explanation: "Un array es una estructura de datos que permite almacenar múltiples elementos de forma ordenada y accesible por índice."
  },
  {
    id: 5,
    question: "¿Cuál de estos NO es un tipo de dato básico?",
    options: [
      "String (cadena de texto)",
      "Integer (número entero)",
      "Boolean (verdadero/falso)",
      "Loop (bucle)"
    ],
    correctAnswer: 3,
    explanation: "Loop no es un tipo de dato, sino una estructura de control. Los tipos básicos incluyen string, integer, boolean, etc."
  },
  {
    id: 6,
    question: "¿Qué hace el operador '==' en la mayoría de lenguajes?",
    options: [
      "Asigna un valor a una variable",
      "Compara si dos valores son iguales",
      "Suma dos números",
      "Elimina una variable"
    ],
    correctAnswer: 1,
    explanation: "El operador '==' se usa para comparar si dos valores son iguales, no para asignar valores (eso es '=')."
  },
  {
    id: 7,
    question: "¿Cuál es la diferencia entre '++i' e 'i++'?",
    options: [
      "No hay diferencia",
      "++i incrementa antes de usar, i++ incrementa después de usar",
      "++i es más lento que i++",
      "Solo funciona con números negativos"
    ],
    correctAnswer: 1,
    explanation: "++i (pre-incremento) incrementa primero y luego devuelve el valor, i++ (post-incremento) devuelve el valor y luego incrementa."
  },
  {
    id: 8,
    question: "¿Qué es la recursión en programación?",
    options: [
      "Un error que se repite",
      "Una función que se llama a sí misma",
      "Un tipo de variable especial",
      "Una forma de comentar código"
    ],
    correctAnswer: 1,
    explanation: "La recursión es cuando una función se invoca a sí misma para resolver un problema dividiéndolo en subproblemas más pequeños."
  },
  {
    id: 9,
    question: "¿Cuál es el propósito del debugging?",
    options: [
      "Hacer el código más rápido",
      "Encontrar y corregir errores en el código",
      "Añadir más funciones al programa",
      "Cambiar el lenguaje de programación"
    ],
    correctAnswer: 1,
    explanation: "El debugging es el proceso de identificar, analizar y corregir errores (bugs) en el código para que funcione correctamente."
  },
  {
    id: 10,
    question: "¿Qué significa que un algoritmo sea eficiente?",
    options: [
      "Que sea muy largo y complejo",
      "Que use muchas variables",
      "Que resuelva el problema usando pocos recursos (tiempo/memoria)",
      "Que solo funcione en ciertos ordenadores"
    ],
    correctAnswer: 2,
    explanation: "Un algoritmo eficiente es aquel que resuelve un problema utilizando la menor cantidad de recursos (tiempo de ejecución y memoria) posible."
  }
];

function Diagnostico() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const progress = (userAnswers.length / questions.length) * 100;
  const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;

  useEffect(() => {
    const existingAnswer = userAnswers.find(answer => answer.questionId === questions[currentQuestion].id);
    if (existingAnswer) {
      setSelectedOption(existingAnswer.selectedAnswer);
    } else {
      setSelectedOption(null);
    }
    setShowExplanation(false);
  }, [currentQuestion, userAnswers]);

  const handleAnswerSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      const isCorrect = selectedOption === questions[currentQuestion].correctAnswer;
      const newAnswer = {
        questionId: questions[currentQuestion].id,
        selectedAnswer: selectedOption,
        isCorrect
      };

      const updatedAnswers = userAnswers.filter(answer => answer.questionId !== questions[currentQuestion].id);
      setUserAnswers([...updatedAnswers, newAnswer]);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResults(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuestionNavigation = (questionIndex) => {
    setCurrentQuestion(questionIndex);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setShowResults(false);
    setShowExplanation(false);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 9) return '¡Excelente! Tienes un conocimiento sólido de programación básica.';
    if (score >= 7) return '¡Bien! Tienes buenas bases, pero hay algunos conceptos que puedes reforzar.';
    if (score >= 5) return 'Nivel intermedio. Te recomendamos repasar algunos conceptos fundamentales.';
    return 'Necesitas reforzar los conceptos básicos de programación. ¡No te desanimes, sigue practicando!';
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-slate-800 mb-2">¡Test Completado!</h1>
                <p className="text-slate-600">Has terminado el diagnóstico de programación básica</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
                <div className="text-center">
                  <div className={`text-6xl font-bold mb-2 ${getScoreColor(correctAnswers)}`}>
                    {correctAnswers}/{questions.length}
                  </div>
                  <div className="text-slate-600 mb-4">
                    {Math.round((correctAnswers / questions.length) * 100)}% de aciertos
                  </div>
                  <p className="text-slate-700 text-lg">
                    {getScoreMessage(correctAnswers)}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Resumen de Respuestas</h3>
                <div className="grid gap-4">
                  {questions.map((question, index) => {
                    const userAnswer = userAnswers.find(answer => answer.questionId === question.id);
                    return (
                      <div key={question.id} 
                           className={`p-4 rounded-lg border-2 ${
                             userAnswer?.isCorrect 
                               ? 'border-green-200 bg-green-50' 
                               : 'border-red-200 bg-red-50'
                           }`}>
                        <div className="flex items-start gap-3">
                          {userAnswer?.isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-slate-800 mb-2">
                              {index + 1}. {question.question}
                            </p>
                            <p className="text-sm text-slate-600 mb-1">
                              <span className="font-medium">Tu respuesta:</span> {question.options[userAnswer?.selectedAnswer || 0]}
                            </p>
                            {!userAnswer?.isCorrect && (
                              <p className="text-sm text-green-700">
                                <span className="font-medium">Respuesta correcta:</span> {question.options[question.correctAnswer]}
                              </p>
                            )}
                            <p className="text-sm text-slate-600 mt-2 italic">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={resetTest}
                  className="inline-flex items-center gap-2 bg-[#155dfc] hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <RotateCcw className="w-5 h-5" />
                  Repetir Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#155dfc] text-white px-4 py-2 rounded-full mb-4">
              <Code className="w-5 h-5" />
              <span className="font-semibold">Test Diagnóstico</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Programación Básica</h1>
            <p className="text-slate-600">Evalúa tus conocimientos fundamentales de programación</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-600">Progreso del Test</span>
              <span className="text-sm font-semibold text-[#155dfc]">
                {userAnswers.length}/{questions.length} completadas
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-[#155dfc] to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {questions.map((_, index) => {
                const isAnswered = userAnswers.some(answer => answer.questionId === questions[index].id);
                const isCurrent = index === currentQuestion;
                return (
                  <button
                    key={index}
                    onClick={() => handleQuestionNavigation(index)}
                    className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      isCurrent
                        ? 'bg-[#155dfc] text-white shadow-lg scale-110'
                        : isAnswered
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#155dfc] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Pregunta {currentQuestion + 1}
                </span>
                <span className="text-slate-500 text-sm">de {questions.length}</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-800 leading-relaxed">
                {questions[currentQuestion].question}
              </h2>
            </div>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                    selectedOption === index
                      ? 'border-[#155dfc] bg-blue-50 shadow-md'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === index
                        ? 'border-[#155dfc] bg-[#155dfc]'
                        : 'border-slate-300'
                    }`}>
                      {selectedOption === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className={`font-medium ${
                      selectedOption === index ? 'text-[#155dfc]' : 'text-slate-700'
                    }`}>
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                currentQuestion === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300 hover:scale-105'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>

            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                selectedOption === null
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-[#155dfc] text-white hover:bg-blue-700 hover:scale-105 shadow-lg'
              }`}
            >
              {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Siguiente'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Diagnostico;