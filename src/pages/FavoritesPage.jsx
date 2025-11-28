import { useTranslation } from 'react-i18next';
import { useFavorites } from '../context/FavoritesContext';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';

const FavoritesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end border-b border-gray-800 pb-4">
        <h1 className="text-4xl md:text-6xl font-oswald uppercase">
          {t('common.favorites')} <span className="text-[#ff2e00] text-2xl align-top ml-2">[{favorites.length}]</span>
        </h1>
      </header>

      {favorites.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border border-gray-800 bg-gray-900/20 border-dashed">
          <p className="font-mono text-gray-500 animate-pulse">EMPTY_DRIVE_SECTOR</p>
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