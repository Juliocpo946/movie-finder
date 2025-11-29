import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    // SE AGREGO 'pt-32' para evitar el Navbar y 'min-h-screen' para altura completa
    <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-6 bg-gray-100 dark:bg-[#0a0a0a]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        <h1 className="text-9xl font-oswald font-bold text-[#ff2e00] select-none mix-blend-difference">
          404
        </h1>
        <div className="space-y-4">
          <h2 className="text-2xl md:text-4xl font-oswald text-black dark:text-white uppercase tracking-widest">
            PAGE NOT FOUND
          </h2>
          <div className="h-px bg-gray-300 dark:bg-gray-800 w-24 mx-auto" />
          <p className="font-mono text-gray-600 dark:text-gray-400 max-w-md mx-auto text-sm md:text-base">
            The coordinates you are looking for do not exist in this sector of the galaxy.
          </p>
        </div>
        <div className="pt-8">
          <Button onClick={() => navigate('/')} className="bg-black text-white hover:bg-[#ff2e00] dark:bg-white dark:text-black dark:hover:bg-[#ff2e00] dark:hover:text-white">
            RETURN TO BASE
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;