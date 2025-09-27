import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Code, Trophy, RotateCcw, Play, Terminal, Lightbulb, Zap, Brain, Target } from 'lucide-react';

const CodeEditor = ({ code, onChange, language = 'javascript', readOnly = false }) => {
  const textareaRef = useRef(null);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="relative">
      <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-slate-400 text-sm font-mono">{language}</span>
        </div>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            className="w-full h-40 p-4 bg-slate-900 text-green-400 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            style={{ lineHeight: '1.5' }}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};

const CodeOutput = ({ output, isError = false, isLoading = false }) => {
  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 mt-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
        <Terminal className="w-4 h-4 text-slate-400" />
        <span className="text-slate-400 text-sm font-mono">Salida</span>
        {isLoading && (
          <div className="ml-auto">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="text-slate-400 font-mono text-sm">Ejecutando código...</div>
        ) : (
          <pre className={`font-mono text-sm whitespace-pre-wrap ${
            isError ? 'text-red-400' : 'text-green-400'
          }`}>
            {output || 'Presiona "Ejecutar" para ver el resultado'}
          </pre>
        )}
      </div>
    </div>
  );
};

const questions = [
  {
    id: 1,
    type: 'coding',
    question: "Crea una función que salude a una persona",
    description: "Escribe una función llamada 'saludar' que reciba un nombre como parámetro y retorne un saludo personalizado.",
    initialCode: `function saludar(nombre) {
  // Tu código aquí
  
}

// Prueba tu función
console.log(saludar("Ana"));`,
    solution: `function saludar(nombre) {
  return "¡Hola, " + nombre + "!";
}

// Prueba tu función
console.log(saludar("Ana"));`,
    expectedOutput: "¡Hola, Ana!",
    hints: [
      "Usa 'return' para devolver el resultado",
      "Puedes concatenar strings con el operador '+'",
      "No olvides usar el parámetro 'nombre' en tu función"
    ],
    explanation: "Las funciones nos permiten encapsular código reutilizable. En este caso, creamos una función que toma un parámetro y retorna un valor calculado."
  },
  {
    id: 2,
    type: 'coding',
    question: "Suma de números en un array",
    description: "Crea una función que calcule la suma de todos los números en un array.",
    initialCode: `function sumarArray(numeros) {
  // Tu código aquí
  
}

// Prueba tu función
const miArray = [1, 2, 3, 4, 5];
console.log(sumarArray(miArray));`,
    solution: `function sumarArray(numeros) {
  let suma = 0;
  for (let i = 0; i < numeros.length; i++) {
    suma += numeros[i];
  }
  return suma;
}

// Prueba tu función
const miArray = [1, 2, 3, 4, 5];
console.log(sumarArray(miArray));`,
    expectedOutput: "15",
    hints: [
      "Inicializa una variable 'suma' en 0",
      "Usa un bucle for para recorrer el array",
      "Suma cada elemento al total"
    ],
    explanation: "Los bucles nos permiten iterar sobre estructuras de datos como arrays. El bucle for es perfecto cuando conocemos la cantidad de iteraciones."
  },
  {
    id: 3,
    type: 'coding',
    question: "Números pares e impares",
    description: "Escribe una función que determine si un número es par o impar.",
    initialCode: `function esParOImpar(numero) {
  // Tu código aquí
  
}

// Prueba tu función
console.log(esParOImpar(4));
console.log(esParOImpar(7));`,
    solution: `function esParOImpar(numero) {
  if (numero % 2 === 0) {
    return "par";
  } else {
    return "impar";
  }
}

// Prueba tu función
console.log(esParOImpar(4));
console.log(esParOImpar(7));`,
    expectedOutput: "par\nimpar",
    hints: [
      "Usa el operador módulo (%) para obtener el resto de la división",
      "Si el resto es 0, el número es par",
      "Usa una estructura if-else para la lógica"
    ],
    explanation: "El operador módulo (%) nos da el resto de una división. Es muy útil para determinar si un número es divisible por otro."
  },
  {
    id: 4,
    type: 'coding',
    question: "Encontrar el mayor número",
    description: "Crea una función que encuentre el número mayor en un array.",
    initialCode: `function encontrarMayor(numeros) {
  // Tu código aquí
  
}

// Prueba tu función
const numeros = [3, 7, 2, 9, 1, 5];
console.log(encontrarMayor(numeros));`,
    solution: `function encontrarMayor(numeros) {
  let mayor = numeros[0];
  for (let i = 1; i < numeros.length; i++) {
    if (numeros[i] > mayor) {
      mayor = numeros[i];
    }
  }
  return mayor;
}

// Prueba tu función
const numeros = [3, 7, 2, 9, 1, 5];
console.log(encontrarMayor(numeros));`,
    expectedOutput: "9",
    hints: [
      "Inicializa 'mayor' con el primer elemento del array",
      "Compara cada elemento con el valor actual de 'mayor'",
      "Actualiza 'mayor' si encuentras un valor más grande"
    ],
    explanation: "Este algoritmo usa una técnica común: mantener el mejor valor encontrado hasta ahora y comparar cada nuevo elemento con él."
  },
  {
    id: 5,
    type: 'coding',
    question: "Contador de vocales",
    description: "Escribe una función que cuente cuántas vocales hay en una palabra.",
    initialCode: `function contarVocales(palabra) {
  // Tu código aquí
  
}

// Prueba tu función
console.log(contarVocales("programacion"));`,
    solution: `function contarVocales(palabra) {
  const vocales = "aeiouAEIOU";
  let contador = 0;
  
  for (let i = 0; i < palabra.length; i++) {
    if (vocales.includes(palabra[i])) {
      contador++;
    }
  }
  
  return contador;
}

// Prueba tu función
console.log(contarVocales("programacion"));`,
    expectedOutput: "5",
    hints: [
      "Define una string con todas las vocales",
      "Recorre cada carácter de la palabra",
      "Usa el método includes() para verificar si es vocal"
    ],
    explanation: "Este ejercicio combina bucles, condicionales y métodos de string. El método includes() es muy útil para verificar si un elemento está en una colección."
  },
  {
    id: 6,
    type: 'multiple',
    question: "¿Cuál es la diferencia entre '==' y '===' en JavaScript?",
    options: [
      "No hay diferencia, son sinónimos",
      "== compara valor, === compara valor y tipo",
      "=== es más lento que ==",
      "== solo funciona con números"
    ],
    correctAnswer: 1,
    explanation: "== realiza conversión de tipos antes de comparar, mientras que === compara tanto el valor como el tipo sin conversión."
  },
  {
    id: 7,
    type: 'coding',
    question: "Tabla de multiplicar",
    description: "Crea una función que genere la tabla de multiplicar de un número del 1 al 10.",
    initialCode: `function tablaMultiplicar(numero) {
  // Tu código aquí
  
}

// Prueba tu función
tablaMultiplicar(5);`,
    solution: `function tablaMultiplicar(numero) {
  for (let i = 1; i <= 10; i++) {
    console.log(numero + " x " + i + " = " + (numero * i));
  }
}

// Prueba tu función
tablaMultiplicar(5);`,
    expectedOutput: "5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50",
    hints: [
      "Usa un bucle for del 1 al 10",
      "Multiplica el número por cada valor del bucle",
      "Usa console.log para mostrar cada resultado"
    ],
    explanation: "Los bucles son perfectos para tareas repetitivas como generar tablas de multiplicar. Cada iteración realiza el mismo cálculo con diferentes valores."
  },
  {
    id: 8,
    type: 'coding',
    question: "Invertir una cadena",
    description: "Escribe una función que invierta una cadena de texto.",
    initialCode: `function invertirCadena(texto) {
  // Tu código aquí
  
}

// Prueba tu función
console.log(invertirCadena("hola"));`,
    solution: `function invertirCadena(texto) {
  let resultado = "";
  for (let i = texto.length - 1; i >= 0; i--) {
    resultado += texto[i];
  }
  return resultado;
}

// Prueba tu función
console.log(invertirCadena("hola"));`,
    expectedOutput: "aloh",
    hints: [
      "Recorre la cadena desde el último carácter hasta el primero",
      "Usa un bucle for con i-- para ir hacia atrás",
      "Concatena cada carácter en una nueva string"
    ],
    explanation: "Para invertir una cadena, recorremos desde el final hacia el principio. El índice texto.length - 1 nos da la posición del último carácter."
  },
  {
    id: 9,
    type: 'multiple',
    question: "¿Qué es el scope (ámbito) de una variable?",
    options: [
      "El tipo de dato que puede almacenar",
      "La región del código donde la variable es accesible",
      "La cantidad de memoria que ocupa",
      "La velocidad de acceso a la variable"
    ],
    correctAnswer: 1,
    explanation: "El scope determina dónde en el código una variable puede ser accedida. Puede ser global, de función, o de bloque."
  },
  {
    id: 10,
    type: 'coding',
    question: "Calculadora básica",
    description: "Crea una función calculadora que realice operaciones básicas (+, -, *, /).",
    initialCode: `function calculadora(num1, operador, num2) {
  // Tu código aquí
  
}

// Prueba tu función
console.log(calculadora(10, "+", 5));
console.log(calculadora(10, "*", 3));`,
    solution: `function calculadora(num1, operador, num2) {
  switch(operador) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "*":
      return num1 * num2;
    case "/":
      return num1 / num2;
    default:
      return "Operador no válido";
  }
}

// Prueba tu función
console.log(calculadora(10, "+", 5));
console.log(calculadora(10, "*", 3));`,
    expectedOutput: "15\n30",
    hints: [
      "Usa una estructura switch para manejar diferentes operadores",
      "Cada case debe retornar el resultado de la operación",
      "Incluye un case default para operadores inválidos"
    ],
    explanation: "La estructura switch es ideal cuando necesitamos ejecutar diferentes acciones basadas en el valor de una variable. Es más limpia que múltiples if-else."
  }
];

function Diagnostico() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);

  const progress = (userAnswers.length / questions.length) * 100;
  const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;

  const executeCode = () => {
    setIsExecuting(true);
    setCodeOutput('');
    
    try {
      const originalConsoleLog = console.log;
      let output = '';
      
      console.log = (...args) => {
        output += args.join(' ') + '\n';
      };
      
      const func = new Function(userCode);
      func();
      
      console.log = originalConsoleLog;
      
      setCodeOutput(output.trim());
    } catch (error) {
      setCodeOutput(`Error: ${error.message}`);
    }
    
    setTimeout(() => setIsExecuting(false), 500);
  };

  const checkCodeAnswer = () => {
    const currentQ = questions[currentQuestion];
    if (currentQ.type === 'coding') {
      executeCode();
      const isCorrect = codeOutput.trim() === currentQ.expectedOutput;
      return isCorrect;
    }
    return false;
  };

  useEffect(() => {
    const currentQ = questions[currentQuestion];
    const existingAnswer = userAnswers.find(answer => answer.questionId === currentQ.id);
    
    if (existingAnswer) {
      if (currentQ.type === 'coding') {
        setUserCode(existingAnswer.userCode || currentQ.initialCode);
      } else {
        setSelectedOption(existingAnswer.selectedAnswer);
      }
    } else {
      if (currentQ.type === 'coding') {
        setUserCode(currentQ.initialCode);
      } else {
        setSelectedOption(null);
      }
    }
    
    setShowExplanation(false);
    setShowHints(false);
    setCurrentHint(0);
    setCodeOutput('');
  }, [currentQuestion, userAnswers]);

  const handleAnswerSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    const currentQ = questions[currentQuestion];
    let isCorrect = false;
    let newAnswer;

    if (currentQ.type === 'coding') {
      executeCode();
      setTimeout(() => {
        const output = codeOutput.trim();
        isCorrect = output === currentQ.expectedOutput;
        
        newAnswer = {
          questionId: currentQ.id,
          userCode: userCode,
          codeOutput: output,
          isCorrect
        };
        
        const updatedAnswers = userAnswers.filter(answer => answer.questionId !== currentQ.id);
        setUserAnswers([...updatedAnswers, newAnswer]);
        
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setShowResults(true);
        }
      }, 600);
    } else {
      if (selectedOption !== null) {
        isCorrect = selectedOption === currentQ.correctAnswer;
        newAnswer = {
          questionId: currentQ.id,
          selectedAnswer: selectedOption,
          isCorrect
        };

        const updatedAnswers = userAnswers.filter(answer => answer.questionId !== currentQ.id);
        setUserAnswers([...updatedAnswers, newAnswer]);

        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setShowResults(true);
        }
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
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium text-slate-800">
                                {index + 1}. {question.question}
                              </p>
                              {question.type === 'coding' && (
                                <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full">
                                  <Code className="w-3 h-3 text-purple-600" />
                                  <span className="text-purple-700 text-xs font-medium">Código</span>
                                </div>
                              )}
                            </div>
                            
                            {question.type === 'coding' ? (
                              <div className="space-y-2">
                                <div className="text-sm text-slate-600">
                                  <span className="font-medium">Salida esperada:</span> 
                                  <code className="bg-slate-100 px-2 py-1 rounded text-xs ml-1">
                                    {question.expectedOutput}
                                  </code>
                                </div>
                                <div className="text-sm text-slate-600">
                                  <span className="font-medium">Tu salida:</span> 
                                  <code className={`px-2 py-1 rounded text-xs ml-1 ${
                                    userAnswer?.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {userAnswer?.codeOutput || 'Sin ejecutar'}
                                  </code>
                                </div>
                                {userAnswer?.userCode && (
                                  <details className="mt-2">
                                    <summary className="text-sm font-medium text-slate-700 cursor-pointer hover:text-slate-900">
                                      Ver tu código
                                    </summary>
                                    <pre className="mt-2 p-3 bg-slate-900 text-green-400 rounded-lg text-xs overflow-x-auto">
                                      <code>{userAnswer.userCode}</code>
                                    </pre>
                                  </details>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <p className="text-sm text-slate-600">
                                  <span className="font-medium">Tu respuesta:</span> {question.options?.[userAnswer?.selectedAnswer] || 'Sin responder'}
                                </p>
                                {!userAnswer?.isCorrect && question.options && (
                                  <p className="text-sm text-green-700">
                                    <span className="font-medium">Respuesta correcta:</span> {question.options[question.correctAnswer]}
                                  </p>
                                )}
                              </div>
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-[#155dfc] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Pregunta {currentQuestion + 1}
                  </span>
                  <span className="text-slate-500 text-sm">de {questions.length}</span>
                  {questions[currentQuestion].type === 'coding' && (
                    <div className="flex items-center gap-1 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full">
                      <Code className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-700 text-sm font-medium">Código Interactivo</span>
                    </div>
                  )}
                </div>
                {questions[currentQuestion].type === 'coding' && (
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span className="text-sm font-medium">Pistas</span>
                  </button>
                )}
              </div>
              <h2 className="text-xl font-semibold text-slate-800 leading-relaxed mb-2">
                {questions[currentQuestion].question}
              </h2>
              {questions[currentQuestion].description && (
                <p className="text-slate-600 text-sm">
                  {questions[currentQuestion].description}
                </p>
              )}
            </div>

            {questions[currentQuestion].type === 'coding' && showHints && (
              <div className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Pista {currentHint + 1} de {questions[currentQuestion].hints.length}</span>
                </div>
                <p className="text-amber-700 mb-3">
                  {questions[currentQuestion].hints[currentHint]}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentHint(Math.max(0, currentHint - 1))}
                    disabled={currentHint === 0}
                    className="px-3 py-1 text-sm bg-amber-200 text-amber-800 rounded disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentHint(Math.min(questions[currentQuestion].hints.length - 1, currentHint + 1))}
                    disabled={currentHint === questions[currentQuestion].hints.length - 1}
                    className="px-3 py-1 text-sm bg-amber-200 text-amber-800 rounded disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}

            {questions[currentQuestion].type === 'coding' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <Terminal className="w-5 h-5" />
                    Editor de Código
                  </h3>
                  <button
                    onClick={executeCode}
                    disabled={isExecuting}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50"
                  >
                    {isExecuting ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    {isExecuting ? 'Ejecutando...' : 'Ejecutar'}
                  </button>
                </div>
                
                <CodeEditor
                  code={userCode}
                  onChange={setUserCode}
                  language="javascript"
                />
                
                <CodeOutput
                  output={codeOutput}
                  isLoading={isExecuting}
                />
              </div>
            ) : (
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
            )}
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

            <div className="flex items-center gap-3">
              {questions[currentQuestion].type === 'coding' && (
                <button
                  onClick={() => setUserCode(questions[currentQuestion].solution)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
                >
                  <Target className="w-4 h-4" />
                  Ver Solución
                </button>
              )}
              
              <button
                onClick={handleNext}
                disabled={questions[currentQuestion].type === 'multiple' ? selectedOption === null : userCode.trim() === ''}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  (questions[currentQuestion].type === 'multiple' ? selectedOption === null : userCode.trim() === '')
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#155dfc] to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-105 shadow-lg'
                }`}
              >
                {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Siguiente'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Diagnostico;