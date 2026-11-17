import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Film, ArrowLeft } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { MovieCard } from '../components/MovieCard';
import { MovieModal } from '../components/MovieModal';
import type { Movie } from '../types/movie';

export const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh]">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
        <div>
          <Link
            to="/"
            className="inline-flex items-center text-xs font-medium text-zinc-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Explore
          </Link>
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 fill-[#e50914] text-[#e50914]" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              My Favorites
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Persisted in browser localStorage across sessions.
          </p>
        </div>

        <div className="text-xs font-mono text-zinc-400 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
          {favorites.length} {favorites.length === 1 ? 'Title Saved' : 'Titles Saved'}
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-24 px-4 bg-zinc-900/40 rounded-xl border border-zinc-800">
          <Film className="w-14 h-14 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-1">Your Watchlist is Empty</h3>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto mb-6">
            Click the heart icon on any movie poster to curate your personal favorites list.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-5 py-2.5 rounded bg-[#e50914] text-white text-sm font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-950/40"
          >
            Explore Trending Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={setSelectedMovie}
            />
          ))}
        </div>
      )}

      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </main>
  );
};
