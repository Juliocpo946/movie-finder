import { useState, useCallback, useEffect } from 'react';
import { omdbApi } from '../api';
import { parseSearchResults } from '../utils';

const TRENDING_QUERIES = [
  'Avengers', 'Batman', 'Star Wars', 'Harry Potter',
  'Spider-Man', 'Joker', 'Inception', 'Interstellar',
  'The Dark Knight', 'Matrix'
];

export const useTrending = () => {
  const [trending, setTrending] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrending = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const randomQuery = TRENDING_QUERIES[Math.floor(Math.random() * TRENDING_QUERIES.length)];
      const searchResponse = await omdbApi.search(randomQuery, { type: 'movie' });

      if (!searchResponse.success || !searchResponse.data?.Search) {
        setError(searchResponse.message || "Failed to fetch trending");
        setTrending([]);
      } else {
        const results = parseSearchResults(searchResponse.data);
        setTrending(results);

        if (results.length > 0) {
          const featuredId = results[0].imdbID;
          const detailsResponse = await omdbApi.getById(featuredId);
          if (detailsResponse.success) {
            setFeaturedMovie(detailsResponse.data);
          }
        }
      }
    } catch (err) {
      console.error("Trending Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchByQuery = useCallback(async (query, type = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const searchResponse = await omdbApi.search(query, { type });
      if (!searchResponse.success || !searchResponse.data?.Search) {
        setTrending([]);
      } else {
        const results = parseSearchResults(searchResponse.data);
        setTrending(results);
      }
    } catch (err) {
      setTrending([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  return {
    trending,
    featuredMovie,
    isLoading,
    error,
    refetch: fetchTrending,
    fetchByQuery
  };
};