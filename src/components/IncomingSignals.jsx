import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { tmdbClient } from '../api/tmdb';
import { normalizeTmdbMovie } from '../utils';
import Card from './Card';

const IncomingSignals = ({ navigate }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let isMounted = true;
    tmdbClient.getUpcoming().then(res => {
      if (isMounted && res.success) {
        setItems(res.data.results.map(item => normalizeTmdbMovie(item)));
      }
    });
    return () => { isMounted = false; };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h2 className="text-xl font-oswald text-gray-900 dark:text-white uppercase tracking-widest border-l-4 border-[#ff2e00] pl-4">
          INCOMING SIGNALS
        </h2>
        <span className="font-mono text-xs text-[#ff2e00] animate-pulse">
          /// AWAITING DEPLOYMENT
        </span>
      </div>
      
      {/* Scroll libre sin 'snap' para que no se atore */}
      <div className="flex overflow-x-auto pb-8 gap-6 scrollbar-hide px-1">
        {items.map((item, index) => (
          <motion.div 
            key={item.imdbID}
            className="min-w-[200px] md:min-w-[240px] h-full"
            initial={{ opacity: 0, y: 60, filter: "blur(10px)" }} 
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ 
              duration: 1.0, 
              ease: [0.22, 1, 0.36, 1],
              delay: index * 0.05
            }}
          >
            <div className="h-full flex flex-col">
              <Card 
                item={item} 
                onClick={(id) => navigate(`/movie/${id}`)}
                viewMode="grid"
              />
              <div className="mt-2 text-center opacity-80">
                <span className="text-xs font-mono bg-[#ff2e00] text-white px-2 py-1">
                  {item.Year}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default IncomingSignals;