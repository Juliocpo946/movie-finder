import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] selection:bg-[#ff2e00] selection:text-black">
      <Navbar />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen border-l border-r border-gray-900 bg-[#0a0a0a]"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default Layout;