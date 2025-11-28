export const CONTENT_TYPES = {
  ALL: 'all',
  MOVIE: 'movie',
  SERIES: 'series',
  EPISODE: 'episode'
};

export const SORT_OPTIONS = [
  { value: 'year_desc', label: 'Mas recientes' },
  { value: 'year_asc', label: 'Mas antiguas' },
  { value: 'title_asc', label: 'Titulo A-Z' },
  { value: 'title_desc', label: 'Titulo Z-A' }
];

export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
};

export const STORAGE_KEYS = {
  FAVORITES: 'movie_finder_favorites',
  THEME: 'movie_finder_theme',
  VIEW_MODE: 'movie_finder_view_mode',
  SEARCH_HISTORY: 'movie_finder_search_history'
};

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light'
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  ITEMS_PER_PAGE: 20
};

export const DEBOUNCE_DELAY = 500;

export const CACHE_DURATION = 5 * 60 * 1000;

export const PLACEHOLDER_IMAGE = '/placeholder-poster.png';

export const RATING_COLORS = {
  HIGH: '#22c55e',
  MEDIUM: '#eab308',
  LOW: '#ef4444'
};

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536
};