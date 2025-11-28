import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    const item = storageService.get(key);
    return item !== null ? item : initialValue;
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const result = storageService.set(key, storedValue);
    if (!result.success) {
      setError(result.message);
    } else {
      setError(null);
    }
  }, [key, storedValue]);

  const setValue = useCallback((value) => {
    setStoredValue((prev) => {
      const newValue = value instanceof Function ? value(prev) : value;
      return newValue;
    });
  }, []);

  const removeValue = useCallback(() => {
    storageService.remove(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue, error];
};

export { useLocalStorage };