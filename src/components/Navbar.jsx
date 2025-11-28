import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { toggleTheme, isDark } = useTheme();
  const { getFavoritesCount } = useFavorites();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const favCount = getFavoritesCount();

  const links = [
    { path: '/', label: 'SEARCH' },
    { path: '/favorites', label: `FAVORITES [${favCount}]` }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-gray-200 dark:bg-black/90 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-bold tracking-tighter uppercase font-oswald flex items-center gap-2 select-none text-black dark:text-white"
          onClick={() => setIsOpen(false)}
        >
          <span className="w-3 h-3 bg-[#ff2e00] animate-pulse" />
          OMDb_TERMINAL
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`text-sm font-mono tracking-widest hover:text-[#ff2e00] transition-colors relative ${
                location.pathname === link.path 
                  ? 'text-black dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {location.pathname === link.path && (
                <motion.span 
                  layoutId="underline" 
                  className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#ff2e00]"
                />
              )}
              {link.label}
            </Link>
          ))}
          
          <div className="flex items-center pl-6 border-l border-gray-300 dark:border-gray-800">
            <button 
              onClick={toggleTheme} 
              className="text-xs font-mono font-bold uppercase transition-colors text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              [{isDark ? 'LIGHT' : 'DARK'}]
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={toggleTheme} 
            className="text-xs font-mono font-bold uppercase text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700 px-2 py-1 rounded"
          >
            {isDark ? 'LHT' : 'DRK'}
          </button>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-black dark:text-white p-1 focus:outline-none z-50"
            aria-label="Menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <motion.span 
                animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 9 : 0 }}
                className="w-full h-0.5 bg-current origin-left transition-all"
              />
              <motion.span 
                animate={{ opacity: isOpen ? 0 : 1 }}
                className="w-full h-0.5 bg-current transition-all"
              />
              <motion.span 
                animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -9 : 0 }}
                className="w-full h-0.5 bg-current origin-left transition-all"
              />
            </div>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white border-b border-gray-200 dark:bg-black dark:border-white/10"
          >
            <div className="flex flex-col p-6 gap-6">
              {links.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-mono font-bold uppercase tracking-widest ${
                    location.pathname === link.path 
                      ? 'text-[#ff2e00]' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;