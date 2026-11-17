import React, { useState } from 'react';
import { Heart, Star, Film } from 'lucide-react';
import type { Movie } from '../types/movie';
import { TMDB_IMAGE_BASE } from '../services/tmdb';
import { useFavorites } from '../context/FavoritesContext';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imageError, setImageError] = useState(false);
  const favorite = isFavorite(movie.id);

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A';

  const posterUrl = movie.poster_path && !imageError
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : null;

  return (
    <article
      onClick={() => onSelect(movie)}
      className="group relative bg-zinc-900 rounded-md overflow-hidden border border-zinc-800/80 hover:border-zinc-600 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/80 cursor-pointer flex flex-col"
    >
      <div className="relative aspect-[2/3] w-full bg-zinc-800 overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-zinc-800/80 text-zinc-500">
            <Film className="w-10 h-10 mb-2 opacity-40 text-zinc-400" />
            <span className="text-xs font-medium text-zinc-400 line-clamp-2">
              {movie.title}
            </span>
            <span className="text-[10px] text-zinc-600 mt-1">No Poster Available</span>
          </div>
        )}

        <button
          type="button"
          aria-label={favorite ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(movie);
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/90 transition-all z-10 hover:scale-110 active:scale-95"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorite ? 'fill-[#e50914] text-[#e50914]' : 'text-zinc-300 hover:text-white'
            }`}
          />
        </button>

        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[11px] font-semibold text-amber-400 flex items-center space-x-1">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}</span>
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <h3 className="text-sm font-semibold text-white tracking-tight line-clamp-1 group-hover:text-[#e50914] transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between mt-1 text-xs text-zinc-400 font-mono">
          <span>{releaseYear}</span>
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">
            {movie.vote_count ? `${movie.vote_count.toLocaleString()} votes` : ''}
          </span>
        </div>
      </div>
    </article>
  );
};
