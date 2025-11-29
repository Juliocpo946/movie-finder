import { RATING_COLORS, PLACEHOLDER_IMAGE, TMDB_GENRES } from './constants';

const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_URL || 'https://image.tmdb.org/t/p/w500';

export const normalizeTmdbMovie = (item, type = 'movie') => {
  if (!item) return null;
  
  const isTv = type === 'tv' || item.media_type === 'tv' || !!item.first_air_date;
  const title = item.title || item.name || item.original_title || 'Untitled';
  const date = item.release_date || item.first_air_date || 'N/A';
  const year = date !== 'N/A' ? date.split('-')[0] : 'N/A';
  
  return {
    imdbID: item.id.toString(), // TMDB usa IDs numéricos, los convertimos a string
    Title: title,
    Year: year,
    Type: isTv ? 'series' : 'movie',
    Poster: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : PLACEHOLDER_IMAGE,
    Backdrop: item.backdrop_path ? `${IMAGE_BASE_URL}${item.backdrop_path}` : null,
    Plot: item.overview || 'No synopsis available.',
    imdbRating: item.vote_average ? item.vote_average.toFixed(1) : 'N/A',
    Genre: item.genres ? item.genres.map(g => g.name).join(', ') : resolveGenreIds(item.genre_ids),
    Director: getCrewMember(item.credits, 'Director'),
    Actors: getCastMembers(item.credits),
    Runtime: item.runtime ? `${item.runtime} min` : (item.episode_run_time?.[0] ? `${item.episode_run_time[0]} min` : 'N/A'),
    Videos: item.videos?.results || []
  };
};

const resolveGenreIds = (ids) => {
  if (!ids) return '';
  return ids.map(id => TMDB_GENRES.find(g => g.id === id)?.name).filter(Boolean).join(', ');
};

const getCrewMember = (credits, job) => {
  if (!credits?.crew) return 'N/A';
  return credits.crew.find(person => person.job === job)?.name || 'N/A';
};

const getCastMembers = (credits) => {
  if (!credits?.cast) return 'N/A';
  return credits.cast.slice(0, 4).map(p => p.name).join(', ');
};

export const getPosterUrl = (poster) => poster;

export const getRatingColor = (rating) => {
  const num = parseFloat(rating);
  if (num >= 7) return RATING_COLORS.HIGH;
  if (num >= 5) return RATING_COLORS.MEDIUM;
  return RATING_COLORS.LOW;
};

export const classNames = (...classes) => classes.filter(Boolean).join(' ');