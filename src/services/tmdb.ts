import axios from 'axios';
import type { Movie, TMDBResponse } from '../types/movie';
import {
  FALLBACK_MOVIES_PAGE_1,
  FALLBACK_MOVIES_PAGE_2,
  FALLBACK_MOVIES_PAGE_3,
} from '../data/fallbackMovies';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
export const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

const getApiKey = (): string | undefined => {
  return (
    import.meta.env.VITE_TMDB_API_KEY ||
    import.meta.env.VITE_TMDB_KEY ||
    undefined
  );
};

const getFallbackPage = (page: number): Movie[] => {
  if (page === 1) return FALLBACK_MOVIES_PAGE_1;
  if (page === 2) return FALLBACK_MOVIES_PAGE_2;
  if (page === 3) return FALLBACK_MOVIES_PAGE_3;
  return [];
};

export const fetchPopularMovies = async (page: number = 1): Promise<TMDBResponse> => {
  const apiKey = getApiKey();

  if (apiKey) {
    try {
      const response = await axios.get<TMDBResponse>(`${TMDB_BASE_URL}/movie/popular`, {
        params: {
          api_key: apiKey,
          page,
          include_adult: false,
        },
        timeout: 6000,
      });
      return response.data;
    } catch {
      return getFallbackPage(page).length ? { page, results: getFallbackPage(page), total_pages: 3, total_results: 20 } : { page, results: [], total_pages: 0, total_results: 0 };
    }
  }

  const results = getFallbackPage(page);
  return {
    page,
    results,
    total_pages: 3,
    total_results: 20,
  };
};

export const searchMovies = async (query: string, page: number = 1): Promise<TMDBResponse> => {
  const apiKey = getApiKey();
  const trimmed = query.trim().toLowerCase();

  if (!trimmed) {
    return fetchPopularMovies(page);
  }

  if (apiKey) {
    try {
      const response = await axios.get<TMDBResponse>(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          api_key: apiKey,
          query: trimmed,
          page,
          include_adult: false,
        },
        timeout: 6000,
      });
      return response.data;
    } catch {
      return getFallbackPage(page).length ? { page, results: getFallbackPage(page), total_pages: 3, total_results: 20 } : { page, results: [], total_pages: 0, total_results: 0 };
    }
  }

  const allFallback = [
    ...FALLBACK_MOVIES_PAGE_1,
    ...FALLBACK_MOVIES_PAGE_2,
    ...FALLBACK_MOVIES_PAGE_3,
  ];

  const matched = allFallback.filter(
    (m) =>
      m.title.toLowerCase().includes(trimmed) ||
      m.overview.toLowerCase().includes(trimmed)
  );

  return {
    page: 1,
    results: matched,
    total_pages: 1,
    total_results: matched.length,
  };
};

export const matchMovieByMood = async (moodQuery: string): Promise<string> => {
  const query = moodQuery.toLowerCase();
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      const prompt = `Suggest ONE movie based on this mood: "${moodQuery}". Return ONLY the movie title as a plaintext string with no formatting, markdown, or punctuation.`;
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        { timeout: 5000 }
      );

      const title = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (title) return title.replace(/['"]+/g, '');
    } catch {
      return 'Dune: Part Two';
    }
  }

  if (query.includes('sad') && (query.includes('action') || query.includes('fight'))) {
    return 'Deadpool & Wolverine';
  }
  if (query.includes('sad') || query.includes('cry') || query.includes('depress') || query.includes('emotional')) {
    return 'The Shawshank Redemption';
  }
  if (query.includes('space') || query.includes('science') || query.includes('cosmos') || query.includes('universe')) {
    return 'Interstellar';
  }
  if (query.includes('mind') || query.includes('dream') || query.includes('puzzle') || query.includes('twist')) {
    return 'Inception';
  }
  if (query.includes('happy') || query.includes('fun') || query.includes('family') || query.includes('kid')) {
    return 'Inside Out 2';
  }
  if (query.includes('action') || query.includes('adrenaline') || query.includes('chase') || query.includes('car')) {
    return 'Mad Max: Fury Road';
  }
  if (query.includes('superhero') || query.includes('spider') || query.includes('hero') || query.includes('comic')) {
    return 'Spider-Man: Across the Spider-Verse';
  }
  if (query.includes('dark') || query.includes('crime') || query.includes('batman') || query.includes('gotham')) {
    return 'The Dark Knight';
  }
  if (query.includes('weird') || query.includes('multiverse') || query.includes('chaos') || query.includes('crazy')) {
    return 'Everything Everywhere All at Once';
  }

  return 'Dune: Part Two';
};
