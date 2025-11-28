import { CACHE_DURATION } from '../utils/constants';

const cache = new Map();

const isExpired = (timestamp) => {
  return Date.now() - timestamp > CACHE_DURATION;
};

export const cacheService = {
  get(key) {
    const cached = cache.get(key);

    if (!cached) {
      return null;
    }

    if (isExpired(cached.timestamp)) {
      cache.delete(key);
      return null;
    }

    return cached.data;
  },

  set(key, data) {
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
    if (!cached) {
      return false;
    }
    
    if (isExpired(cached.timestamp)) {
      cache.delete(key);
      return false;
    }
    
    return true;
  },

  getSize() {
    return cache.size;
  },

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
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  return `${endpoint}?${sortedParams}`;
};