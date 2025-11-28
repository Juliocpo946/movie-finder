import { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services';
import { STORAGE_KEYS, THEMES } from '../utils';

const ThemeContext = createContext(null);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const stored = storageService.get(STORAGE_KEYS.THEME);
    if (stored) {
      return stored;
    }
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? THEMES.DARK : THEMES.LIGHT;
  });

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === THEMES.DARK) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    
    storageService.set(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK));
  };

  const setDarkTheme = () => setTheme(THEMES.DARK);
  
  const setLightTheme = () => setTheme(THEMES.LIGHT);

  const isDark = theme === THEMES.DARK;
  
  const isLight = theme === THEMES.LIGHT;

  const value = {
    theme,
    isDark,
    isLight,
    toggleTheme,
    setDarkTheme,
    setLightTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  return context;
};

export { ThemeProvider, useTheme, ThemeContext };