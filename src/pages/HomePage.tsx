import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Movie } from '../types/movie';
import { fetchPopularMovies, searchMovies, matchMovieByMood } from '../services/tmdb';
import { MovieGrid } from '../components/MovieGrid';
import { MovieModal } from '../components/MovieModal';
import { useDebounce } from '../hooks/useDebounce';
import { Sparkles, Loader2 } from 'lucide-react';

interface HomePageProps {
  searchQuery: string;
  onSearchChange?: (query: string) => void;
  onOpenMoodMatcher: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  searchQuery,
  onSearchChange,
  onOpenMoodMatcher,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [inlineMood, setInlineMood] = useState('');
  const [isMatching, setIsMatching] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadMovies = useCallback(async (query: string, pageNum: number, append: boolean = false) => {
    if (pageNum === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const response = query.trim()
        ? await searchMovies(query, pageNum)
        : await fetchPopularMovies(pageNum);

      setTotalPages(response.total_pages || 1);
      setPage(pageNum);

      if (append) {
        setMovies((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const filteredNew = response.results.filter((m) => !existingIds.has(m.id));
          return [...prev, ...filteredNew];
        });
      } else {
        setMovies(response.results);
      }
    } catch (e) {
      console.error('Failed to load movies', e);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadMovies(debouncedSearch, 1, false);
  }, [debouncedSearch, loadMovies]);

  const lastMovieElementRef = useCallback(
    (node: Element | null | undefined) => {
      if (isLoading || isLoadingMore) return;
      if (typeof IntersectionObserver === 'undefined') return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries && entries[0] && entries[0].isIntersecting && page < totalPages) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadMovies(debouncedSearch, nextPage, true);
        }
      }, {
        threshold: 0.2,
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isLoadingMore, page, totalPages, debouncedSearch, loadMovies]
  );

  const handleInlineMoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineMood.trim() || isMatching) return;
    setIsMatching(true);
    try {
      const matched = await matchMovieByMood(inlineMood);
      if (onSearchChange) onSearchChange(matched);
      setInlineMood('');
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="mb-8 p-4 sm:p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-950/50">
              <Sparkles className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white tracking-tight">AI Mood Matcher</span>
                <button
                  type="button"
                  onClick={onOpenMoodMatcher}
                  className="text-[11px] px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/60 hover:text-white transition-colors"
                >
                  Presets
                </button>
              </div>
              <p className="text-xs text-zinc-400">Describe your mood or vibe to discover matching movies</p>
            </div>
          </div>

          <form onSubmit={handleInlineMoodSubmit} className="flex items-center gap-2 w-full md:max-w-md">
            <input
              type="text"
              value={inlineMood}
              onChange={(e) => setInlineMood(e.target.value)}
              placeholder="e.g. cozy rainy day, sad but action..."
              className="flex-1 px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
            <button
              type="submit"
              disabled={isMatching || !inlineMood.trim()}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition-all shrink-0 shadow-md flex items-center space-x-1.5"
            >
              {isMatching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Match</span>
            </button>
          </form>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {debouncedSearch ? `Search Results for "${debouncedSearch}"` : 'Popular Releases'}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {debouncedSearch
                ? `Showing matching titles with 500ms debounced throttling`
                : 'Hydrating on-demand media stream with infinite scroll'}
            </p>
          </div>
        </div>

        <MovieGrid
          movies={movies}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          onSelectMovie={setSelectedMovie}
          observerRef={lastMovieElementRef}
          hasMore={page < totalPages}
        />
      </main>

      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
};
