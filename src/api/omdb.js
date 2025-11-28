const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_OMDB_BASE_URL || 'https://www.omdbapi.com/';

const HTTP_STATUS = {
  200: 'Success',
  400: 'Bad Request',
  401: 'Unauthorized - Invalid API key',
  403: 'Forbidden',
  404: 'Not Found',
  408: 'Request Timeout',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable'
};

const OMDB_ERRORS = {
  'Movie not found!': 'Movie not found',
  'Series not found!': 'Series not found',
  'Incorrect IMDb ID.': 'Invalid IMDb ID',
  'Invalid API key!': 'Invalid API key',
  'Request limit reached!': 'Request limit reached',
  'Too many results.': 'Too many results - Please refine your search',
  'Something went wrong.': 'Something went wrong'
};

const buildUrl = (params = {}) => {
  const url = new URL(BASE_URL);
  url.searchParams.append('apikey', API_KEY || '');
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
};

const handleResponse = async (response) => {
  if (!response.ok) {
    return {
      success: false,
      message: HTTP_STATUS[response.status] || `HTTP Error ${response.status}`,
      data: null
    };
  }

  try {
    const data = await response.json();
    if (data.Response === 'False') {
      return {
        success: false,
        message: OMDB_ERRORS[data.Error] || data.Error || 'Unknown error',
        data: null
      };
    }
    return { success: true, data, message: 'Success' };
  } catch (e) {
    return { success: false, message: 'Invalid JSON response', data: null };
  }
};

const omdbClient = {
  async search(query, params = {}) {
    try {
      const url = buildUrl({ s: query, ...params });
      const response = await fetch(url);
      return handleResponse(response);
    } catch (error) {
      console.error("OMDb Search Error:", error);
      return {
        success: false,
        message: error.message || 'Network Error',
        data: null
      };
    }
  },

  async getById(imdbId, fullPlot = true) {
    try {
      const url = buildUrl({ i: imdbId, plot: fullPlot ? 'full' : 'short' });
      const response = await fetch(url);
      return handleResponse(response);
    } catch (error) {
      console.error("OMDb GetById Error:", error);
      return {
        success: false,
        message: error.message || 'Network Error',
        data: null
      };
    }
  },

  async getByTitle(title, params = {}) {
    try {
      const url = buildUrl({ t: title, plot: 'full', ...params });
      const response = await fetch(url);
      return handleResponse(response);
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Network Error',
        data: null
      };
    }
  }
};

export { omdbClient, HTTP_STATUS, OMDB_ERRORS };