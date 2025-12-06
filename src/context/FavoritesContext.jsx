import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services';
import { STORAGE_KEYS } from '../utils';

const FavoritesContext = createContext(null);

const FavoritesProvider = ({ children }) => {
  // Initialization from Storage
  const [favorites, setFavorites] = useState(() => {
    return storageService.get(STORAGE_KEYS.FAVORITES, []);
  });

  // Persist changes to Storage whenever 'favorites' state changes
  useEffect(() => {
    storageService.set(STORAGE_KEYS.FAVORITES, favorites);
  }, [favorites]);

  // SYNC FIX: Listen for changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only react if the specific key changed
      if (e.key === STORAGE_KEYS.FAVORITES) {
        // Parse the new value or default to empty array
        const newFavorites = e.newValue ? JSON.parse(e.newValue) : [];
        setFavorites(newFavorites);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isFavorite = useCallback((imdbID) => {
    return favorites.some((item) => item.imdbID === imdbID);
  }, [favorites]);

  const addFavorite = useCallback((item) => {
    if (!item || !item.imdbID) return { success: false };
    if (isFavorite(item.imdbID)) return { success: false };

    const favoriteItem = {
      imdbID: item.imdbID,
      Title: item.Title,
      Year: item.Year,
      Type: item.Type,
      Poster: item.Poster,
      addedAt: new Date().toISOString()
    };

    setFavorites((prev) => [...prev, favoriteItem]);
    return { success: true };
  }, [isFavorite]);

  const removeFavorite = useCallback((imdbID) => {
    if (!imdbID) return { success: false };
    setFavorites((prev) => prev.filter((item) => item.imdbID !== imdbID));
    return { success: true };
  }, []);

  const toggleFavorite = useCallback((item) => {
    if (isFavorite(item.imdbID)) {
      return removeFavorite(item.imdbID);
    }
    return addFavorite(item);
  }, [isFavorite, addFavorite, removeFavorite]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    return { success: true };
  }, []);

  const getMoviesCount = useCallback(() => {
    return favorites.filter((item) => item.Type === 'movie').length;
  }, [favorites]);

  const getSeriesCount = useCallback(() => {
    return favorites.filter((item) => item.Type === 'series' || item.Type === 'tv').length;
  }, [favorites]);

  const getFavoritesCount = useCallback(() => {
    return favorites.length;
  }, [favorites]);

  const value = {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    getFavoritesCount,
    getMoviesCount,
    getSeriesCount
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};

export { FavoritesProvider, useFavorites, FavoritesContext };