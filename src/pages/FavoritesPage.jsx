import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';
import Card from '../components/Card';
import Button from '../components/Button';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { favorites, clearFavorites, getMoviesCount, getSeriesCount } = useFavorites();
  const [filter, setFilter] = useState('all');

  const moviesCount = getMoviesCount();
  const seriesCount = getSeriesCount();

  const filteredFavorites = favorites.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'movie') return item.Type === 'movie';
    if (filter === 'series') return item.Type === 'series' || item.Type === 'tv';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-gray-200 dark:border-white pb-8 gap-6">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-oswald uppercase leading-none text-black dark:text-white">
            FAVORITES 
            <span className="text-[#ff2e00] text-3xl align-top ml-3">[{favorites.length}]</span>
          </h1>
          <div className="flex gap-6 font-mono text-gray-600 dark:text-gray-400 text-sm md:text-base">
            <span className="bg-gray-200 dark:bg-gray-900 px-3 py-1 text-black dark:text-white">MOVIES: {moviesCount}</span>
            <span className="text-[#ff2e00]">//</span>
            <span className="bg-gray-200 dark:bg-gray-900 px-3 py-1 text-black dark:text-white">SERIES: {seriesCount}</span>
          </div>
        </div>
        
        {favorites.length > 0 && (
          <Button 
            onClick={() => clearFavorites()} 
            variant="danger"
            className="text-sm px-6 py-3"
          >
            CLEAR ALL
          </Button>
        )}
      </header>

      {favorites.length > 0 && (
        <div className="flex flex-wrap gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 text-xs font-mono font-bold uppercase tracking-widest border transition-all duration-300 ${
              filter === 'all' 
                ? 'bg-[#ff2e00] border-[#ff2e00] text-white shadow-[4px_4px_0px_rgba(0,0,0,0.2)]' 
                : 'border-gray-300 dark:border-gray-700 text-gray-500 hover:border-[#ff2e00] hover:text-[#ff2e00]'
            }`}
          >
            ALL_SIGNALS
          </button>
          <button
            onClick={() => setFilter('movie')}
            className={`px-6 py-2 text-xs font-mono font-bold uppercase tracking-widest border transition-all duration-300 ${
              filter === 'movie' 
                ? 'bg-[#ff2e00] border-[#ff2e00] text-white shadow-[4px_4px_0px_rgba(0,0,0,0.2)]' 
                : 'border-gray-300 dark:border-gray-700 text-gray-500 hover:border-[#ff2e00] hover:text-[#ff2e00]'
            }`}
          >
            MOVIES
          </button>
          <button
            onClick={() => setFilter('series')}
            className={`px-6 py-2 text-xs font-mono font-bold uppercase tracking-widest border transition-all duration-300 ${
              filter === 'series' 
                ? 'bg-[#ff2e00] border-[#ff2e00] text-white shadow-[4px_4px_0px_rgba(0,0,0,0.2)]' 
                : 'border-gray-300 dark:border-gray-700 text-gray-500 hover:border-[#ff2e00] hover:text-[#ff2e00]'
            }`}
          >
            SERIES
          </button>
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/20 rounded-lg gap-6">
          <p className="font-mono text-gray-500 text-xl">EMPTY COLLECTION</p>
          <Button onClick={() => navigate('/')} variant="primary">
            BROWSE TITLES
          </Button>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredFavorites.map((item) => (
              <motion.div
                key={item.imdbID}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  item={item} 
                  onClick={(id) => navigate(`/movie/${id}`)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {favorites.length > 0 && filteredFavorites.length === 0 && (
        <div className="py-20 text-center font-mono text-gray-500">
          NO DATA FOUND FOR THIS CATEGORY
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;