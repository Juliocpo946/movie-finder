import { useState, useCallback, useRef } from 'react';
import { omdbApi } from '../api';
import { useDebounce } from './useDebounce';
import { parseSearchResults } from '../utils';

export const SEARCH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  NO_RESULTS: 'no_results'
};

export const useSearch = (options = {}) => {
  const { debounceDelay = 400 } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState(SEARCH_STATUS.IDLE);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalResults: 0
  });
  
  const abortControllerRef = useRef(null);
  const debouncedQuery = useDebounce(query, debounceDelay);

  const search = useCallback(async (searchTerm, searchOptions = {}) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setResults([]);
      setStatus(SEARCH_STATUS.IDLE);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setStatus(SEARCH_STATUS.LOADING);
    setError(null);

    const { page = 1, type = '', year = '' } = searchOptions;

    const response = await omdbApi.searchWithPagination(searchTerm.trim(), {
      page,
      type,
      year
    });

    if (!response.success) {
      if (response.message === 'Movie not found' || response.message === 'Too many results - Please refine your search') {
        setResults([]);
        setStatus(SEARCH_STATUS.NO_RESULTS);
        setError(response.message);
      } else {
        setError(response.message);
        setStatus(SEARCH_STATUS.ERROR);
      }
      return;
    }

    const { items, totalResults, totalPages, currentPage } = response.data;

    if (!items || items.length === 0) {
      setResults([]);
      setStatus(SEARCH_STATUS.NO_RESULTS);
      return;
    }

    const parsedResults = parseSearchResults({ Search: items });
    setResults(parsedResults);
    setPagination({ currentPage, totalPages, totalResults });
    setStatus(SEARCH_STATUS.SUCCESS);
  }, []);

  const loadMore = useCallback(async (searchTerm, searchOptions = {}) => {
    if (pagination.currentPage >= pagination.totalPages) {
      return;
    }

    const nextPage = pagination.currentPage + 1;
    const response = await omdbApi.searchWithPagination(searchTerm.trim(), {
      ...searchOptions,
      page: nextPage
    });

    if (response.success && response.data.items) {
      const parsedResults = parseSearchResults({ Search: response.data.items });
      
      // MODIFICADO: Filtrar duplicados antes de añadir al estado
      setResults((prev) => {
        const existingIds = new Set(prev.map(item => item.imdbID));
        const newItems = parsedResults.filter(item => !existingIds.has(item.imdbID));
        
        return [...prev, ...newItems];
      });

      setPagination((prev) => ({
        ...prev,
        currentPage: nextPage
      }));
    }
  }, [pagination]);

  const reset = useCallback(() => {
    setQuery('');
    setResults([]);
    setStatus(SEARCH_STATUS.IDLE);
    setError(null);
    setPagination({ currentPage: 1, totalPages: 0, totalResults: 0 });
  }, []);

  return {
    query,
    setQuery,
    debouncedQuery,
    results,
    status,
    error,
    pagination,
    search,
    loadMore,
    reset
  };
};