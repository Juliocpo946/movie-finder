import { motion } from 'framer-motion';
import { getPosterUrl } from '../utils';

const Card = ({ item, onClick, viewMode = 'grid', sectionPrefix = '' }) => {
  const posterUrl = getPosterUrl(item.Poster);
  const isList = viewMode === 'list';
  const cardLayoutId = sectionPrefix ? `${sectionPrefix}-${item.imdbID}` : item.imdbID;
  
  return (
    <motion.div
      layoutId={cardLayoutId}
      onClick={() => onClick(item.imdbID)}
      className={`group relative cursor-pointer overflow-hidden bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-white/5 flex flex-col
        ${isList ? 'flex-row h-48 w-full' : 'h-full w-full'}`}
      initial={{ opacity: 0, y: 50, filter: "blur(10px)" }} 
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: false, amount: 0.1 }} 
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className={`${isList ? 'w-32 shrink-0 h-full' : 'aspect-[2/3] w-full'} overflow-hidden relative`}>
        <motion.img 
          src={posterUrl} 
          alt={item.Title}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x450/1a1a1a/ededed?text=No+Poster';
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        {!isList && (
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent dark:from-black dark:via-black/40 opacity-60 group-hover:opacity-90 transition-opacity duration-700" />
        )}
      </div>

      {!isList && (
        <div className="absolute top-0 right-0 p-4 transform translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out z-10">
          <span className="bg-[#ff2e00] text-white dark:text-black text-xs font-bold px-2 py-1 font-mono uppercase tracking-wider shadow-md">
            {item.Type}
          </span>
        </div>
      )}

      <div className={`${isList ? 'p-6 flex flex-col justify-between w-full' : 'absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end'}`}>
        <div className="overflow-hidden mb-2">
          <motion.h3 
            className={`font-oswald font-bold text-gray-900 dark:text-white uppercase leading-none ${isList ? 'text-3xl line-clamp-2' : 'text-2xl truncate'}`}
          >
            {item.Title}
          </motion.h3>
          {isList && (
             <span className="bg-[#ff2e00] text-white dark:text-black text-xs font-bold px-2 py-1 font-mono uppercase tracking-wider inline-block mt-2">
               {item.Type}
             </span>
          )}
        </div>
        
        <div className={`flex items-center justify-between border-t border-gray-400 dark:border-white/10 pt-3 mt-2 ${!isList ? 'opacity-70 group-hover:opacity-100 transition-opacity duration-500' : ''}`}>
          <span className="text-[#ff2e00] font-mono text-sm font-bold tracking-widest">
            {item.Year}
          </span>
          <span className="text-gray-600 dark:text-gray-400 font-mono text-xs uppercase group-hover:text-black dark:group-hover:text-white transition-colors duration-500">
            {'View ->'}
          </span>
        </div>
      </div>
      
      <div className="absolute inset-0 border border-transparent group-hover:border-black/10 dark:group-hover:border-white/10 transition-colors duration-700 pointer-events-none" />
    </motion.div>
  );
};

export default Card;