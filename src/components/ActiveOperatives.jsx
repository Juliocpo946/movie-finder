import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { tmdbClient } from '../api/tmdb';
import { normalizeTmdbPerson } from '../utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  // ANIMACIÓN: Blur + Movimiento
  hidden: { opacity: 0, y: 30, scale: 0.9, filter: "blur(8px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const ActiveOperatives = () => {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    let isMounted = true;
    tmdbClient.getPopularPeople().then(res => {
      if (isMounted && res.success) {
        setPeople(res.data.results.slice(0, 6).map(normalizeTmdbPerson));
      }
    });
    return () => { isMounted = false; };
  }, []);

  if (people.length === 0) return null;

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-oswald text-gray-900 dark:text-white uppercase tracking-widest border-l-4 border-[#ff2e00] pl-4">
        ACTIVE OPERATIVES
      </h2>
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        {people.map((person) => (
          <motion.div 
            key={person.id}
            className="flex flex-col items-center gap-4 group cursor-pointer"
            variants={itemVariants}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <div className="absolute inset-0 bg-[#ff2e00] opacity-0 group-hover:opacity-20 transition-opacity" 
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
              <img 
                src={person.profilePath} 
                alt={person.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
              />
            </div>
            <div className="text-center">
              <h3 className="font-oswald text-sm md:text-base text-gray-900 dark:text-white uppercase tracking-wider">
                {person.name}
              </h3>
              <p className="text-[10px] font-mono text-gray-500 dark:text-gray-400 mt-1">
                {person.knownFor}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ActiveOperatives;