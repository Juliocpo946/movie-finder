import { tmdbClient } from './tmdb';

export const CONTENT_TYPES = {
  ALL: 'all',
  MOVIE: 'movie',
  SERIES: 'tv'
};

export const tmdbApi = tmdbClient;