import { omdbClient } from './omdb';

const CONTENT_TYPES = {
  MOVIE: 'movie',
  SERIES: 'series',
  EPISODE: 'episode'
};

export const omdbApi = {
  search: (query, page = 1, type = null) => {
    const params = { page };
    if (type) params.type = type;
    return omdbClient.search(query, params);
  },

  searchMovies: (query, page = 1) => 
    omdbClient.search(query, { page, type: CONTENT_TYPES.MOVIE }),

  searchSeries: (query, page = 1) => 
    omdbClient.search(query, { page, type: CONTENT_TYPES.SERIES }),

  searchByYear: (query, year, page = 1, type = null) => {
    const params = { page, y: year };
    if (type) params.type = type;
    return omdbClient.search(query, params);
  },

  searchMoviesByYear: (query, year, page = 1) => 
    omdbClient.search(query, { page, y: year, type: CONTENT_TYPES.MOVIE }),

  searchSeriesByYear: (query, year, page = 1) => 
    omdbClient.search(query, { page, y: year, type: CONTENT_TYPES.SERIES }),

  getById: (imdbId) => 
    omdbClient.getById(imdbId),

  getByTitle: (title, year = null, type = null) => {
    const params = {};
    if (year) params.y = year;
    if (type) params.type = type;
    return omdbClient.getByTitle(title, params);
  },

  getMovieByTitle: (title, year = null) => {
    const params = { type: CONTENT_TYPES.MOVIE };
    if (year) params.y = year;
    return omdbClient.getByTitle(title, params);
  },

  getSeriesByTitle: (title, year = null) => {
    const params = { type: CONTENT_TYPES.SERIES };
    if (year) params.y = year;
    return omdbClient.getByTitle(title, params);
  },

  getEpisode: (imdbId, season, episode) => 
    omdbClient.getById(imdbId, { Season: season, Episode: episode })
};

export { CONTENT_TYPES };