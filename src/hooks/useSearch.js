import { useState, useCallback } from 'react';
import { omdbApi } from '../api';
import { useDebounce } from './useDebounce';
import { parseOmdbSearch, getTotalResults, getTotalPages, sortResults } from '../utils';

const SEARCH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  NO_RESULTS: 'no_results'
};

const SEARCH_MESSAGES = {
  IDLE: 'Ingresa un termino de busqueda',
  LOADING: 'Buscando...',
  SUCCESS: 'Resultados encontrados',
  ERROR: 'Error en la busqueda',
  NO_RESULTS: 'No se encontraron resultados',
  MIN_LENGTH: 'Ingresa al menos 3 caracteres'
};

const useSearch = (options = {}) => {
  const { 
    minLength = 3,
    debounceDelay = 500 
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState(SEARCH_STATUS.IDLE);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: null,
    year: null,
    sortBy: null
  });

  const debouncedQuery = useDebounce(query, debounceDelay);

  const isIdle = status === SEARCH_STATUS.IDLE;
  const isLoading = status === SEARCH_STATUS.LOADING;
  const isSuccess = status === SEARCH_STATUS.SUCCESS;
  const isError = status === SEARCH_STATUS.ERROR;
  const hasNoResults = status === SEARCH_STATUS.NO_RESULTS;

  const search = useCallback(async (searchQuery, page = 1, searchFilters = {}) => {
    const finalQuery = searchQuery || debouncedQuery;
    const finalFilters = { ...filters, ...searchFilters };

    if (!finalQuery || finalQuery.length < minLength) {
      setStatus(SEARCH_STATUS.IDLE);
      setResults([]);
      setTotalResults(0);
      setTotalPages(0);
      return { success: false, message: SEARCH_MESSAGES.MIN_LENGTH };
    }

    setStatus(SEARCH_STATUS.LOADING);
    setError(null);

    try {
      let response;
      
      if (finalFilters.type && finalFilters.year) {
        response = finalFilters.type === 'movie' 
          ? await omdbApi.searchMoviesByYear(finalQuery, finalFilters.year, page)
          : await omdbApi.searchSeriesByYear(finalQuery, finalFilters.year, page);
      } else if (finalFilters.type) {
        response = finalFilters.type === 'movie'
          ? await omdbApi.searchMovies(finalQuery, page)
          : await omdbApi.searchSeries(finalQuery, page);
      } else if (finalFilters.year) {
        response = await omdbApi.searchByYear(finalQuery, finalFilters.year, page);
      } else {
        response = await omdbApi.search(finalQuery, page);
      }

      if (response.success && response.data) {
        let searchResults = parseOmdbSearch(response.data);
        const total = getTotalResults(response.data);
        const pages = getTotalPages(response.data);

        if (searchResults.length === 0) {
          setStatus(SEARCH_STATUS.NO_RESULTS);
          setResults([]);
          setTotalResults(0);
          setTotalPages(0);
          return { success: true, message: SEARCH_MESSAGES.NO_RESULTS, data: [] };
        }

        if (finalFilters.sortBy) {
          searchResults = sortResults(searchResults, finalFilters.sortBy);
        }

        setResults(searchResults);
        setTotalResults(total);
        setTotalPages(pages);
        setCurrentPage(page);
        setStatus(SEARCH_STATUS.SUCCESS);

        return { success: true, message: SEARCH_MESSAGES.SUCCESS, data: searchResults };
      }

      throw new Error(SEARCH_MESSAGES.ERROR);
    } catch (err) {
      const errorMessage = err.message || SEARCH_MESSAGES.ERROR;
      setError(errorMessage);
      setStatus(SEARCH_STATUS.ERROR);
      setResults([]);
      setTotalResults(0);
      setTotalPages(0);
      return { success: false, message: errorMessage };
    }
  }, [debouncedQuery, filters, minLength]);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      search(query, page, filters);
    }
  }, [query, totalPages, filters, search]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ type: null, year: null, sortBy: null });
  }, []);

  const reset = useCallback(() => {
    setQuery('');
    setResults([]);
    setTotalResults(0);
    setTotalPages(0);
    setCurrentPage(1);
    setStatus(SEARCH_STATUS.IDLE);
    setError(null);
    setFilters({ type: null, year: null, sortBy: null });
  }, []);

  return {
    query,
    setQuery,
    debouncedQuery,
    results,
    totalResults,
    totalPages,
    currentPage,
    status,
    error,
    filters,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    hasNoResults,
    search,
    goToPage,
    nextPage,
    prevPage,
    updateFilters,
    clearFilters,
    reset
  };
};

export { useSearch, SEARCH_STATUS, SEARCH_MESSAGES };