import { useState, useCallback, useEffect } from 'react';
import { tmdbClient } from '../api/tmdb';
import { normalizeTmdbMovie } from '../utils';

export const useTrending = () => {
  const [trending, setTrending] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrending = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await tmdbClient.getTrending('all', 'week');
      if (response.success) {
        const items = response.data.results.map(item => normalizeTmdbMovie(item));
        setTrending(items);
        
        // Obtener detalles completos para el featured (para tener trailer y backdrop)
        if (items.length > 0) {
          const featured = items[0];
          const details = await tmdbClient.getDetails(featured.imdbID, featured.Type === 'series' ? 'tv' : 'movie');
          if (details.success) {
            setFeaturedMovie(normalizeTmdbMovie(details.data, featured.Type === 'series' ? 'tv' : 'movie'));
          } else {
            setFeaturedMovie(featured);
          }
        }
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  return { trending, featuredMovie, isLoading, error };
};