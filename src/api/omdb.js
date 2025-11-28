const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_OMDB_BASE_URL;

const HTTP_STATUS = {
  200: 'Exito',
  201: 'Recurso creado exitosamente',
  204: 'Sin contenido',
  400: 'Solicitud invalida',
  401: 'No autorizado - API key invalida',
  403: 'Acceso denegado',
  404: 'Recurso no encontrado',
  408: 'Tiempo de espera agotado',
  429: 'Demasiadas solicitudes - Limite excedido',
  500: 'Error interno del servidor',
  502: 'Servidor no disponible',
  503: 'Servicio no disponible',
  504: 'Tiempo de espera del servidor agotado'
};

const OMDB_ERRORS = {
  'Movie not found!': 'Pelicula no encontrada',
  'Series not found!': 'Serie no encontrada',
  'Incorrect IMDb ID.': 'ID de IMDb incorrecto',
  'Invalid API key!': 'API key invalida',
  'Request limit reached!': 'Limite de solicitudes alcanzado',
  'Too many results.': 'Demasiados resultados - Especifica mas tu busqueda',
  'Something went wrong.': 'Algo salio mal - Intenta de nuevo'
};

const getHttpErrorMessage = (status) => {
  return HTTP_STATUS[status] || `Error desconocido (${status})`;
};

const getOmdbErrorMessage = (error) => {
  return OMDB_ERRORS[error] || error || 'Error desconocido';
};

const buildUrl = (params = {}) => {
  const url = new URL(BASE_URL);
  url.searchParams.append('apikey', API_KEY);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
};

const handleResponse = async (response) => {
  const status = response.status;

  if (!response.ok) {
    throw {
      status,
      message: getHttpErrorMessage(status),
      data: null
    };
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw {
      status: 500,
      message: 'Error al procesar la respuesta',
      data: null
    };
  }

  if (data.Response === 'False') {
    throw {
      status: 404,
      message: getOmdbErrorMessage(data.Error),
      data: null
    };
  }

  return {
    success: true,
    data,
    message: HTTP_STATUS[200],
    status: 200
  };
};

const omdbClient = {
  async search(query, params = {}) {
    try {
      const url = buildUrl({ s: query, ...params });
      const response = await fetch(url);
      return await handleResponse(response);
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw {
        status: 0,
        message: 'Error de conexion - Verifica tu internet',
        data: null
      };
    }
  },

  async getById(imdbId) {
    try {
      const url = buildUrl({ i: imdbId, plot: 'full' });
      const response = await fetch(url);
      return await handleResponse(response);
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw {
        status: 0,
        message: 'Error de conexion - Verifica tu internet',
        data: null
      };
    }
  },

  async getByTitle(title, params = {}) {
    try {
      const url = buildUrl({ t: title, plot: 'full', ...params });
      const response = await fetch(url);
      return await handleResponse(response);
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw {
        status: 0,
        message: 'Error de conexion - Verifica tu internet',
        data: null
      };
    }
  }
};

export { 
  omdbClient, 
  HTTP_STATUS, 
  OMDB_ERRORS,
  getHttpErrorMessage, 
  getOmdbErrorMessage 
};