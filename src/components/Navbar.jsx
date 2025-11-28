import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();

  const links = [
    { path: '/', label: 'HOME' },
    { path: '/favorites', label: 'SAVED_FILES' }
  ];

  const changeLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tighter uppercase font-oswald text-white flex items-center gap-2 select-none">
          <span className="w-3 h-3 bg-[#ff2e00] animate-pulse" />
          OMDb_TERMINAL
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          {links.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`text-xs md:text-sm font-mono tracking-widest hover:text-[#ff2e00] transition-colors relative ${location.pathname === link.path ? 'text-white' : 'text-gray-500'}`}
            >
              {location.pathname === link.path && (
                <motion.span 
                  layoutId="underline" 
                  className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#ff2e00]"
                />
              )}
              {t(`common.${link.label.toLowerCase() === 'home' ? 'search' : 'favorites'}`)}
            </Link>
          ))}
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
            <button onClick={changeLanguage} className="text-[10px] md:text-xs font-mono text-gray-400 hover:text-white uppercase">
              [{i18n.language}]
            </button>
            <button onClick={toggleTheme} className="text-[10px] md:text-xs font-mono text-gray-400 hover:text-white uppercase">
              [{isDark ? 'LGT' : 'DRK'}]
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;