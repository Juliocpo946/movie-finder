export const CONTENT_TYPES = {
  ALL: 'all',
  MOVIE: 'movie',
  SERIES: 'tv'
};

export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Top Rated' },
  { value: 'primary_release_date.desc', label: 'Newest' },
  { value: 'primary_release_date.asc', label: 'Oldest' }
];

export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
};

export const STORAGE_KEYS = {
  FAVORITES: 'movie_finder_favorites',
  THEME: 'movie_finder_theme',
};

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light'
};

export const TMDB_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

export const CACHE_DURATION = 5 * 60 * 1000;
export const DEBOUNCE_DELAY = 500;
export const PLACEHOLDER_IMAGE = 'https://placehold.co/300x450/1a1a1a/ededed?text=No+Poster';

export const RATING_COLORS = {
  HIGH: '#22c55e',
  MEDIUM: '#eab308',
  LOW: '#ef4444'
};

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280
};

export const TYPE_FILTERS = [
  { label: 'MOVIES', value: 'movie' },
  { label: 'SERIES', value: 'tv' }
];