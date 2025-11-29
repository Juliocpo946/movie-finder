import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMediaDetails, DETAILS_STATUS } from '../hooks/useMediaDetails';
import { useFavorites } from '../context/FavoritesContext';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { getPosterUrl, getRatingColor } from '../utils';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { details, status, fetchById } = useMediaDetails();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) fetchById(id);
  }, [id, fetchById]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: details.Title, url }); } 
      catch (err) { console.log(err); }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (status === DETAILS_STATUS.LOADING) return <Loader />;
  if (!details) return null;

  const isFav = isFavorite(details.imdbID);
  const ratingColor = getRatingColor(details.imdbRating);
  
  // Buscar el trailer oficial de Youtube
  const trailer = details.Videos?.find(v => v.site === 'YouTube' && v.type === 'Trailer') || details.Videos?.[0];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
      {/* Backdrop de fondo */}
      {details.Backdrop && (
        <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
          <img src={details.Backdrop} alt="" className="w-full h-full object-cover grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>
      )}

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <motion.div layoutId={id} className="lg:col-span-4 space-y-6">
          <img 
            src={getPosterUrl(details.Poster)} 
            alt={details.Title}
            className="w-full shadow-2xl border border-white/10" 
          />
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => toggleFavorite(details)}
              className={`w-full py-4 font-bold text-xs tracking-widest border uppercase transition-colors
                ${isFav ? "bg-green-600 border-green-600 text-white" : "bg-white text-black border-white hover:bg-[#ff2e00] hover:border-[#ff2e00] hover:text-white"}`}
            >
              {isFav ? '✓ IN WATCHLIST' : '+ ADD TO WATCHLIST'}
            </button>
            <button 
              onClick={handleShare}
              className="w-full py-4 font-bold text-xs tracking-widest border border-gray-700 bg-black/50 text-white hover:bg-white hover:text-black uppercase transition-colors"
            >
              {copied ? 'COPIED!' : 'SHARE TITLE'}
            </button>
          </div>
        </motion.div>

        <div className="lg:col-span-8 space-y-8">
          <header>
            <h1 className="text-6xl font-oswald font-bold text-white uppercase leading-none mb-4">{details.Title}</h1>
            <div className="flex flex-wrap gap-4 text-sm font-mono text-gray-400 items-center">
              <span className="text-white border border-gray-600 px-2">{details.Year}</span>
              <span>{details.Runtime}</span>
              <span style={{ color: ratingColor }} className="font-bold text-lg">★ {details.imdbRating}</span>
              <span className="text-[#ff2e00]">{details.Genre}</span>
            </div>
          </header>

          <p className="text-lg text-gray-300 font-mono leading-relaxed border-l-4 border-[#ff2e00] pl-6">
            {details.Plot}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono text-gray-400">
            <div><span className="text-white block mb-1 uppercase text-xs tracking-widest">Director</span> {details.Director}</div>
            <div><span className="text-white block mb-1 uppercase text-xs tracking-widest">Cast</span> {details.Actors}</div>
          </div>

          {trailer && (
            <div className="mt-12">
              <h3 className="text-xl font-oswald text-white uppercase mb-4">Official Trailer</h3>
              <div className="aspect-video w-full bg-black border border-gray-800">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="Trailer"
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;