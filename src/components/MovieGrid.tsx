import React from 'react';
import type { Movie } from '../types/movie';
import { MovieCard } from './MovieCard';
import { Film, Loader2 } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
  isLoading: boolean;
  isLoadingMore?: boolean;
  onSelectMovie: (movie: Movie) => void;
  observerRef?: (node?: Element | null) => void;
  hasMore?: boolean;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  isLoading,
  isLoadingMore = false,
  onSelectMovie,
  observerRef,
  hasMore = false,
}) => {
  if (isLoading && movies.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[2/3] bg-zinc-900 rounded-md animate-pulse border border-zinc-800"
          />
        ))}
      </div>
    );
  }

  if (!isLoading && movies.length === 0) {
    return (
      <div className="text-center py-24 px-4 bg-zinc-900/40 rounded-xl border border-zinc-800 my-8">
        <Film className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">No movies found</h3>
        <p className="text-sm text-zinc-400 max-w-sm mx-auto">
          We couldn't find any titles matching your query. Try a different search term or explore trending movies.
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Movies Catalog">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} />
        ))}
      </div>

      {/* Infinite Scroll Sentinel */}
      {observerRef && hasMore && (
        <div
          ref={observerRef}
          className="w-full py-12 flex items-center justify-center text-zinc-400"
        >
          {isLoadingMore ? (
            <div className="flex items-center space-x-2 text-sm font-medium">
              <Loader2 className="w-5 h-5 animate-spin text-[#e50914]" />
              <span>Hydrating next page...</span>
            </div>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}
    </section>
  );
};
