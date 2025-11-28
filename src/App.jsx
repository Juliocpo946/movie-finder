import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, FavoritesProvider } from './context';
import router from './routes';

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <RouterProvider router={router} />
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;