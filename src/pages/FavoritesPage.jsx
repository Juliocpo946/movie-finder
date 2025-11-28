import { useTranslation } from 'react-i18next';
import { useFavorites } from '../context/FavoritesContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const FavoritesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { favorites, clearFavorites, getMoviesCount, getSeriesCount } = useFavorites();

  const moviesCount = getMoviesCount();
  const seriesCount = getSeriesCount();

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-800 pb-4 gap-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-oswald uppercase">
            {t('common.favorites')} 
            <span className="text-[#ff2e00] text-2xl align-top ml-2">[{favorites.length}]</span>
          </h1>
          <div className="flex gap-4 mt-2 font-mono text-sm text-gray-500">
            <span>Movies: {moviesCount}</span>
            <span>//</span>
            <span>Series: {seriesCount}</span>
          </div>
        </div>
        
        {favorites.length > 0 && (
          <Button 
            onClick={() => clearFavorites()} 
            variant="danger"
            className="text-xs"
          >
            CLEAR_ALL
          </Button>
        )}
      </header>

      {favorites.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border border-gray-800 bg-gray-900/20 border-dashed gap-4">
          <p className="font-mono text-gray-500">EMPTY_COLLECTION</p>
          <Button onClick={() => navigate('/')} variant="secondary">
            BROWSE_TITLES
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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