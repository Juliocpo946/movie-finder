import { useState, useCallback, useRef } from 'react';
import { tmdbClient } from '../api/tmdb';
import { useDebounce } from './useDebounce';
import { normalizeTmdbMovie } from '../utils';

export const SEARCH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  NO_RESULTS: 'no_results'
};

export const useSearch = (options = {}) => {
  const { debounceDelay = 500 } = options;
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState(SEARCH_STATUS.IDLE);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });
  const abortRef = useRef(null);

  const performSearch = useCallback(async (query, params, isLoadMore = false) => {
    if (!query && !params.with_genres && !params.year) return;

    if (!isLoadMore) {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      setStatus(SEARCH_STATUS.LOADING);
    }

    try {
      let response;
      // Si hay filtros complejos usamos 'discover', si es solo texto usamos 'search'
      if (!query && (params.year || params.with_genres || params.sort_by)) {
        response = await tmdbClient.discover(params);
      } else {
        response = await tmdbClient.search(query, params);
      }

      if (response.success) {
        const normalized = response.data.results.map(item => normalizeTmdbMovie(item, params.type));
        
        if (isLoadMore) {
          setResults(prev => {
            const ids = new Set(prev.map(i => i.imdbID));
            return [...prev, ...normalized.filter(i => !ids.has(i.imdbID))];
          });
        } else {
          setResults(normalized);
          setStatus(normalized.length > 0 ? SEARCH_STATUS.SUCCESS : SEARCH_STATUS.NO_RESULTS);
        }
        
        setPagination({
          page: response.data.page,
          totalPages: response.data.total_pages
        });
      } else {
        setError(response.message);
        setStatus(SEARCH_STATUS.ERROR);
      }
    } catch (err) {
      setError(err.message);
      setStatus(SEARCH_STATUS.ERROR);
    }
  }, []);

  const search = useCallback((query, params = {}) => performSearch(query, { page: 1, ...params }), [performSearch]);
  
  const loadMore = useCallback((query, params = {}) => {
    if (pagination.page < pagination.totalPages) {
      performSearch(query, { ...params, page: pagination.page + 1 }, true);
    }
  }, [pagination, performSearch]);

  return { results, status, error, pagination, search, loadMore };
};