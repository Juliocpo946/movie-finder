import { useState, useCallback } from 'react';
import { omdbApi } from '../api';
import { cacheService, generateCacheKey } from '../services';

export const DETAILS_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

export const useMediaDetails = (options = {}) => {
  const { useCache = true } = options;

  const [details, setDetails] = useState(null);
  const [status, setStatus] = useState(DETAILS_STATUS.IDLE);
  const [error, setError] = useState(null);

  const fetchById = useCallback(async (imdbId) => {
    if (!imdbId) {
      setError('Invalid ID');
      setStatus(DETAILS_STATUS.ERROR);
      return { success: false, message: 'Invalid ID' };
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

    const response = await omdbApi.getById(imdbId);

    if (!response.success) {
      setError(response.message);
      setStatus(DETAILS_STATUS.ERROR);
      setDetails(null);
      return { success: false, message: response.message };
    }

    setDetails(response.data);
    setStatus(DETAILS_STATUS.SUCCESS);

    if (useCache) {
      cacheService.set(cacheKey, response.data);
    }

    return { success: true, data: response.data };
  }, [useCache]);

  const fetchByTitle = useCallback(async (title, searchOptions = {}) => {
    if (!title) {
      setError('Invalid title');
      setStatus(DETAILS_STATUS.ERROR);
      return { success: false, message: 'Invalid title' };
    }

    const cacheKey = generateCacheKey('details_title', { title, ...searchOptions });

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

    const response = await omdbApi.getByTitle(title, searchOptions);

    if (!response.success) {
      setError(response.message);
      setStatus(DETAILS_STATUS.ERROR);
      setDetails(null);
      return { success: false, message: response.message };
    }

    setDetails(response.data);
    setStatus(DETAILS_STATUS.SUCCESS);

    if (useCache) {
      cacheService.set(cacheKey, response.data);
    }

    return { success: true, data: response.data };
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
    isLoading: status === DETAILS_STATUS.LOADING,
    isSuccess: status === DETAILS_STATUS.SUCCESS,
    isError: status === DETAILS_STATUS.ERROR,
    fetchById,
    fetchByTitle,
    reset
  };
};