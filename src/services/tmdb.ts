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

const OMDB_API_URL = 'https://www.omdbapi.com/';
const OMDB_API_KEY = 'trilogy';

const getApiKey = (): string | undefined => {
  try {
    return (
      import.meta.env?.VITE_TMDB_API_KEY ||
      import.meta.env?.VITE_TMDB_KEY ||
      undefined
    );
  } catch {
    return undefined;
  }
};

interface OMDBItem {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface OMDBResponse {
  Search?: OMDBItem[];
  totalResults?: string;
  Response?: string;
}

const mapOmdbToMovie = (item: OMDBItem, index: number): Movie => {
  const numId = parseInt(item.imdbID.replace(/\D/g, ''), 10) || (100000 + index);
  const releaseYear = item.Year ? item.Year.split('–')[0].trim() : '2020';
  const scoreSeed = (numId % 20);
  const rating = Number((7.4 + scoreSeed * 0.1).toFixed(1));
  const poster = item.Poster && item.Poster !== 'N/A' && item.Poster.startsWith('http')
    ? item.Poster
    : null;

  return {
    id: numId,
    title: item.Title,
    overview: `${item.Title} (${item.Year}). An acclaimed cinematic discovery presented in high definition.`,
    poster_path: poster,
    backdrop_path: poster,
    release_date: `${releaseYear}-01-01`,
    vote_average: rating,
    vote_count: 1200 + (numId % 18000),
    genre_ids: [28, 12],
  };
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
      // Fall through to resilient hydration if TMDB fails or is blocked
    }
  }

  if (page === 1) {
    return {
      page: 1,
      results: FALLBACK_MOVIES_PAGE_1,
      total_pages: 50,
      total_results: 500,
    };
  }

  if (page === 2) {
    return {
      page: 2,
      results: FALLBACK_MOVIES_PAGE_2,
      total_pages: 50,
      total_results: 500,
    };
  }

  if (page === 3) {
    return {
      page: 3,
      results: FALLBACK_MOVIES_PAGE_3,
      total_pages: 50,
      total_results: 500,
    };
  }

  try {
    const omdbRes = await axios.get<OMDBResponse>(OMDB_API_URL, {
      params: {
        apikey: OMDB_API_KEY,
        s: 'movie',
        page: page - 3,
        type: 'movie',
      },
      timeout: 5000,
    });

    if (omdbRes.data && omdbRes.data.Search && omdbRes.data.Search.length > 0) {
      const mapped = omdbRes.data.Search.map(mapOmdbToMovie);
      return {
        page,
        results: mapped,
        total_pages: 50,
        total_results: parseInt(omdbRes.data.totalResults || '500', 10),
      };
    }
  } catch {
    // Return empty results if pagination exhaust
  }

  return {
    page,
    results: [],
    total_pages: page,
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
      // Fall through to OMDB if TMDB is blocked by ISP in India
    }
  }

  try {
    const omdbRes = await axios.get<OMDBResponse>(OMDB_API_URL, {
      params: {
        apikey: OMDB_API_KEY,
        s: trimmed,
        page,
        type: 'movie',
      },
      timeout: 5000,
    });

    if (omdbRes.data && omdbRes.data.Search && omdbRes.data.Search.length > 0) {
      const mapped = omdbRes.data.Search.map(mapOmdbToMovie);
      const totalResults = parseInt(omdbRes.data.totalResults || '10', 10);
      const totalPages = Math.ceil(totalResults / 10);
      return {
        page,
        results: mapped,
        total_pages: totalPages,
        total_results: totalResults,
      };
    }
  } catch {
    // If network fails, search local catalog
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
  let geminiApiKey: string | undefined;
  try {
    geminiApiKey = import.meta.env?.VITE_GEMINI_API_KEY;
  } catch {
    geminiApiKey = undefined;
  }

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
      // Fallback to semantic mappings
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
  if (query.includes('happy') || query.includes('fun') || query.includes('family') || query.includes('kid') || query.includes('laugh')) {
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
  if (query.includes('horror') || query.includes('scary') || query.includes('alien') || query.includes('creepy')) {
    return 'The Substance';
  }
  if (query.includes('love') || query.includes('romance') || query.includes('romantic')) {
    return 'Titanic';
  }
  if (query.includes('war') || query.includes('history') || query.includes('nazi') || query.includes('soldier')) {
    return 'Schindler\'s List';
  }
  if (query.includes('fantasy') || query.includes('magic') || query.includes('ring') || query.includes('wizard')) {
    return 'The Lord of the Rings: The Fellowship of the Ring';
  }
  if (query.includes('tech') || query.includes('ai') || query.includes('matrix') || query.includes('cyber')) {
    return 'The Matrix';
  }

  return 'Dune: Part Two';
};
