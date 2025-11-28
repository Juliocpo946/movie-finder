import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useMediaDetails, DETAILS_STATUS } from '../hooks/useMediaDetails';
import { useSearch, SEARCH_STATUS } from '../hooks/useSearch'; // Reutilizamos search para recomendaciones
import { useFavorites } from '../context/FavoritesContext';
import Loader from '../components/Loader';
import Button from '../components/Button';
import Card from '../components/Card';
import { PLACEHOLDER_IMAGE } from '../utils';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { details, status, fetchById } = useMediaDetails();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Hook para buscar recomendaciones
  const { 
    results: recommendations, 
    search: searchRecommendations, 
    status: recStatus 
  } = useSearch();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll top al cambiar de peli
    if (id) fetchById(id);
  }, [id, fetchById]);

  // Efecto para cargar recomendaciones cuando tenemos los detalles
  useEffect(() => {
    if (details && details.Genre) {
      // Tomamos el primer género (ej: "Action") y el año para buscar algo similar
      const firstGenre = details.Genre.split(',')[0].trim();
      // Buscamos películas de ese género
      searchRecommendations(`${firstGenre} movie`);
    }
  }, [details, searchRecommendations]);

  if (status === DETAILS_STATUS.LOADING) return <Loader text="RETRIEVING_ARCHIVE" />;
  if (!details) return null;

  const isFav = isFavorite(details.imdbID);
  // Construcción URL trailer (Búsqueda en YouTube embebida)
  const trailerSrc = `https://www.youtube.com/embed?listType=search&list=${details.Title} trailer`;

  return (
    <div className="space-y-16">
      {/* SECCIÓN SUPERIOR: DETALLES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        {/* COLUMNA IZQUIERDA: PÓSTER Y ACCIONES */}
        <motion.div layoutId={id} className="lg:col-span-4">
          <div className="border border-white p-2 bg-black relative shadow-[8px_8px_0px_#1a1a1a]">
            <img 
              src={details.Poster !== 'N/A' ? details.Poster : PLACEHOLDER_IMAGE}
              alt={details.Title}
              className="w-full h-auto grayscale contrast-125 block"
            />
            <div className="absolute top-4 left-4 bg-[#ff2e00] text-black px-2 py-1 font-bold text-xs font-mono">
              {details.Type.toUpperCase()}
            </div>
          </div>
          
          <div className="mt-8 flex flex-col gap-4">
            <Button 
              onClick={() => toggleFavorite(details)}
              variant={isFav ? "danger" : "primary"}
              className="w-full"
            >
              {isFav ? 'DELETE_FROM_DRIVE' : 'SAVE_TO_DRIVE'}
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

        {/* COLUMNA DERECHA: INFO */}
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
              <span>{details.Runtime}</span>
              <span>//</span>
              <span className="text-[#ff2e00] font-bold">{details.imdbRating} RTG</span>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-800 border border-gray-800">
            <DataRow label="DIRECTOR" value={details.Director} />
            <DataRow label="GENRE" value={details.Genre} />
            <DataRow label="ACTORS" value={details.Actors} />
            <DataRow label="AWARDS" value={details.Awards} />
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-mono text-base md:text-lg leading-relaxed text-gray-300 border-l-2 border-[#ff2e00] pl-6"
          >
            {details.Plot}
          </motion.div>

          {/* TRÁILER EMBEBIDO */}
          <div className="mt-12">
            <h3 className="text-xl font-oswald uppercase mb-4 border-b border-gray-800 pb-2">
              MEDIA_PREVIEW
            </h3>
            <div className="aspect-video w-full bg-gray-900 border border-gray-800">
              <iframe 
                width="100%" 
                height="100%" 
                src={trailerSrc}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: RECOMENDACIONES */}
      <div className="pt-12 border-t border-gray-800">
        <h3 className="text-2xl font-oswald uppercase mb-8">
          RELATED_ARCHIVES <span className="text-[#ff2e00] text-lg align-top">// BASED ON GENRE</span>
        </h3>
        
        {recStatus === SEARCH_STATUS.SUCCESS && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations.slice(0, 5).map((item) => (
              <Card 
                key={item.imdbID} 
                item={item} 
                onClick={(id) => navigate(`/movie/${id}`)} 
              />
            ))}
          </div>
        )}
      </div>
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