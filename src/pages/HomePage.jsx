import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch, SEARCH_STATUS } from '../hooks/useSearch';
import { useTrending } from '../hooks/useTrending';
import { useFavorites } from '../context/FavoritesContext';
import Input from '../components/Input';
import Card from '../components/Card';
import Loader from '../components/Loader';
import Hero from '../components/Hero';
import { useNavigate } from 'react-router-dom';
import { TYPE_FILTERS } from '../utils/constants';
import { omdbApi } from '../api';
import { getPosterUrl } from '../utils';

const PopularSection = ({ title, type, navigate }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPopular = async () => {
      setLoading(true);
      setError(null);
      try {
        const queries = type === 'movie' 
          ? ['Batman', 'Spider', 'Star Wars', 'Marvel']
          : ['Breaking', 'Game of', 'Stranger', 'The Office'];
        
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        const response = await omdbApi.search(randomQuery, { type });
        
        if (isMounted) {
          if (response.success && response.data?.Search) {
            const parsed = response.data.Search.slice(0, 4).map((item) => ({
              ...item,
              Poster: getPosterUrl(item.Poster)
            }));
            setItems(parsed);
          } else {
            setError(response.message || "No results");
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPopular();
    return () => { isMounted = false; };
  }, [type]);

  if (loading || items.length === 0 || error) return null;

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 1.2 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-oswald text-gray-900 dark:text-white uppercase tracking-widest border-l-4 border-[#ff2e00] pl-4">
          {title} <span className="text-gray-500 text-sm ml-2">[{items.length}]</span>
        </h2>
        <div className="h-px bg-gray-300 dark:bg-gray-800 flex-grow ml-6" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card 
            key={item.imdbID} 
            item={item} 
            onClick={(id) => navigate(`/movie/${id}`)} 
          />
        ))}
      </div>
    </motion.div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const { addFavorite } = useFavorites();
  const [activeType, setActiveType] = useState('');

  const { trending, featuredMovie, isLoading: trendingLoading, error: trendingError } = useTrending();
  const { query, setQuery, debouncedQuery, results, status, error, pagination, search, loadMore } = useSearch({ debounceDelay: 400 });

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      search(debouncedQuery, { type: activeType });
    }
  }, [debouncedQuery, activeType, search]);

  const handleTypeChange = (type) => {
    setActiveType(type);
  };

  const handleLoadMore = useCallback(() => {
    loadMore(debouncedQuery, { type: activeType });
  }, [debouncedQuery, activeType, loadMore]);

  const isSearchMode = query.length > 0;
  const displayResults = isSearchMode ? results : trending;
  const showLoader = isSearchMode ? status === SEARCH_STATUS.LOADING : trendingLoading;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0a0a0a]">
      <AnimatePresence>
        {!isSearchMode && featuredMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <Hero movie={featuredMovie} onAddToWatchlist={addFavorite} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sticky top-20 z-40 bg-white/90 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10 py-6 px-4 transition-all duration-500">
        <div className="max-w-7xl mx-auto space-y-4">
          <Input
            placeholder="Search movies and series..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-2xl md:text-4xl font-oswald uppercase text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 border-gray-300 dark:border-gray-700"
          />
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {TYPE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleTypeChange(filter.value)}
                className={`px-6 py-2 text-xs font-mono border transition-all duration-500 whitespace-nowrap uppercase tracking-wider
                  ${activeType === filter.value 
                    ? 'bg-[#ff2e00] border-[#ff2e00] text-white font-bold transform scale-105' 
                    : 'border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-500 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-12">
        {showLoader && (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        )}
        
        {(status === SEARCH_STATUS.ERROR || trendingError) && (
          <div className="py-10 text-center border border-red-500 bg-red-100 dark:bg-red-900/10 mb-8 rounded">
            <h3 className="text-xl font-mono text-red-600 dark:text-red-500">[SYSTEM ERROR]</h3>
            <p className="text-gray-700 dark:text-gray-400 font-mono text-xs mt-2">{error || trendingError}</p>
          </div>
        )}

        {status === SEARCH_STATUS.NO_RESULTS && isSearchMode && (
          <div className="py-20 text-center border border-gray-300 dark:border-gray-800 border-dashed rounded-lg">
            <h3 className="text-xl font-mono text-gray-500">[NO DATA FOUND]</h3>
          </div>
        )}

        {!showLoader && displayResults.length > 0 && (
          <div className="space-y-20">
            <div className="space-y-8">
              <motion.div 
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1.0 }}
              >
                <h2 className="text-sm font-mono text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                  {isSearchMode ? 'SEARCH RESULTS' : 'TRENDING ARCHIVES'} 
                  <span className="text-black dark:text-white ml-2">[{isSearchMode ? pagination.totalResults : displayResults.length}]</span>
                </h2>
                <div className="h-px bg-gray-300 dark:bg-gray-800 flex-grow ml-4" />
              </motion.div>

              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
              >
                {displayResults.map((item) => (
                  <motion.div
                    key={item.imdbID}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                    }}
                  >
                    <Card 
                      item={item} 
                      onClick={(id) => navigate(`/movie/${id}`)} 
                    />
                  </motion.div>
                ))}
              </motion.div>

              {isSearchMode && pagination.currentPage < pagination.totalPages && (
                <div className="flex justify-center pt-8">
                  <button
                    onClick={handleLoadMore}
                    className="px-10 py-4 font-mono text-sm border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-[#ff2e00] hover:text-[#ff2e00] transition-colors duration-500 uppercase tracking-widest hover:bg-[#ff2e00]/5"
                  >
                    LOAD MORE [{pagination.currentPage}/{pagination.totalPages}]
                  </button>
                </div>
              )}
            </div>

            {!isSearchMode && (
              <div className="space-y-20 mt-16">
                <PopularSection 
                  title="POPULAR MOVIES" 
                  type="movie" 
                  navigate={navigate} 
                />
                <PopularSection 
                  title="POPULAR SERIES" 
                  type="series" 
                  navigate={navigate} 
                />
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;