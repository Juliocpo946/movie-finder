import { motion } from 'framer-motion';
import { getPosterUrl } from '../utils';

const Card = ({ item, onClick }) => {
  const posterUrl = getPosterUrl(item.Poster);
  
  return (
    <motion.div
      layoutId={item.imdbID}
      onClick={() => onClick(item.imdbID)}
      className="group relative cursor-pointer h-[400px] overflow-hidden bg-gray-900"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="w-full h-full overflow-hidden">
        <img 
          src={posterUrl} 
          alt={item.Title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x450/1a1a1a/ededed?text=No+Poster';
          }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

      <div className="absolute top-0 right-0 p-4 transform translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-300">
        <span className="bg-white text-black text-xs font-bold px-2 py-1 font-mono uppercase">
          {item.Type}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <div className="overflow-hidden mb-2">
          <h3 className="text-2xl font-oswald font-bold text-white uppercase leading-none truncate transform group-hover:-translate-y-1 transition-transform duration-300">
            {item.Title}
          </h3>
        </div>
        
        <div className="flex items-center justify-between border-t border-white/30 pt-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          <span className="text-[#ff2e00] font-mono text-sm font-bold tracking-widest">
            {item.Year}
          </span>
          <span className="text-gray-400 font-mono text-xs uppercase hover:text-white transition-colors">
            {'View Details ->'}
          </span>
        </div>
      </div>
      
      <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default Card;