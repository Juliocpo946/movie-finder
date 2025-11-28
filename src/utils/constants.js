export const CONTENT_TYPES = {
  ALL: 'all',
  MOVIE: 'movie',
  SERIES: 'series',
  EPISODE: 'episode'
};

export const SORT_OPTIONS = [
  { value: 'year_desc', label: 'Más recientes' },
  { value: 'year_asc', label: 'Más antiguas' },
  { value: 'title_asc', label: 'Título A-Z' },
  { value: 'title_desc', label: 'Título Z-A' }
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
  ITEMS_PER_PAGE: 10
};

// ESTA ES LA LÍNEA QUE TE FALTA Y CAUSA EL ERROR
export const CACHE_DURATION = 5 * 60 * 1000; 

export const DEBOUNCE_DELAY = 500;
export const PLACEHOLDER_IMAGE = 'https://placehold.co/300x450/1a1a1a/ededed?text=NO+IMG';

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

// TENDENCIAS Y GÉNEROS
export const INITIAL_QUERIES = [
  'Marvel', 'Star Wars', 'Harry Potter', 'Lord of the Rings', 
  'John Wick', 'Batman', 'Spider-Man', 'Inception', 
  'Matrix', 'Dune', 'Fast and Furious', 'Godzilla'
];

export const GENRES = [
  { label: 'ACTION', value: 'Action' },
  { label: 'COMEDY', value: 'Comedy' },
  { label: 'DRAMA', value: 'Drama' },
  { label: 'HORROR', value: 'Horror' },
  { label: 'SCI-FI', value: 'Sci-Fi' },
  { label: 'ANIMATION', value: 'Animation' }
];