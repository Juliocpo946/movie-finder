import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { tmdbClient } from '../api/tmdb';
import { normalizeTmdbMovie } from '../utils';
import Card from './Card';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    // ANIMACIÓN: Blur + Movimiento Profundo
    hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-oswald text-gray-900 dark:text-white uppercase tracking-widest border-l-4 border-[#ff2e00] pl-4">
          {title}
        </h2>
        <div className="h-px bg-gray-300 dark:bg-gray-800 flex-grow ml-6" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 auto-rows-fr">
        {items.map((item) => (
          <motion.div key={item.imdbID} variants={itemVariants} className="h-full">
            <Card 
              item={item} 
              sectionPrefix={sectionId} 
              onClick={(id) => navigate(`/movie/${id}`)} 
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PopularSection;