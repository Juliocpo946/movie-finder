import { RATING_COLORS, PLACEHOLDER_IMAGE } from './constants';

export const getPosterUrl = (poster) => {
  if (!poster || poster === 'N/A') return PLACEHOLDER_IMAGE;
  return poster;
};

export const formatDate = (dateString) => {
  if (!dateString || dateString === 'N/A') return 'Fecha no disponible';
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  try {
    return new Date(dateString).toLocaleDateString('es-MX', options);
  } catch (e) {
    return dateString;
  }
};

export const formatYear = (year) => {
  if (!year || year === 'N/A') return '';
  return year.toString().split('–')[0].trim();
};

export const formatRuntime = (runtime) => {
  if (!runtime || runtime === 'N/A') return 'Duración no disponible';
  
  const minutes = parseInt(runtime);
  if (isNaN(minutes)) return runtime;
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

export const formatRating = (rating) => {
  if (!rating || rating === 'N/A') return 'N/A';
  return rating;
};

export const parseImdbRating = (rating) => {
  if (!rating || rating === 'N/A') return 0;
  return parseFloat(rating);
};

export const formatVotes = (votes) => {
  if (!votes || votes === 'N/A') return '0';
  
  const numVotes = parseInt(votes.replace(/,/g, ''));
  if (isNaN(numVotes)) return votes;
  
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
  if (numRating >= 7) return RATING_COLORS.HIGH;
  if (numRating >= 5) return RATING_COLORS.MEDIUM;
  return RATING_COLORS.LOW;
};

export const truncateText = (text, maxLength = 150) => {
  if (!text || text === 'N/A') return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

export const getTitle = (item) => {
  return item.Title || 'Sin título';
};

export const getYear = (item) => {
  return formatYear(item.Year);
};

export const getType = (item) => {
  const types = {
    movie: 'Película',
    series: 'Serie',
    episode: 'Episodio'
  };
  return types[item.Type] || item.Type;
};

export const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const parseOmdbSearch = (data) => {
  if (!data || !data.Search) return [];
  return data.Search;
};

export const getTotalResults = (data) => {
  if (!data || !data.totalResults) return 0;
  return parseInt(data.totalResults);
};

export const getTotalPages = (data) => {
  const total = getTotalResults(data);
  return Math.ceil(total / 10);
};