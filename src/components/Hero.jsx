import { motion } from 'framer-motion';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { getPosterUrl } from '../utils';

const Hero = ({ movie, onAddToWatchlist }) => {
  const navigate = useNavigate();

  if (!movie) {
    return null;
  }

  const posterUrl = getPosterUrl(movie.Poster);

  return (
    <div className="relative h-[85vh] w-full overflow-hidden border-b border-gray-800">
      <div className="absolute inset-0 z-0">
        <img 
          src={posterUrl} 
          alt={movie.Title}
          className="w-full h-full object-cover opacity-60 blur-sm scale-105"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
      </div>

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col justify-end pb-24">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#ff2e00] text-black text-xs font-bold px-2 py-1 font-mono uppercase">
              Featured
            </span>
            {movie.Genre && (
              <span className="text-gray-300 font-mono text-sm uppercase tracking-widest border border-gray-600 px-2 py-0.5">
                {movie.Genre.split(',')[0]}
              </span>
            )}
            {movie.imdbRating && movie.imdbRating !== 'N/A' && (
              <span className="text-yellow-500 font-mono text-sm font-bold">
                {movie.imdbRating} IMDb
              </span>
            )}
          </div>

          <h1 className="text-7xl md:text-9xl font-oswald font-bold text-white uppercase leading-[0.8] mb-6 tracking-tighter mix-blend-difference">
            {movie.Title}
          </h1>

          {movie.Plot && movie.Plot !== 'N/A' && (
            <p className="text-gray-300 text-lg md:text-xl font-mono max-w-2xl mb-10 line-clamp-3 leading-relaxed border-l-2 border-[#ff2e00] pl-6">
              {movie.Plot}
            </p>
          )}

          <div className="flex gap-4">
            <Button 
              onClick={() => navigate(`/movie/${movie.imdbID}`)}
              className="bg-white text-black hover:bg-[#ff2e00] hover:text-white border-0 text-base px-8 py-4"
            >
              VIEW_DETAILS
            </Button>
            <Button 
              variant="secondary"
              onClick={() => onAddToWatchlist && onAddToWatchlist(movie)}
              className="backdrop-blur-md bg-white/5 border-white/20 hover:bg-white hover:text-black text-base px-8 py-4"
            >
              + WATCHLIST
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;