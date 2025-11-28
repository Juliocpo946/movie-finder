const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

export const storageService = {
  set(key, value) {
    if (!isStorageAvailable()) {
      return { success: false, message: 'Storage unavailable' };
    }

    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return { success: true };
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        return { success: false, message: 'Storage quota exceeded' };
      }
      return { success: false, message: 'Storage error' };
    }
  },

  get(key, defaultValue = null) {
    if (!isStorageAvailable()) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch {
      return defaultValue;
    }
  },

  remove(key) {
    if (!isStorageAvailable()) {
      return { success: false };
    }

    try {
      localStorage.removeItem(key);
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  clear() {
    if (!isStorageAvailable()) {
      return { success: false };
    }

    try {
      localStorage.clear();
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  exists(key) {
    if (!isStorageAvailable()) {
      return false;
    }
    return localStorage.getItem(key) !== null;
  }
};