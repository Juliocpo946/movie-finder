import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useMediaDetails, DETAILS_STATUS } from '../hooks/useMediaDetails';
import { useSearch, SEARCH_STATUS } from '../hooks/useSearch';
import { useFavorites } from '../context/FavoritesContext';
import Loader from '../components/Loader';
import Button from '../components/Button';
import Card from '../components/Card';
import { getPosterUrl, getRatingColor } from '../utils';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { details, status, fetchById } = useMediaDetails();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const { 
    results: recommendations, 
    search: searchRecommendations, 
    status: recStatus 
  } = useSearch();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      fetchById(id);
    }
  }, [id, fetchById]);

  useEffect(() => {
    if (details && details.Title) {
      const searchTerm = details.Title.split(':')[0].split(' ')[0];
      searchRecommendations(searchTerm, { type: details.Type });
    }
  }, [details, searchRecommendations]);

  if (status === DETAILS_STATUS.LOADING) {
    return <Loader text="LOADING_DATA" />;
  }

  if (!details) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-xl font-mono text-gray-500">[DATA_NOT_FOUND]</h3>
        <Button onClick={() => navigate(-1)} variant="secondary" className="mt-4">
          GO_BACK
        </Button>
      </div>
    );
  }

  const isFav = isFavorite(details.imdbID);
  const posterUrl = getPosterUrl(details.Poster);
  const ratingColor = getRatingColor(details.imdbRating);
  const trailerUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(details.Title + ' official trailer')}`;

  const filteredRecommendations = recommendations
    .filter((item) => item.imdbID !== details.imdbID)
    .slice(0, 5);

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        <motion.div layoutId={id} className="lg:col-span-4">
          <div className="border border-white p-2 bg-black relative shadow-[8px_8px_0px_#1a1a1a]">
            <img 
              src={posterUrl}
              alt={details.Title}
              className="w-full h-auto grayscale contrast-125 block"
              onError={(e) => {
                e.target.src = 'https://placehold.co/300x450/1a1a1a/ededed?text=No+Poster';
              }}
            />
            <div className="absolute top-4 left-4 bg-[#ff2e00] text-black px-2 py-1 font-bold text-xs font-mono uppercase">
              {details.Type}
            </div>
          </div>
          
          <div className="mt-8 flex flex-col gap-4">
            <Button 
              onClick={() => toggleFavorite(details)}
              variant={isFav ? "danger" : "primary"}
              className="w-full"
            >
              {isFav ? 'REMOVE_FROM_LIST' : 'ADD_TO_LIST'}
            </Button>
            <Button 
              onClick={() => navigate(-1)}
              variant="secondary"
              className="w-full"
            >
              {'< ' + t('common.go_back')}
            </Button>
          </div>
        </motion.div>

        <div className="lg:col-span-8 space-y-8">
          <header className="border-b-4 border-white pb-6">
            <motion.h1 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-5xl md:text-7xl font-oswald font-bold uppercase leading-none"
            >
              {details.Title}
            </motion.h1>
            <div className="flex flex-wrap gap-4 mt-4 font-mono text-gray-400 text-sm md:text-base">
              <span className="text-white bg-gray-800 px-1">{details.Year}</span>
              <span>//</span>
              {details.Runtime && details.Runtime !== 'N/A' && (
                <>
                  <span>{details.Runtime}</span>
                  <span>//</span>
                </>
              )}
              {details.imdbRating && details.imdbRating !== 'N/A' && (
                <span style={{ color: ratingColor }} className="font-bold">
                  {details.imdbRating} IMDb
                </span>
              )}
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-800 border border-gray-800">
            {details.Director && details.Director !== 'N/A' && (
              <DataRow label="DIRECTOR" value={details.Director} />
            )}
            {details.Genre && details.Genre !== 'N/A' && (
              <DataRow label="GENRE" value={details.Genre} />
            )}
            {details.Actors && details.Actors !== 'N/A' && (
              <DataRow label="CAST" value={details.Actors} />
            )}
            {details.Awards && details.Awards !== 'N/A' && (
              <DataRow label="AWARDS" value={details.Awards} />
            )}
            {details.Country && details.Country !== 'N/A' && (
              <DataRow label="COUNTRY" value={details.Country} />
            )}
            {details.Language && details.Language !== 'N/A' && (
              <DataRow label="LANGUAGE" value={details.Language} />
            )}
          </div>

          {details.Plot && details.Plot !== 'N/A' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-mono text-base md:text-lg leading-relaxed text-gray-300 border-l-2 border-[#ff2e00] pl-6"
            >
              {details.Plot}
            </motion.div>
          )}

          {details.Ratings && details.Ratings.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {details.Ratings.map((rating, index) => (
                <div key={index} className="bg-gray-900 border border-gray-800 px-4 py-2">
                  <span className="text-xs text-gray-500 font-mono block">{rating.Source}</span>
                  <span className="text-white font-bold font-mono">{rating.Value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12">
            <h3 className="text-xl font-oswald uppercase mb-4 border-b border-gray-800 pb-2">
              MEDIA_PREVIEW
            </h3>
            <div className="aspect-video w-full bg-gray-900 border border-gray-800">
              <iframe 
                width="100%" 
                height="100%" 
                src={trailerUrl}
                title={`${details.Title} trailer`}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {filteredRecommendations.length > 0 && (
        <div className="pt-12 border-t border-gray-800">
          <h3 className="text-2xl font-oswald uppercase mb-8">
            SIMILAR_TITLES <span className="text-[#ff2e00] text-lg align-top">// RECOMMENDATIONS</span>
          </h3>
          
          {recStatus === SEARCH_STATUS.SUCCESS && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredRecommendations.map((item) => (
                <Card 
                  key={item.imdbID} 
                  item={item} 
                  onClick={(itemId) => navigate(`/movie/${itemId}`)} 
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const DataRow = ({ label, value }) => (
  <div className="bg-[#0f0f0f] p-4 flex flex-col gap-1 hover:bg-black transition-colors">
    <span className="text-[10px] text-[#ff2e00] font-mono uppercase tracking-widest">{label}</span>
    <span className="text-white font-mono text-sm">{value}</span>
  </div>
);

export default DetailPage;