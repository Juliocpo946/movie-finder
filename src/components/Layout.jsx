import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-100 text-gray-900 dark:bg-[#0a0a0a] dark:text-[#ededed]">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  );
};

export default Layout;