import { CACHE_DURATION } from '../utils/constants';

// Usamos un Map para almacenamiento en memoria (RAM) rápido.
// Esto evita llamadas repetitivas a la API para datos que ya tenemos.
const cache = new Map();

/**
 * Verifica si un timestamp ha superado la duración permitida.
 * @param {number} timestamp - Fecha en ms de cuando se guardó el dato.
 * @returns {boolean} - True si el dato ya expiró.
 */
const isExpired = (timestamp) => {
  return Date.now() - timestamp > CACHE_DURATION;
};

export const cacheService = {
  get(key) {
    const cached = cache.get(key);

    // Si no existe, retornamos null inmediatamente
    if (!cached) {
      return null;
    }

    // Si existe pero ya expiró, lo borramos para forzar una nueva petición
    if (isExpired(cached.timestamp)) {
      cache.delete(key);
      return null;
    }

    return cached.data;
  },

  set(key, data) {
    // Guardamos el dato junto con el timestamp actual para validar caducidad futura
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
  },

  remove(key) {
    cache.delete(key);
  },

  clear() {
    cache.clear();
  },

  has(key) {
    const cached = cache.get(key);
    if (!cached) return false;
    
    if (isExpired(cached.timestamp)) {
      cache.delete(key);
      return false;
    }
    
    return true;
  },

  getSize() {
    return cache.size;
  },

  // Método de utilidad para limpiar proactivamente entradas viejas
  cleanup() {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        cache.delete(key);
      }
    }
  }
};

export const generateCacheKey = (endpoint, params = {}) => {
  // Crea una llave única ordenando los parámetros alfabéticamente
  // Ej: "search?page=1&query=batman" será igual a "search?query=batman&page=1"
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  return `${endpoint}?${sortedParams}`;
};