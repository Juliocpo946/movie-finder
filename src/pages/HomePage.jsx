import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrending } from '../hooks/useTrending';
import { useFavorites } from '../context/FavoritesContext';
import Input from '../components/Input';
import Card from '../components/Card';
import Loader from '../components/Loader';
import Hero from '../components/Hero';
import { useNavigate } from 'react-router-dom';
import { tmdbClient } from '../api/tmdb';
import { normalizeTmdbMovie } from '../utils';

// Recibimos un 'sectionId' para pasarlo al Card como prefijo
const PopularSection = ({ title, type, navigate, sectionId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPopular = async () => {
      setLoading(true);
      try {
        const response = await tmdbClient.discover({ 
          type: type === 'movie' ? 'movie' : 'tv',
          sort_by: 'popularity.desc',
          page: 1 
        });
        
        if (isMounted && response.success) {
          const parsed = response.data.results
            .slice(0, 4)
            .map(item => normalizeTmdbMovie(item, type === 'movie' ? 'movie' : 'tv'));
          setItems(parsed);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPopular();
    return () => { isMounted = false; };
  }, [type]);

  if (loading || items.length === 0) return null;

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
          {title}
        </h2>
        <div className="h-px bg-gray-300 dark:bg-gray-800 flex-grow ml-6" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card 
            key={item.imdbID} 
            item={item} 
            sectionPrefix={sectionId} // Prefijo único para evitar conflictos
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
  const [query, setQuery] = useState('');
  
  const { trending, featuredMovie, isLoading: trendingLoading, error: trendingError } = useTrending();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && query.trim().length > 0) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0a0a0a]">
      <AnimatePresence>
        {featuredMovie && (
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
        <div className="max-w-7xl mx-auto">
          <Input
            placeholder="Search movies and series (Press Enter)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="text-2xl md:text-4xl font-oswald uppercase text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 border-gray-300 dark:border-gray-700"
          />
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-12">
        {trendingLoading && <Loader />}
        
        {trendingError && (
          <div className="py-10 text-center border border-red-500 bg-red-100 dark:bg-red-900/10 mb-8 rounded">
            <h3 className="text-xl font-mono text-red-600 dark:text-red-500">[SYSTEM ERROR]</h3>
            <p className="text-gray-700 dark:text-gray-400 font-mono text-xs mt-2">{trendingError}</p>
          </div>
        )}

        {!trendingLoading && (
          <div className="space-y-20 mt-16">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 1.0 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-mono text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                  TRENDING NOW 
                  <span className="text-black dark:text-white ml-2">[{trending.length}]</span>
                </h2>
                <div className="h-px bg-gray-300 dark:bg-gray-800 flex-grow ml-4" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {trending.map((item) => (
                  <Card 
                    key={item.imdbID} 
                    item={item} 
                    // No ponemos prefijo aquí para que la animación hacia DetailPage sea suave (morph)
                    // Las otras secciones sí llevarán prefijo.
                    onClick={(id) => navigate(`/movie/${id}`)} 
                  />
                ))}
              </div>
            </motion.div>

            <PopularSection 
              title="POPULAR MOVIES" 
              type="movie" 
              sectionId="pop-movies" 
              navigate={navigate} 
            />
            <PopularSection 
              title="POPULAR SERIES" 
              type="tv" 
              sectionId="pop-series" 
              navigate={navigate} 
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;