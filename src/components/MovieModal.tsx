import React, { useEffect } from 'react';
import { X, Heart, Star, Calendar, Users, Film } from 'lucide-react';
import type { Movie } from '../types/movie';
import { TMDB_BACKDROP_BASE, TMDB_IMAGE_BASE } from '../services/tmdb';
import { useFavorites } from '../context/FavoritesContext';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (movie) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [movie, onClose]);

  if (!movie) return null;

  const favorite = isFavorite(movie.id);
  const backdropUrl = movie.backdrop_path
    ? `${TMDB_BACKDROP_BASE}${movie.backdrop_path}`
    : movie.poster_path
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="movie-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-zinc-900 border border-zinc-800 rounded-lg max-w-2xl w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Backdrop Banner */}
        <div className="relative aspect-video w-full bg-zinc-950">
          {backdropUrl ? (
            <img
              src={backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600">
              <Film className="w-16 h-16 opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 -mt-12 relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="movie-modal-title"
                className="text-2xl sm:text-3xl font-black text-white tracking-tight"
              >
                {movie.title}
              </h2>
              <div className="flex items-center space-x-4 mt-2 text-xs sm:text-sm text-zinc-400 font-mono">
                <span className="flex items-center text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 mr-1" />
                  {movie.vote_average.toFixed(1)} / 10
                </span>
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-zinc-500" />
                  {movie.release_date || 'Release Date Unknown'}
                </span>
                <span className="flex items-center">
                  <Users className="w-3.5 h-3.5 mr-1 text-zinc-500" />
                  {movie.vote_count.toLocaleString()} votes
                </span>
              </div>
            </div>

            {/* Favorite Action Button */}
            <button
              onClick={() => toggleFavorite(movie)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all border ${
                favorite
                  ? 'bg-[#e50914] text-white border-[#e50914]'
                  : 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:border-zinc-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
              <span>{favorite ? 'Saved' : 'Add to Favorites'}</span>
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800">
            <h4 className="text-xs uppercase font-semibold text-zinc-400 tracking-wider mb-2">
              Overview
            </h4>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {movie.overview || 'No synopsis provided for this title.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
