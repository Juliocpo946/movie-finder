import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true);
      const queries = type === 'movie' 
        ? ['Batman', 'Spider', 'Star Wars', 'Marvel']
        : ['Breaking', 'Game of', 'Stranger', 'The Office'];
      
      const randomQuery = queries[Math.floor(Math.random() * queries.length)];
      
      const response = await omdbApi.search(randomQuery, { type });
      
      if (response.success && response.data?.Search) {
        const parsed = response.data.Search.slice(0, 4).map((item) => ({
          ...item,
          Poster: getPosterUrl(item.Poster)
        }));
        setItems(parsed);
      }
      setLoading(false);
    };

    fetchPopular();
  }, [type]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">{title}</h2>
          <div className="h-px bg-gray-800 flex-grow ml-4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[400px] bg-gray-900 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">
          {title} <span className="text-white">[{items.length}]</span>
        </h2>
        <div className="h-px bg-gray-800 flex-grow ml-4" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card 
            key={item.imdbID} 
            item={item} 
            onClick={(id) => navigate(`/movie/${id}`)} 
          />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addFavorite } = useFavorites();
  
  const [activeType, setActiveType] = useState('');
  const initialized = useRef(false);

  const { 
    trending, 
    featuredMovie, 
    isLoading: trendingLoading,
    fetchByQuery 
  } = useTrending();

  const { 
    query, 
    setQuery, 
    debouncedQuery, 
    results, 
    status, 
    error,
    pagination,
    search,
    loadMore
  } = useSearch({ debounceDelay: 400 });

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      search(debouncedQuery, { type: activeType });
    }
  }, [debouncedQuery, activeType, search]);

  const handleTypeChange = useCallback((type) => {
    setActiveType(type);
    if (debouncedQuery.length >= 2) {
      search(debouncedQuery, { type });
    } else {
      fetchByQuery('Avengers', type);
    }
  }, [debouncedQuery, search, fetchByQuery]);

  const handleLoadMore = useCallback(() => {
    loadMore(debouncedQuery, { type: activeType });
  }, [debouncedQuery, activeType, loadMore]);

  const handleAddToWatchlist = useCallback((movie) => {
    addFavorite(movie);
  }, [addFavorite]);

  const isSearchMode = query.length > 0;
  const displayResults = isSearchMode ? results : trending;
  const showLoader = isSearchMode ? status === SEARCH_STATUS.LOADING : trendingLoading;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AnimatePresence>
        {!isSearchMode && featuredMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Hero 
              movie={featuredMovie} 
              onAddToWatchlist={handleAddToWatchlist}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sticky top-16 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10 py-6 px-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <Input
            placeholder={t('home.welcome')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-2xl md:text-4xl font-oswald uppercase"
          />

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {TYPE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleTypeChange(filter.value)}
                className={`px-4 py-2 text-xs font-mono border transition-all whitespace-nowrap uppercase tracking-wider
                  ${activeType === filter.value 
                    ? 'bg-[#ff2e00] border-[#ff2e00] text-black font-bold' 
                    : 'border-gray-800 text-gray-500 hover:border-white hover:text-white'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {showLoader && <Loader />}
        
        {status === SEARCH_STATUS.ERROR && (
          <div className="py-20 text-center border border-red-900 bg-red-900/10">
            <h3 className="text-xl font-mono text-red-500">[ERROR: {error}]</h3>
          </div>
        )}

        {status === SEARCH_STATUS.NO_RESULTS && isSearchMode && (
          <div className="py-20 text-center border border-gray-800 border-dashed">
            <h3 className="text-xl font-mono text-gray-500">[NO_DATA_FOUND]</h3>
            <p className="text-gray-600 font-mono text-sm mt-2">Try a different search term</p>
          </div>
        )}

        {!showLoader && displayResults.length > 0 && (
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">
                  {isSearchMode ? 'SEARCH_RESULTS' : 'TRENDING_ARCHIVES'} 
                  <span className="text-white ml-2">[{isSearchMode ? pagination.totalResults : displayResults.length}]</span>
                </h2>
                <div className="h-px bg-gray-800 flex-grow ml-4" />
              </div>

              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              >
                {displayResults.map((item) => (
                  <Card 
                    key={item.imdbID} 
                    item={item} 
                    onClick={(id) => navigate(`/movie/${id}`)} 
                  />
                ))}
              </motion.div>

              {isSearchMode && pagination.currentPage < pagination.totalPages && (
                <div className="flex justify-center pt-8">
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 font-mono text-sm border border-gray-700 text-gray-400 hover:border-[#ff2e00] hover:text-[#ff2e00] transition-colors uppercase tracking-widest"
                  >
                    LOAD_MORE [{pagination.currentPage}/{pagination.totalPages}]
                  </button>
                </div>
              )}
            </div>

            {!isSearchMode && (
              <div className="space-y-12">
                <PopularSection 
                  title="POPULAR_MOVIES" 
                  type="movie" 
                  navigate={navigate} 
                />
                <PopularSection 
                  title="POPULAR_SERIES" 
                  type="series" 
                  navigate={navigate} 
                />
              </div>
            )}
          </div>
        )}

        {!showLoader && displayResults.length === 0 && !isSearchMode && (
          <div className="space-y-12">
            <PopularSection 
              title="POPULAR_MOVIES" 
              type="movie" 
              navigate={navigate} 
            />
            <PopularSection 
              title="POPULAR_SERIES" 
              type="series" 
              navigate={navigate} 
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;