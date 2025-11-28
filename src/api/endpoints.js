import { omdbClient } from './omdb';

export const CONTENT_TYPES = {
  MOVIE: 'movie',
  SERIES: 'series',
  EPISODE: 'episode'
};

export const omdbApi = {
  // Búsqueda estándar limpia
  search: (query, page = 1, type = null, year = null) => {
    const params = { page };
    // Solo agregamos parámetros si tienen valor real
    if (type && type !== 'all') params.type = type;
    if (year) params.y = year;
    return omdbClient.search(query, params);
  },

  getById: (imdbId) => 
    omdbClient.getById(imdbId),

  // Para obtener detalles completos (necesario para ver el género real)
  getByTitle: (title) => {
    return omdbClient.getByTitle(title);
  }
};