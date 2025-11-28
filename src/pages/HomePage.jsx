import { useEffect, useState, useRef } from 'react'; // Agregamos useRef
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch, SEARCH_STATUS } from '../hooks/useSearch';
import Input from '../components/Input';
import Card from '../components/Card';
import Loader from '../components/Loader';
import Hero from '../components/Hero';
import { useNavigate } from 'react-router-dom';
import { INITIAL_QUERIES, GENRES } from '../utils/constants';

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeGenre, setActiveGenre] = useState(null);
  const [currentTrend, setCurrentTrend] = useState('');
  
  // Usamos useRef para evitar re-renders innecesarios en la carga inicial
  const initialized = useRef(false);

  const { 
    query, 
    setQuery, 
    debouncedQuery, 
    results, 
    status, 
    error,
    search, 
    reset 
  } = useSearch({ debounceDelay: 500 });

  // 1. CARGA INICIAL (Tendencias)
  useEffect(() => {
    if (!initialized.current) {
      // Elegir una película aleatoria de la lista para mostrar "Tendencias"
      const randomQuery = INITIAL_QUERIES[Math.floor(Math.random() * INITIAL_QUERIES.length)];
      setCurrentTrend(randomQuery);
      search(randomQuery);
      initialized.current = true;
    }
  }, [search]);

  // 2. BÚSQUEDA DEL USUARIO
  useEffect(() => {
    if (debouncedQuery.length >= 3) {
      // Si el usuario escribe, buscamos eso + el género activo (si hay)
      search(debouncedQuery, activeGenre);
    } else if (debouncedQuery.length === 0 && initialized.current) {
      // Si el usuario borra todo, volvemos a mostrar la tendencia inicial
      search(currentTrend);
    }
  }, [debouncedQuery, activeGenre, search, currentTrend]);

  const handleGenreClick = (genreValue) => {
    // Alternar género
    const newGenre = activeGenre === genreValue ? null : genreValue;
    setActiveGenre(newGenre);
    
    // Si hay texto escrito, buscamos "Texto + Género"
    // Si no hay texto, buscamos "Tendencia Actual + Género"
    const termToSearch = query.length >= 3 ? query : currentTrend;
    search(termToSearch, newGenre);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* HERO: Visible si el usuario no ha escrito nada específico (estamos en modo tendencias) */}
      <AnimatePresence>
        {query.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* ID fijo de ejemplo para el Hero (Oppenheimer) */}
            <Hero defaultMovieId="tt15398776" />
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

          {/* FILTROS DE GÉNERO */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {GENRES.map((g) => (
              <button
                key={g.value}
                onClick={() => handleGenreClick(g.value)}
                className={`px-4 py-2 text-xs font-mono border transition-all whitespace-nowrap uppercase tracking-wider
                  ${activeGenre === g.value 
                    ? 'bg-[#ff2e00] border-[#ff2e00] text-black font-bold' 
                    : 'border-gray-800 text-gray-500 hover:border-white hover:text-white'
                  }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-12 min-h-[50vh]">
        {status === SEARCH_STATUS.LOADING && <Loader />}
        
        {status === SEARCH_STATUS.ERROR && (
          <div className="py-20 text-center border border-red-900 bg-red-900/10">
            <h3 className="text-xl font-mono text-red-500">[ERROR: {error}]</h3>
          </div>
        )}

        {status === SEARCH_STATUS.NO_RESULTS && (
          <div className="py-20 text-center border border-gray-800 border-dashed">
             <h3 className="text-xl font-mono text-gray-500">[NO_DATA_FOUND]</h3>
          </div>
        )}

        {status === SEARCH_STATUS.SUCCESS && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">
                {query ? 'SEARCH_RESULTS' : 'TRENDING_ARCHIVES'} <span className="text-white">[{results.length}]</span>
              </h2>
              <div className="h-px bg-gray-800 flex-grow ml-4" />
            </div>

            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            >
              {results.map((item) => (
                <Card 
                  key={item.imdbID} 
                  item={item} 
                  onClick={(id) => navigate(`/movie/${id}`)} 
                />
              ))}
            </motion.div>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;