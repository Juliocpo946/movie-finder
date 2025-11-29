import { motion } from 'framer-motion';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { getPosterUrl } from '../utils';
import { useFavorites } from '../context/FavoritesContext';

const Hero = ({ movie }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!movie) {
    return null;
  }

  const isFav = isFavorite(movie.imdbID);
  const posterUrl = getPosterUrl(movie.Poster);

  return (
    <div className="relative min-h-[85vh] w-full overflow-hidden border-b border-gray-200 dark:border-gray-800 flex items-end bg-gray-100 dark:bg-black">
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.0, ease: "easeOut" }}
      >
        {/* OPTIMIZACIÓN DE IMAGEN: Priority High para mejorar el LCP score */}
        <img 
          src={posterUrl} 
          alt={movie.Title}
          className="w-full h-full object-cover opacity-50 blur-sm"
          loading="eager"        // Cargar inmediatamente
          fetchPriority="high"   // Prioridad alta en la red
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100 via-gray-100/80 to-transparent dark:from-[#0a0a0a] dark:via-[#0a0a0a]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-100/60 to-transparent dark:from-[#0a0a0a] dark:via-[#0a0a0a]/60" />
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24 pt-32 flex flex-col justify-end h-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <span className="bg-[#ff2e00] text-white dark:text-black text-xs font-bold px-3 py-1 font-mono uppercase tracking-wider">
              Featured
            </span>
            {movie.Genre && (
              <span className="text-gray-600 dark:text-gray-300 font-mono text-sm uppercase tracking-widest border border-gray-400 dark:border-gray-600 px-3 py-1">
                {movie.Genre.split(',')[0]}
              </span>
            )}
            {movie.imdbRating && movie.imdbRating !== 'N/A' && (
              <span className="text-yellow-600 dark:text-yellow-500 font-mono text-sm font-bold flex items-center gap-1">
                ★ {movie.imdbRating}
              </span>
            )}
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-oswald font-bold uppercase leading-[0.9] mb-8 tracking-tighter mix-blend-difference break-words text-black dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.0, ease: "easeOut" }}
          >
            {movie.Title}
          </motion.h1>

          {movie.Plot && movie.Plot !== 'N/A' && (
            <motion.p 
              className="text-gray-700 dark:text-gray-300 text-lg md:text-xl font-mono max-w-2xl mb-12 line-clamp-3 leading-relaxed border-l-4 border-[#ff2e00] pl-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1.2 }}
            >
              {movie.Plot}
            </motion.p>
          )}

          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.0 }}
          >
            <Button 
              onClick={() => navigate(`/movie/${movie.imdbID}`)}
              className="bg-black text-white hover:bg-[#ff2e00] dark:bg-white dark:text-black dark:hover:bg-[#ff2e00] dark:hover:text-white border-0 text-base px-8 py-4 transition-colors duration-500"
            >
              VIEW DETAILS
            </Button>
            
            <button
              onClick={() => toggleFavorite(movie)}
              className={`px-8 py-4 font-bold text-sm tracking-widest border transition-colors duration-500 uppercase font-mono flex items-center gap-2
                ${isFav 
                  ? "bg-green-600 border-green-600 text-white hover:bg-green-700 shadow-[0_0_15px_rgba(22,163,74,0.3)]" 
                  : "backdrop-blur-md bg-white/5 border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                }`}
            >
              {isFav ? (
                <>
                  <span>✓</span> ADDED TO LIST
                </>
              ) : (
                '+ WATCHLIST'
              )}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;