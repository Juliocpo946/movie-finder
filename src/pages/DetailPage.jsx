import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMediaDetails, DETAILS_STATUS } from '../hooks/useMediaDetails';
import { useSearch, SEARCH_STATUS } from '../hooks/useSearch';
import { useFavorites } from '../context/FavoritesContext';
import Loader from '../components/Loader';
import Button from '../components/Button';
import Card from '../components/Card';
import { getPosterUrl, getRatingColor, translateGenre, translateType } from '../utils';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { details, status, fetchById } = useMediaDetails();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [copied, setCopied] = useState(false);
  
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

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: details.Title,
          text: `Check out ${details.Title} on Movie Finder`,
          url: url,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (status === DETAILS_STATUS.LOADING) {
    return <Loader text="LOADING DATA" />;
  }

  if (!details) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h3 className="text-xl font-mono text-gray-500">[DATA NOT FOUND]</h3>
        <Button onClick={() => navigate(-1)} variant="secondary" className="mt-4">
          GO BACK
        </Button>
      </div>
    );
  }

  const isFav = isFavorite(details.imdbID);
  const posterUrl = getPosterUrl(details.Poster);
  const ratingColor = getRatingColor(details.imdbRating);
  const trailerUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(details.Title + ' official trailer')}`;
  
  const translatedGenre = translateGenre(details.Genre, 'en');
  const translatedType = translateType(details.Type, 'en');

  const filteredRecommendations = recommendations
    .filter((item) => item.imdbID !== details.imdbID)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 space-y-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        <motion.div 
          layoutId={id} 
          className="lg:col-span-4 space-y-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        >
          <div className="border border-gray-200 dark:border-white p-2 bg-white dark:bg-black relative shadow-lg dark:shadow-[12px_12px_0px_#1a1a1a]">
            <img 
              src={posterUrl}
              alt={details.Title}
              className="w-full h-auto dark:grayscale dark:contrast-125 block"
              onError={(e) => {
                e.target.src = 'https://placehold.co/300x450/1a1a1a/ededed?text=No+Poster';
              }}
            />
            <div className="absolute top-4 left-4 bg-[#ff2e00] text-white font-bold px-3 py-1 text-sm font-mono uppercase">
              {translatedType}
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => toggleFavorite(details)}
              className={`w-full py-4 font-bold text-sm tracking-widest border transition-colors duration-500 uppercase font-mono
                ${isFav 
                  ? "bg-green-600 border-green-600 text-white hover:bg-green-700 shadow-lg" 
                  : "bg-white text-black border-gray-300 dark:border-white hover:bg-[#ff2e00] hover:text-white hover:border-[#ff2e00]"
                }`}
            >
              {isFav ? '✓ REMOVE FROM LIST' : 'ADD TO LIST'}
            </button>

            <button 
              onClick={handleShare}
              className="w-full py-4 font-bold text-sm tracking-widest border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors uppercase font-mono"
            >
              {copied ? '✓ LINK COPIED' : 'SHARE TITLE'}
            </button>
            
            <Button 
              onClick={() => navigate(-1)}
              variant="secondary"
              className="w-full"
            >
              {'< GO BACK'}
            </Button>
          </div>
        </motion.div>

        <div className="lg:col-span-8 space-y-10">
          <header className="border-b-4 border-gray-200 dark:border-white pb-8">
            <motion.h1 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-oswald font-bold uppercase leading-none break-words text-black dark:text-white"
            >
              {details.Title}
            </motion.h1>
            <motion.div 
              className="flex flex-wrap items-center gap-6 mt-6 font-mono text-gray-600 dark:text-gray-400 text-sm md:text-base"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1.0 }}
            >
              <span className="bg-gray-200 text-black dark:text-white dark:bg-gray-800 px-2 py-1">{details.Year}</span>
              <span className="text-[#ff2e00]">//</span>
              {details.Rated && details.Rated !== 'N/A' && (
                <>
                  <span className="border border-gray-400 dark:border-gray-600 px-2 rounded-sm">{details.Rated}</span>
                  <span className="text-[#ff2e00]">//</span>
                </>
              )}
              {details.Runtime && details.Runtime !== 'N/A' && (
                <>
                  <span>{details.Runtime}</span>
                  <span className="text-[#ff2e00]">//</span>
                </>
              )}
              {details.imdbRating && details.imdbRating !== 'N/A' && (
                <span style={{ color: ratingColor }} className="font-bold text-lg">
                  {details.imdbRating} IMDb
                </span>
              )}
              {details.Metascore && details.Metascore !== 'N/A' && (
                <>
                  <span className="text-[#ff2e00]">//</span>
                  <span className={`font-bold ${parseInt(details.Metascore) > 60 ? 'text-green-500' : 'text-yellow-500'}`}>
                    {details.Metascore} Metascore
                  </span>
                </>
              )}
            </motion.div>
          </header>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.5, duration: 1.0 }}
          >
            {details.Director && details.Director !== 'N/A' && (
              <DataRow label="DIRECTOR" value={details.Director} />
            )}
            {details.Genre && details.Genre !== 'N/A' && (
              <DataRow label="GENRE" value={translatedGenre} />
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
          </motion.div>

          {details.Plot && details.Plot !== 'N/A' && (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.7, duration: 1.2 }}
              className="font-mono text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 border-l-4 border-[#ff2e00] pl-8 py-2"
            >
              {details.Plot}
            </motion.div>
          )}

          <motion.div 
            className="mt-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.9, duration: 1.0 }}
          >
            <h3 className="text-2xl font-oswald uppercase mb-6 border-b border-gray-200 dark:border-gray-800 pb-4 text-black dark:text-white">
              MEDIA PREVIEW
            </h3>
            <div className="aspect-video w-full bg-black border border-gray-200 dark:border-gray-800 shadow-2xl">
              <iframe 
                width="100%" 
                height="100%" 
                src={trailerUrl}
                title={`${details.Title} trailer`}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="dark:grayscale dark:hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {filteredRecommendations.length > 0 && (
        <motion.div 
          className="pt-20 border-t border-gray-200 dark:border-gray-800 mt-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2, duration: 1.0 }}
        >
          <h3 className="text-3xl font-oswald uppercase mb-10 text-black dark:text-white">
            SIMILAR TITLES <span className="text-[#ff2e00] text-xl align-top ml-2">// RECOMMENDATIONS</span>
          </h3>
          
          {recStatus === SEARCH_STATUS.SUCCESS && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredRecommendations.map((item) => (
                <Card 
                  key={item.imdbID} 
                  item={item} 
                  onClick={(itemId) => navigate(`/movie/${itemId}`)} 
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

const DataRow = ({ label, value }) => (
  <div className="bg-white dark:bg-[#0f0f0f] p-5 flex flex-col gap-2 hover:bg-gray-100 dark:hover:bg-black transition-colors duration-500">
    <span className="text-[10px] text-[#ff2e00] font-mono uppercase tracking-widest">{label}</span>
    <span className="text-gray-900 dark:text-white font-mono text-sm leading-snug">{value}</span>
  </div>
);

export default DetailPage;