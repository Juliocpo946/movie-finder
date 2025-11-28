import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSearch, SEARCH_STATUS } from '../hooks/useSearch';
import Input from '../components/Input';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { TYPE_FILTERS } from '../utils/constants';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || '';
  const initialYear = searchParams.get('y') || '';

  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);
  const [year, setYear] = useState(initialYear);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const { results, status, error, pagination, search, loadMore } = useSearch({ debounceDelay: 500 });

  // Ejecutar búsqueda cuando cambian los filtros o la query en la URL
  useEffect(() => {
    const q = searchParams.get('q');
    const t = searchParams.get('type');
    const y = searchParams.get('y');
    
    if (q) {
      search(q, { type: t, year: y });
    }
  }, [searchParams, search]);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && query.trim().length > 0) {
      updateUrl();
    }
  };

  const updateUrl = () => {
    const params = { q: query };
    if (type) params.type = type;
    if (year) params.y = year;
    setSearchParams(params);
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    const params = { q: query };
    if (newType) params.type = newType;
    if (year) params.y = year;
    setSearchParams(params);
  };

  const handleYearChange = (e) => {
    const val = e.target.value;
    setYear(val);
    // Debounce manual para el año podría ser útil, pero aquí aplicamos al Enter o blur para simplicidad
    // O podemos actualizar URL directamente si queremos reactividad inmediata:
    if (val.length === 4 || val === '') {
       const params = { q: query };
       if (type) params.type = type;
       if (val) params.y = val;
       setSearchParams(params);
    }
  };

  const handleLoadMore = useCallback(() => {
    loadMore(query, { type, year });
  }, [query, type, year, loadMore]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0a0a0a] pt-24 px-6 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header de Búsqueda */}
        <header className="space-y-6">
          <Input
            placeholder="Search titles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            className="text-4xl md:text-6xl font-oswald uppercase text-black dark:text-white border-b-2 border-gray-300 dark:border-gray-700"
          />
          
          <div className="flex flex-col md:flex-row gap-6 justify-between items-end border-b border-gray-300 dark:border-gray-800 pb-6">
            {/* Filtros */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex gap-2">
                {TYPE_FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => handleTypeChange(filter.value)}
                    className={`px-4 py-2 text-xs font-mono border transition-all duration-300 uppercase tracking-wider
                      ${type === filter.value 
                        ? 'bg-[#ff2e00] border-[#ff2e00] text-white font-bold' 
                        : 'border-gray-300 dark:border-gray-700 text-gray-500 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
                      }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              
              <div className="relative group">
                <input 
                  type="text"
                  placeholder="YEAR"
                  value={year}
                  onChange={handleYearChange}
                  maxLength={4}
                  className="w-24 bg-transparent border border-gray-300 dark:border-gray-700 px-3 py-2 text-xs font-mono text-black dark:text-white focus:border-[#ff2e00] outline-none transition-colors text-center uppercase placeholder-gray-500"
                />
              </div>
            </div>

            {/* Toggle View */}
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'text-[#ff2e00]' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/></svg>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'text-[#ff2e00]' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
              </button>
            </div>
          </div>
        </header>

        {/* Resultados */}
        {status === SEARCH_STATUS.LOADING && <Loader />}
        
        {status === SEARCH_STATUS.ERROR && (
          <div className="py-20 text-center">
            <h3 className="text-xl font-mono text-red-500 uppercase">[ERROR: {error}]</h3>
          </div>
        )}

        {status === SEARCH_STATUS.NO_RESULTS && (
          <div className="py-32 text-center border-2 border-dashed border-gray-300 dark:border-gray-800">
            <h3 className="text-2xl font-mono text-gray-500">[NO RESULTS FOUND]</h3>
            <p className="text-gray-400 mt-2 font-mono text-sm">Try adjusting your filters or search query</p>
          </div>
        )}

        {results.length > 0 && (
          <motion.div 
            className="space-y-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
              {results.map((item) => (
                <Card 
                  key={item.imdbID} 
                  item={item} 
                  viewMode={viewMode}
                  onClick={(id) => navigate(`/movie/${id}`)} 
                />
              ))}
            </div>

            {pagination.currentPage < pagination.totalPages && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={handleLoadMore}
                  className="px-12 py-4 font-mono text-sm border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-[#ff2e00] hover:text-[#ff2e00] transition-colors duration-500 uppercase tracking-widest"
                >
                  LOAD MORE [{pagination.currentPage}/{pagination.totalPages}]
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;