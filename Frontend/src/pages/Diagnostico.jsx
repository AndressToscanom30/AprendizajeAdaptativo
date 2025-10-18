import { useState } from "react";
import axios from "axios";

const Diagnostico = () => {
  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState(null);

  const handleChange = (preguntaId, valor) => {
    setRespuestas({ ...respuestas, [preguntaId]: valor });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // Token del login
      const res = await axios.post(
        "http://localhost:4000/api/diagnostico",
        { respuestas },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResultado(res.data);
    } catch (error) {
      console.error("Error al enviar diagnóstico:", error);
    }
  };

  return (
    <div>
      <h2>Diagnóstico</h2>
      <form onSubmit={handleSubmit}>
        <p>1. ¿Qué es un algoritmo?</p>
        <select onChange={(e) => handleChange(1, e.target.value)}>
          <option value="">Seleccione</option>
          <option value="a">Una secuencia de pasos lógicos</option>
          <option value="b">Una estructura de datos</option>
          <option value="c">Un lenguaje de programación</option>
        </select>

        {/* Aquí irían las demás preguntas... */}

        <button type="submit">Enviar</button>
      </form>

      {resultado && (
        <div>
          <h3>Resultado: {resultado.nivel}</h3>
          <p>Puntaje: {resultado.puntaje}</p>
        </div>
      )}
    </div>
  );
};

export default Diagnostico;
