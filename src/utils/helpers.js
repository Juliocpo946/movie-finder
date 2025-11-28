import { RATING_COLORS, PLACEHOLDER_IMAGE } from './constants';

const GENRE_TRANSLATIONS = {
  'Action': 'Acción',
  'Adventure': 'Aventura',
  'Animation': 'Animación',
  'Biography': 'Biografía',
  'Comedy': 'Comedia',
  'Crime': 'Crimen',
  'Documentary': 'Documental',
  'Drama': 'Drama',
  'Family': 'Familia',
  'Fantasy': 'Fantasía',
  'Film-Noir': 'Cine Negro',
  'History': 'Historia',
  'Horror': 'Terror',
  'Music': 'Música',
  'Musical': 'Musical',
  'Mystery': 'Misterio',
  'Romance': 'Romance',
  'Sci-Fi': 'Ciencia Ficción',
  'Short': 'Corto',
  'Sport': 'Deporte',
  'Thriller': 'Suspenso',
  'War': 'Guerra',
  'Western': 'Western'
};

export const translateGenre = (genreString, language) => {
  if (!genreString || language === 'en') return genreString;
  
  return genreString.split(', ').map(g => GENRE_TRANSLATIONS[g] || g).join(', ');
};

export const translateType = (type, language) => {
  if (!type) return '';
  if (language === 'en') return type;

  const types = {
    'movie': 'Película',
    'series': 'Serie',
    'episode': 'Episodio',
    'game': 'Juego'
  };
  return types[type] || type;
};

export const getPosterUrl = (poster) => {
  if (!poster || poster === 'N/A') {
    return PLACEHOLDER_IMAGE;
  }
  return poster;
};

export const formatRuntime = (runtime) => {
  if (!runtime || runtime === 'N/A') {
    return 'N/A';
  }
  
  const minutes = parseInt(runtime, 10);
  if (isNaN(minutes)) {
    return runtime;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}min`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}min`;
};

export const parseImdbRating = (rating) => {
  if (!rating || rating === 'N/A') {
    return 0;
  }
  return parseFloat(rating) || 0;
};

export const formatVotes = (votes) => {
  if (!votes || votes === 'N/A') {
    return '0';
  }
  
  const numVotes = parseInt(votes.replace(/,/g, ''), 10);
  if (isNaN(numVotes)) {
    return votes;
  }
  
  if (numVotes >= 1000000) {
    return `${(numVotes / 1000000).toFixed(1)}M`;
  }
  if (numVotes >= 1000) {
    return `${(numVotes / 1000).toFixed(1)}K`;
  }
  return numVotes.toString();
};

export const getRatingColor = (rating) => {
  const numRating = parseImdbRating(rating);
  if (numRating >= 7) {
    return RATING_COLORS.HIGH;
  }
  if (numRating >= 5) {
    return RATING_COLORS.MEDIUM;
  }
  return RATING_COLORS.LOW;
};

export const truncateText = (text, maxLength = 150) => {
  if (!text || text === 'N/A') {
    return '';
  }
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength).trim()}...`;
};

export const formatYear = (year) => {
  if (!year || year === 'N/A') {
    return '';
  }
  return year.toString().split('–')[0].trim();
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const isValidImdbId = (id) => {
  return /^tt\d{7,8}$/.test(id);
};

// MODIFICADO: Ahora filtra duplicados antes de devolver el array
export const parseSearchResults = (data) => {
  if (!data || !data.Search) {
    return [];
  }
  
  // Usamos un Map para eliminar duplicados basados en imdbID
  const uniqueItems = Array.from(new Map(data.Search.map(item => [item.imdbID, item])).values());

  return uniqueItems.map((item) => ({
    ...item,
    Poster: getPosterUrl(item.Poster)
  }));
};

export const getTotalResults = (data) => {
  if (!data || !data.totalResults) {
    return 0;
  }
  return parseInt(data.totalResults, 10) || 0;
};

export const getTotalPages = (data) => {
  const total = getTotalResults(data);
  return Math.ceil(total / 10);
};

export const sortResults = (results, sortBy) => {
  const sorted = [...results];
  
  switch (sortBy) {
    case 'year_desc':
      return sorted.sort((a, b) => parseInt(b.Year, 10) - parseInt(a.Year, 10));
    case 'year_asc':
      return sorted.sort((a, b) => parseInt(a.Year, 10) - parseInt(b.Year, 10));
    case 'title_asc':
      return sorted.sort((a, b) => a.Title.localeCompare(b.Title));
    case 'title_desc':
      return sorted.sort((a, b) => b.Title.localeCompare(a.Title));
    default:
      return sorted;
  }
};