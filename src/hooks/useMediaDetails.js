import { useState, useCallback } from 'react';
import { omdbApi } from '../api';
import { cacheService, generateCacheKey } from '../services';

const DETAILS_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

const DETAILS_MESSAGES = {
  IDLE: 'Esperando solicitud',
  LOADING: 'Cargando detalles...',
  SUCCESS: 'Detalles obtenidos',
  ERROR: 'Error al obtener detalles',
  NOT_FOUND: 'No se encontro el contenido'
};

const useMediaDetails = (options = {}) => {
  const { useCache = true } = options;

  const [details, setDetails] = useState(null);
  const [status, setStatus] = useState(DETAILS_STATUS.IDLE);
  const [error, setError] = useState(null);

  const isIdle = status === DETAILS_STATUS.IDLE;
  const isLoading = status === DETAILS_STATUS.LOADING;
  const isSuccess = status === DETAILS_STATUS.SUCCESS;
  const isError = status === DETAILS_STATUS.ERROR;

  const fetchById = useCallback(async (imdbId) => {
    if (!imdbId) {
      setError(DETAILS_MESSAGES.NOT_FOUND);
      setStatus(DETAILS_STATUS.ERROR);
      return { success: false, message: DETAILS_MESSAGES.NOT_FOUND };
    }

    const cacheKey = generateCacheKey('details', { id: imdbId });

    if (useCache) {
      const cached = cacheService.get(cacheKey);
      if (cached) {
        setDetails(cached);
        setStatus(DETAILS_STATUS.SUCCESS);
        setError(null);
        return { success: true, data: cached };
      }
    }

    setStatus(DETAILS_STATUS.LOADING);
    setError(null);

    try {
      const response = await omdbApi.getById(imdbId);

      if (response.success && response.data) {
        setDetails(response.data);
        setStatus(DETAILS_STATUS.SUCCESS);

        if (useCache) {
          cacheService.set(cacheKey, response.data);
        }

        return { success: true, data: response.data };
      }

      throw new Error(DETAILS_MESSAGES.NOT_FOUND);
    } catch (err) {
      const errorMessage = err.message || DETAILS_MESSAGES.ERROR;
      setError(errorMessage);
      setStatus(DETAILS_STATUS.ERROR);
      setDetails(null);
      return { success: false, message: errorMessage };
    }
  }, [useCache]);

  const fetchByTitle = useCallback(async (title, year = null, type = null) => {
    if (!title) {
      setError(DETAILS_MESSAGES.NOT_FOUND);
      setStatus(DETAILS_STATUS.ERROR);
      return { success: false, message: DETAILS_MESSAGES.NOT_FOUND };
    }

    const cacheKey = generateCacheKey('details', { title, year, type });

    if (useCache) {
      const cached = cacheService.get(cacheKey);
      if (cached) {
        setDetails(cached);
        setStatus(DETAILS_STATUS.SUCCESS);
        setError(null);
        return { success: true, data: cached };
      }
    }

    setStatus(DETAILS_STATUS.LOADING);
    setError(null);

    try {
      const response = await omdbApi.getByTitle(title, year, type);

      if (response.success && response.data) {
        setDetails(response.data);
        setStatus(DETAILS_STATUS.SUCCESS);

        if (useCache) {
          cacheService.set(cacheKey, response.data);
        }

        return { success: true, data: response.data };
      }

      throw new Error(DETAILS_MESSAGES.NOT_FOUND);
    } catch (err) {
      const errorMessage = err.message || DETAILS_MESSAGES.ERROR;
      setError(errorMessage);
      setStatus(DETAILS_STATUS.ERROR);
      setDetails(null);
      return { success: false, message: errorMessage };
    }
  }, [useCache]);

  const reset = useCallback(() => {
    setDetails(null);
    setStatus(DETAILS_STATUS.IDLE);
    setError(null);
  }, []);

  return {
    details,
    status,
    error,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    fetchById,
    fetchByTitle,
    reset
  };
};

export { useMediaDetails, DETAILS_STATUS, DETAILS_MESSAGES };