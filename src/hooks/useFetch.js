import { useState, useEffect, useCallback } from 'react';
import { cacheService, generateCacheKey } from '../services';

export const FETCH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

export const FETCH_MESSAGES = {
  IDLE: 'Waiting',
  LOADING: 'Loading...',
  SUCCESS: 'Success',
  ERROR: 'Error fetching data'
};

export const useFetch = (fetchFunction, params = {}, options = {}) => {
  const { 
    immediate = true, 
    useCache = true,
    cacheKey = null 
  } = options;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(FETCH_STATUS.IDLE);

  const isIdle = status === FETCH_STATUS.IDLE;
  const isLoading = status === FETCH_STATUS.LOADING;
  const isSuccess = status === FETCH_STATUS.SUCCESS;
  const isError = status === FETCH_STATUS.ERROR;

  const execute = useCallback(async (overrideParams = null) => {
    const finalParams = overrideParams || params;
    const key = cacheKey || generateCacheKey(fetchFunction.name, finalParams);

    if (useCache) {
      const cached = cacheService.get(key);
      if (cached) {
        setData(cached);
        setStatus(FETCH_STATUS.SUCCESS);
        setError(null);
        return { success: true, data: cached };
      }
    }

    setStatus(FETCH_STATUS.LOADING);
    setError(null);

    try {
      const response = await fetchFunction(finalParams);
      
      if (response.success) {
        setData(response.data);
        setStatus(FETCH_STATUS.SUCCESS);
        
        if (useCache) {
          cacheService.set(key, response.data);
        }
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || FETCH_MESSAGES.ERROR);
      }
    } catch (err) {
      const errorMessage = err.message || FETCH_MESSAGES.ERROR;
      setError(errorMessage);
      setStatus(FETCH_STATUS.ERROR);
      setData(null);
      return { success: false, error: errorMessage };
    }
  }, [fetchFunction, params, useCache, cacheKey]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setStatus(FETCH_STATUS.IDLE);
  }, []);

  useEffect(() => {
    if (immediate && fetchFunction) {
      execute();
    }
  }, []);

  return {
    data,
    error,
    status,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    execute,
    reset
  };
};