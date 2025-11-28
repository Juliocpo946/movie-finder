import { RATING_COLORS, PLACEHOLDER_IMAGE } from './constants';

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

export const getTypeLabel = (type) => {
  const types = {
    movie: 'Movie',
    series: 'Series',
    episode: 'Episode'
  };
  return types[type] || type;
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const isValidImdbId = (id) => {
  return /^tt\d{7,8}$/.test(id);
};

export const parseSearchResults = (data) => {
  if (!data || !data.Search) {
    return [];
  }
  return data.Search.map((item) => ({
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