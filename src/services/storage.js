const STORAGE_MESSAGES = {
  SAVE_SUCCESS: 'Datos guardados correctamente',
  SAVE_ERROR: 'Error al guardar los datos',
  GET_ERROR: 'Error al obtener los datos',
  REMOVE_SUCCESS: 'Datos eliminados correctamente',
  REMOVE_ERROR: 'Error al eliminar los datos',
  CLEAR_SUCCESS: 'Almacenamiento limpiado correctamente',
  CLEAR_ERROR: 'Error al limpiar el almacenamiento',
  STORAGE_UNAVAILABLE: 'Almacenamiento local no disponible',
  QUOTA_EXCEEDED: 'Espacio de almacenamiento agotado'
};

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
      return {
        success: false,
        message: STORAGE_MESSAGES.STORAGE_UNAVAILABLE
      };
    }

    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return {
        success: true,
        message: STORAGE_MESSAGES.SAVE_SUCCESS
      };
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        return {
          success: false,
          message: STORAGE_MESSAGES.QUOTA_EXCEEDED
        };
      }
      return {
        success: false,
        message: STORAGE_MESSAGES.SAVE_ERROR
      };
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
      return {
        success: false,
        message: STORAGE_MESSAGES.STORAGE_UNAVAILABLE
      };
    }

    try {
      localStorage.removeItem(key);
      return {
        success: true,
        message: STORAGE_MESSAGES.REMOVE_SUCCESS
      };
    } catch {
      return {
        success: false,
        message: STORAGE_MESSAGES.REMOVE_ERROR
      };
    }
  },

  clear() {
    if (!isStorageAvailable()) {
      return {
        success: false,
        message: STORAGE_MESSAGES.STORAGE_UNAVAILABLE
      };
    }

    try {
      localStorage.clear();
      return {
        success: true,
        message: STORAGE_MESSAGES.CLEAR_SUCCESS
      };
    } catch {
      return {
        success: false,
        message: STORAGE_MESSAGES.CLEAR_ERROR
      };
    }
  },

  exists(key) {
    if (!isStorageAvailable()) {
      return false;
    }
    return localStorage.getItem(key) !== null;
  },

  getKeys() {
    if (!isStorageAvailable()) {
      return [];
    }
    return Object.keys(localStorage);
  },

  getSize() {
    if (!isStorageAvailable()) {
      return 0;
    }

    let totalSize = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }
    return totalSize;
  }
};

export { STORAGE_MESSAGES };