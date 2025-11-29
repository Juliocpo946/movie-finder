import { useState, useCallback, useRef } from 'react';
import { tmdbClient } from '../api/tmdb';
import { normalizeTmdbMovie } from '../utils';

export const SEARCH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  NO_RESULTS: 'no_results'
};

export const useSearch = (options = {}) => {
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState(SEARCH_STATUS.IDLE);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });
  
  // useRef mantiene la referencia entre renderizados sin causar re-render
  // Lo usamos para guardar el controlador de la petición actual
  const abortRef = useRef(null);

  const performSearch = useCallback(async (query, params, isLoadMore = false) => {
    // Validación básica: no buscar si no hay query ni filtros
    if (!query && !params.with_genres && !params.year) return;

    if (!isLoadMore) {
      // PATRÓN DE CANCELACIÓN (Debouncing/Cleanup):
      // Si existe una petición en curso (abortRef.current), la cancelamos.
      // Esto evita "Race Conditions" donde una petición antigua sobrescribe a la nueva.
      if (abortRef.current) {
        abortRef.current.abort();
      }
      // Creamos un nuevo controlador para la petición actual
      abortRef.current = new AbortController();
      setStatus(SEARCH_STATUS.LOADING);
    }

    try {
      let response;
      // Selección de estrategia: 'discover' para filtros avanzados, 'search' para texto
      if (!query && (params.year || params.with_genres || params.sort_by)) {
        response = await tmdbClient.discover(params);
      } else {
        response = await tmdbClient.search(query, params);
      }

      if (response.success) {
        const normalized = response.data.results.map(item => normalizeTmdbMovie(item, params.type));
        
        if (isLoadMore) {
          // Si es paginación, concatenamos evitando duplicados por ID
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
      // Ignoramos errores causados por nuestra propia cancelación
      if (err.name === 'AbortError') return;
      
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