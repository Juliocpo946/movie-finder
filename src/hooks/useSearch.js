import { useState, useCallback } from 'react';
import { omdbApi } from '../api/endpoints';
import { useDebounce } from './useDebounce';
import { parseOmdbSearch } from '../utils';

const SEARCH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  NO_RESULTS: 'no_results'
};

const useSearch = (options = {}) => {
  const { debounceDelay = 500 } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState(SEARCH_STATUS.IDLE);
  const [error, setError] = useState(null);
  
  const debouncedQuery = useDebounce(query, debounceDelay);

  const search = useCallback(async (searchTerm, filterGenre = null) => {
    // Si no hay término, no buscamos
    if (!searchTerm) return;

    setStatus(SEARCH_STATUS.LOADING);
    setError(null);

    try {
      // TRUCO OMDb: Si hay género, lo agregamos al texto de búsqueda
      // Ejemplo: Busca "Batman Action" para priorizar resultados de acción
      const finalQuery = filterGenre ? `${searchTerm} ${filterGenre}` : searchTerm;

      const response = await omdbApi.search(finalQuery);

      if (response.success && response.data && response.data.Search) {
        const searchResults = parseOmdbSearch(response.data);
        setResults(searchResults);
        setStatus(SEARCH_STATUS.SUCCESS);
      } else {
        // Si OMDb dice "False" o no hay array de búsqueda
        setResults([]);
        setStatus(SEARCH_STATUS.NO_RESULTS);
      }
    } catch (err) {
      console.error("Search Error:", err);
      setError(err.message || 'Error de conexión');
      setStatus(SEARCH_STATUS.ERROR);
    }
  }, []);

  const reset = useCallback(() => {
    setQuery('');
    setResults([]);
    setStatus(SEARCH_STATUS.IDLE);
  }, []);

  return {
    query,
    setQuery,
    debouncedQuery,
    results,
    status,
    error,
    search,
    reset
  };
};

export { useSearch, SEARCH_STATUS };