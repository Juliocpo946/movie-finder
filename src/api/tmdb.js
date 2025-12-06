const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const headers = {
  accept: 'application/json',
  Authorization: `Bearer ${ACCESS_TOKEN}`
};

const handleResponse = async (response) => {
  if (!response.ok) {
    return {
      success: false,
      message: `HTTP Error ${response.status}`,
      data: null
    };
  }
  try {
    const data = await response.json();
    return { success: true, data, message: 'Success' };
  } catch (e) {
    return { success: false, message: 'Invalid JSON', data: null };
  }
};

export const tmdbClient = {
  async getTrending(mediaType = 'all', timeWindow = 'week') {
    try {
      const response = await fetch(`${BASE_URL}/trending/${mediaType}/${timeWindow}`, { headers });
      return handleResponse(response);
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async search(query, params = {}) {
    try {
      const type = params.type === 'tv' ? 'tv' : 'movie';
      const queryString = new URLSearchParams({
        query,
        include_adult: false,
        language: 'en-US',
        page: params.page || 1,
        year: params.year || ''
      }).toString();

      const response = await fetch(`${BASE_URL}/search/${type}?${queryString}`, { headers });
      return handleResponse(response);
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async discover(params = {}) {
    try {
      const type = params.type === 'tv' ? 'tv' : 'movie';
      const queryParams = new URLSearchParams({
        include_adult: false,
        language: 'en-US',
        page: params.page || 1,
        sort_by: 'popularity.desc',
        ...params
      });

      const response = await fetch(`${BASE_URL}/discover/${type}?${queryParams.toString()}`, { headers });
      return handleResponse(response);
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async getDetails(id, type = 'movie') {
    try {
      const response = await fetch(`${BASE_URL}/${type}/${id}?append_to_response=videos,credits,similar,reviews`, { headers });
      return handleResponse(response);
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async getUpcoming() {
    try {
      const response = await fetch(`${BASE_URL}/movie/upcoming?language=en-US&page=1`, { headers });
      return handleResponse(response);
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async getPopularPeople() {
    try {
      const response = await fetch(`${BASE_URL}/person/popular?language=en-US&page=1`, { headers });
      return handleResponse(response);
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};