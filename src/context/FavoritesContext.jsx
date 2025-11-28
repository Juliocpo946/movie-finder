import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services';
import { STORAGE_KEYS } from '../utils';

const FavoritesContext = createContext(null);

const FAVORITES_MESSAGES = {
  ADDED: 'Agregado a favoritos',
  REMOVED: 'Eliminado de favoritos',
  ALREADY_EXISTS: 'Ya existe en favoritos',
  NOT_FOUND: 'No encontrado en favoritos',
  CLEARED: 'Favoritos limpiados',
  ERROR_ADDING: 'Error al agregar a favoritos',
  ERROR_REMOVING: 'Error al eliminar de favoritos'
};

const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    return storageService.get(STORAGE_KEYS.FAVORITES, []);
  });

  useEffect(() => {
    storageService.set(STORAGE_KEYS.FAVORITES, favorites);
  }, [favorites]);

  const isFavorite = useCallback((imdbID) => {
    return favorites.some((item) => item.imdbID === imdbID);
  }, [favorites]);

  const addFavorite = useCallback((item) => {
    if (!item || !item.imdbID) {
      return { success: false, message: FAVORITES_MESSAGES.ERROR_ADDING };
    }

    if (isFavorite(item.imdbID)) {
      return { success: false, message: FAVORITES_MESSAGES.ALREADY_EXISTS };
    }

    const favoriteItem = {
      imdbID: item.imdbID,
      Title: item.Title,
      Year: item.Year,
      Type: item.Type,
      Poster: item.Poster,
      addedAt: new Date().toISOString()
    };

    setFavorites((prev) => [...prev, favoriteItem]);
    return { success: true, message: FAVORITES_MESSAGES.ADDED };
  }, [isFavorite]);

  const removeFavorite = useCallback((imdbID) => {
    if (!imdbID) {
      return { success: false, message: FAVORITES_MESSAGES.ERROR_REMOVING };
    }

    if (!isFavorite(imdbID)) {
      return { success: false, message: FAVORITES_MESSAGES.NOT_FOUND };
    }

    setFavorites((prev) => prev.filter((item) => item.imdbID !== imdbID));
    return { success: true, message: FAVORITES_MESSAGES.REMOVED };
  }, [isFavorite]);

  const toggleFavorite = useCallback((item) => {
    if (isFavorite(item.imdbID)) {
      return removeFavorite(item.imdbID);
    }
    return addFavorite(item);
  }, [isFavorite, addFavorite, removeFavorite]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    return { success: true, message: FAVORITES_MESSAGES.CLEARED };
  }, []);

  const getFavoritesByType = useCallback((type) => {
    if (!type) return favorites;
    return favorites.filter((item) => item.Type === type);
  }, [favorites]);

  const getFavoritesCount = useCallback(() => {
    return favorites.length;
  }, [favorites]);

  const getMoviesCount = useCallback(() => {
    return favorites.filter((item) => item.Type === 'movie').length;
  }, [favorites]);

  const getSeriesCount = useCallback(() => {
    return favorites.filter((item) => item.Type === 'series').length;
  }, [favorites]);

  const value = {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    getFavoritesByType,
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
    throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  }
  
  return context;
};

export { FavoritesProvider, useFavorites, FavoritesContext, FAVORITES_MESSAGES };