import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  );
};

export default Layout;