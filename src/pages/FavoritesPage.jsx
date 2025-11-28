import { useFavorites } from '../context/FavoritesContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { favorites, clearFavorites, getMoviesCount, getSeriesCount } = useFavorites();

  const moviesCount = getMoviesCount();
  const seriesCount = getSeriesCount();

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-gray-200 dark:border-white pb-8 gap-6">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-oswald uppercase leading-none text-black dark:text-white">
            FAVORITES 
            <span className="text-[#ff2e00] text-3xl align-top ml-3">[{favorites.length}]</span>
          </h1>
          <div className="flex gap-6 font-mono text-gray-600 dark:text-gray-400 text-sm md:text-base">
            <span className="bg-gray-200 dark:bg-gray-900 px-3 py-1 text-black dark:text-white">MOVIES: {moviesCount}</span>
            <span className="text-[#ff2e00]">//</span>
            <span className="bg-gray-200 dark:bg-gray-900 px-3 py-1 text-black dark:text-white">SERIES: {seriesCount}</span>
          </div>
        </div>
        
        {favorites.length > 0 && (
          <Button 
            onClick={() => clearFavorites()} 
            variant="danger"
            className="text-sm px-6 py-3"
          >
            CLEAR ALL
          </Button>
        )}
      </header>

      {favorites.length === 0 ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/20 rounded-lg gap-6">
          <p className="font-mono text-gray-500 text-xl">EMPTY COLLECTION</p>
          <Button onClick={() => navigate('/')} variant="primary">
            BROWSE TITLES
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {favorites.map((item) => (
            <Card 
              key={item.imdbID} 
              item={item} 
              onClick={(id) => navigate(`/movie/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;