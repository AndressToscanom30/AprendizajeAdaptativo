/**
 * Servicio de Evaluaciones
 * Gestiona todas las peticiones HTTP relacionadas con evaluaciones
 */

// Constantes de configuración
const API_BASE_URL = 'http://localhost:4000/api';
const ENDPOINTS = {
  EVALUACIONES: '/evaluaciones',
  INTENTOS: '/intentos',
  ANALISIS_IA: '/ia',
};

/**
 * Obtiene el token de autenticación del localStorage
 * @returns {string|null} Token de autenticación
 * @private
 */
const getAuthToken = () => localStorage.getItem('token');

/**
 * Crea los headers estándar para peticiones autenticadas
 * @returns {Object} Headers de la petición
 * @private
 */
const getAuthHeaders = () => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  'Content-Type': 'application/json',
});

/**
 * Maneja errores de respuesta de la API
 * @param {Response} response - Respuesta de fetch
 * @throws {Error} Si la respuesta no es exitosa
 * @private
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Servicio de evaluaciones
 */
const evaluacionesService = {
  /**
   * Obtiene todas las evaluaciones disponibles para el usuario actual
   * @returns {Promise<Array>} Lista de evaluaciones
   */
  async obtenerEvaluaciones() {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.EVALUACIONES}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  /**
   * Obtiene una evaluación específica por su ID
   * @param {string|number} id - ID de la evaluación
   * @returns {Promise<Object>} Datos de la evaluación
   */
  async obtenerEvaluacionPorId(id) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.EVALUACIONES}/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  /**
   * Crea una nueva evaluación
   * @param {Object} datos - Datos de la evaluación
   * @param {string} datos.titulo - Título de la evaluación
   * @param {string} datos.descripcion - Descripción
   * @param {number} datos.duracion_minutos - Duración en minutos
   * @param {Array} datos.preguntas - Array de preguntas
   * @returns {Promise<Object>} Evaluación creada
   */
  async crearEvaluacion(datos) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.EVALUACIONES}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(datos),
    });
    return handleResponse(response);
  },

  /**
   * Actualiza una evaluación existente
   * @param {string|number} id - ID de la evaluación
   * @param {Object} datos - Datos a actualizar
   * @returns {Promise<Object>} Evaluación actualizada
   */
  async actualizarEvaluacion(id, datos) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.EVALUACIONES}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(datos),
    });
    return handleResponse(response);
  },

  /**
   * Elimina una evaluación
   * @param {string|number} id - ID de la evaluación
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  async eliminarEvaluacion(id) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.EVALUACIONES}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  /**
   * Inicia un nuevo intento de evaluación
   * @param {string|number} evaluacionId - ID de la evaluación
   * @returns {Promise<Object>} Datos del intento creado
   */
  async iniciarIntento(evaluacionId) {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.INTENTOS}/evaluacion/${evaluacionId}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  /**
   * Envía las respuestas de un intento
   * @param {string|number} intentoId - ID del intento
   * @param {Array} respuestas - Array de respuestas
   * @returns {Promise<Object>} Resultado del intento
   */
  async enviarRespuestas(intentoId, respuestas) {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.INTENTOS}/${intentoId}/respuestas`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ respuestas }),
      }
    );
    return handleResponse(response);
  },

  /**
   * Obtiene los intentos de una evaluación específica
   * @param {string|number} evaluacionId - ID de la evaluación
   * @returns {Promise<Array>} Lista de intentos
   */
  async obtenerIntentos(evaluacionId) {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.INTENTOS}/evaluacion/${evaluacionId}/intentos`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  /**
   * Solicita análisis con IA de un intento
   * @param {string|number} intentoId - ID del intento
   * @returns {Promise<Object>} Análisis generado por IA
   */
  async analizarIntento(intentoId) {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.ANALISIS_IA}/analizar/${intentoId}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  /**
   * Obtiene todos los análisis del usuario actual
   * @returns {Promise<Array>} Lista de análisis
   */
  async obtenerMisAnalisis() {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.ANALISIS_IA}/mis-analisis`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  /**
   * Obtiene el análisis detallado de un intento específico
   * @param {string|number} analisisId - ID del análisis
   * @returns {Promise<Object>} Análisis detallado
   */
  async obtenerAnalisisDetallado(analisisId) {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.ANALISIS_IA}/analisis/${analisisId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  /**
   * Genera un test adaptativo basado en el análisis
   * @param {string|number} analisisId - ID del análisis
   * @returns {Promise<Object>} Test adaptativo generado
   */
  async generarTestAdaptativo(analisisId) {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.ANALISIS_IA}/generar-test/${analisisId}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },
};

export default evaluacionesService;
