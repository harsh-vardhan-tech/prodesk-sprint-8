import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Heart, Sparkles, Search, X } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenMoodMatcher: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenMoodMatcher,
}) => {
  const { favoritesCount } = useFavorites();
  const location = useLocation();
  const isFavoritesRoute = location.pathname === '/favorites';

  return (
    <header className="sticky top-0 z-40 bg-[#141414]/95 backdrop-blur-md border-b border-zinc-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 rounded bg-[#e50914] flex items-center justify-center text-white shadow-lg shadow-red-950/40 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5" />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase font-sans">
            CINE<span className="text-[#e50914]">-STREAM</span>
          </span>
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 justify-end">
          {!isFavoritesRoute && (
            <div className="relative flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search movies..."
                  className="w-40 sm:w-64 md:w-80 pl-9 pr-8 py-1.5 bg-zinc-900/90 border border-zinc-700 rounded-full text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] transition-all"
                />
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          <button
            onClick={onOpenMoodMatcher}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-900/70 to-indigo-900/70 border border-purple-500/40 text-purple-200 text-xs sm:text-sm font-medium hover:border-purple-400 hover:text-white transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline">AI Mood Matcher</span>
            <span className="md:hidden">Mood</span>
          </button>

          <Link
            to="/favorites"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all ${
              isFavoritesRoute
                ? 'bg-[#e50914] text-white border-[#e50914]'
                : 'bg-zinc-900/90 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-current text-[#e50914]' : ''} ${isFavoritesRoute ? 'text-white fill-current' : ''}`} />
            <span className="hidden sm:inline">Favorites</span>
            {favoritesCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-zinc-800 text-zinc-200 text-xs rounded-full font-mono">
                {favoritesCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};
