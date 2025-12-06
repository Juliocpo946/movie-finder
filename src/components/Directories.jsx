import { TMDB_GENRES } from '../utils/constants';

const Directories = ({ navigate }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-oswald text-gray-900 dark:text-white uppercase tracking-widest border-l-4 border-[#ff2e00] pl-4">
        SYSTEM DIRECTORIES
      </h2>
      <div className="flex flex-wrap gap-4">
        {TMDB_GENRES.slice(0, 10).map((genre) => (
          <button
            key={genre.id}
            onClick={() => navigate(`/search?genre=${genre.id}`)}
            className="group relative px-6 py-3 bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 hover:border-[#ff2e00] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#ff2e00] opacity-0 group-hover:opacity-100 transition-opacity">
                {'>'}
              </span>
              <span className="font-mono text-sm font-bold text-gray-700 dark:text-gray-300 uppercase">
                {genre.name}
              </span>
            </div>
            <div className="absolute top-0 right-0 w-2 h-2 bg-gray-400 dark:bg-gray-700 group-hover:bg-[#ff2e00] transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Directories;