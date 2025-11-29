import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSearch, SEARCH_STATUS } from '../hooks/useSearch';
import Input from '../components/Input';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { TYPE_FILTERS, TMDB_GENRES, SORT_OPTIONS } from '../utils/constants';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || 'movie',
    year: searchParams.get('year') || '',
    genre: searchParams.get('genre') || '',
    sort: searchParams.get('sort') || 'popularity.desc'
  });

  const { results, status, pagination, search, loadMore } = useSearch();

  useEffect(() => {
    const params = {
      type: filters.type,
      year: filters.year,
      with_genres: filters.genre,
      sort_by: filters.sort
    };
    search(query, params);
  }, [query, filters, search]);

  const updateFilters = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      const urlParams = { q: query, ...newFilters };
      // Limpiar claves vacías
      Object.keys(urlParams).forEach(k => !urlParams[k] && delete urlParams[k]);
      setSearchParams(urlParams);
      return newFilters;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0a0a0a] pt-24 px-6 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-6">
          <Input
            placeholder="Search TMDB..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchParams({ ...filters, q: e.target.value });
            }}
            className="text-4xl font-oswald uppercase dark:text-white"
          />
          
          <div className="flex flex-wrap gap-4 items-center bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm">
            {/* Tipo */}
            <div className="flex gap-2">
              {TYPE_FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => updateFilters('type', f.value)}
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border transition-colors ${
                    filters.type === f.value 
                    ? 'bg-[#ff2e00] border-[#ff2e00] text-white' 
                    : 'border-gray-300 dark:border-gray-700 text-gray-500'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Géneros */}
            <select 
              value={filters.genre}
              onChange={(e) => updateFilters('genre', e.target.value)}
              className="bg-transparent border border-gray-300 dark:border-gray-700 text-xs font-mono p-2 rounded dark:text-white"
            >
              <option value="">ALL GENRES</option>
              {TMDB_GENRES.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>

            {/* Año */}
            <input 
              type="number" 
              placeholder="YEAR"
              value={filters.year}
              onChange={(e) => updateFilters('year', e.target.value)}
              className="w-20 bg-transparent border border-gray-300 dark:border-gray-700 text-xs font-mono p-2 rounded dark:text-white text-center"
            />

            {/* Ordenamiento */}
            <select 
              value={filters.sort}
              onChange={(e) => updateFilters('sort', e.target.value)}
              className="bg-transparent border border-gray-300 dark:border-gray-700 text-xs font-mono p-2 rounded dark:text-white"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </header>

        {status === SEARCH_STATUS.LOADING && <Loader />}
        
        {results.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {results.map((item) => (
                <Card 
                  key={item.imdbID} 
                  item={item} 
                  onClick={(id) => navigate(`/movie/${id}`)} 
                />
              ))}
            </div>
            
            {pagination.page < pagination.totalPages && (
              <div className="text-center pt-8">
                <button
                  onClick={() => loadMore(query, { 
                    type: filters.type, 
                    year: filters.year, 
                    with_genres: filters.genre,
                    sort_by: filters.sort 
                  })}
                  className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-mono uppercase hover:border-[#ff2e00] transition-colors dark:text-white"
                >
                  Load More Results
                </button>
              </div>
            )}
          </motion.div>
        )}
        
        {status === SEARCH_STATUS.NO_RESULTS && (
          <div className="py-20 text-center text-gray-500 font-mono">
            NO DATA FOUND IN SECTOR
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;