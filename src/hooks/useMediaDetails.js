import { useState, useCallback } from 'react';
import { tmdbClient } from '../api/tmdb';
import { normalizeTmdbMovie } from '../utils';

export const DETAILS_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

export const useMediaDetails = () => {
  const [details, setDetails] = useState(null);
  const [status, setStatus] = useState(DETAILS_STATUS.IDLE);

  const fetchById = useCallback(async (id) => {
    setStatus(DETAILS_STATUS.LOADING);
    
    // Intentamos buscar primero como película
    let response = await tmdbClient.getDetails(id, 'movie');
    let type = 'movie';

    // Si falla, intentamos como serie (TV)
    if (!response.success) {
      response = await tmdbClient.getDetails(id, 'tv');
      type = 'tv';
    }

    if (response.success) {
      setDetails(normalizeTmdbMovie(response.data, type));
      setStatus(DETAILS_STATUS.SUCCESS);
    } else {
      setStatus(DETAILS_STATUS.ERROR);
    }
  }, []);

  return { details, status, fetchById };
};