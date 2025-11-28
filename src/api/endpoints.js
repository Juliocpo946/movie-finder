import { omdbClient } from './omdb';

export const CONTENT_TYPES = {
  ALL: '',
  MOVIE: 'movie',
  SERIES: 'series',
  EPISODE: 'episode'
};

export const omdbApi = {
  search: (query, options = {}) => {
    const { page = 1, type = '', year = '' } = options;
    const params = { page };
    
    if (type && type !== 'all') {
      params.type = type;
    }
    
    if (year) {
      params.y = year;
    }
    
    return omdbClient.search(query, params);
  },

  getById: (imdbId, fullPlot = true) => {
    return omdbClient.getById(imdbId, fullPlot);
  },

  getByTitle: (title, options = {}) => {
    const { type = '', year = '' } = options;
    const params = {};
    
    if (type) {
      params.type = type;
    }
    
    if (year) {
      params.y = year;
    }
    
    return omdbClient.getByTitle(title, params);
  },

  searchWithPagination: async (query, options = {}) => {
    const { page = 1, type = '', year = '' } = options;
    const result = await omdbApi.search(query, { page, type, year });
    
    if (!result.success) {
      return result;
    }
    
    const totalResults = parseInt(result.data.totalResults, 10) || 0;
    const totalPages = Math.ceil(totalResults / 10);
    
    return {
      success: true,
      data: {
        items: result.data.Search || [],
        totalResults,
        totalPages,
        currentPage: page
      },
      message: 'Success'
    };
  }
};