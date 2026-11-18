import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { matchMovieByMood } from '../services/tmdb';

describe('Cine-Stream Media Discovery Architecture', () => {
  beforeEach(() => {
    window.location.hash = '';
    window.history.pushState({}, '', '/');
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Core Media Discovery and Cards', () => {
    it('renders the Cine-Stream brand header and navigation elements', () => {
      render(<App />);
      expect(screen.getByRole('link', { name: /cine-stream/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/search movies\.\.\./i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /favorites/i })).toBeInTheDocument();
    });

    it('renders movie cards with title, release year, star rating, and lazy loading', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Deadpool & Wolverine')).toBeInTheDocument();
      });

      expect(screen.getByText('Dune: Part Two')).toBeInTheDocument();
      expect(screen.getAllByText(/7\.7|8\.2/i).length).toBeGreaterThan(0);

      const images = screen.getAllByRole('img');
      const lazyImages = images.filter((img) => img.getAttribute('loading') === 'lazy');
      expect(lazyImages.length).toBeGreaterThan(0);
    });
  });

  describe('Search and Favorites Persistence', () => {
    it('handles search input and updates query display', async () => {
      render(<App />);
      const searchInput = screen.getByPlaceholderText(/search movies\.\.\./i);

      await userEvent.type(searchInput, 'Interstellar');

      await waitFor(
        () => {
          expect(screen.getByText('Interstellar')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('toggles movie into favorites and syncs with localStorage', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Deadpool & Wolverine')).toBeInTheDocument();
      });

      const heartButton = screen.getByRole('button', {
        name: /add deadpool & wolverine to favorites/i,
      });

      await userEvent.click(heartButton);

      const stored = JSON.parse(localStorage.getItem('cine_stream_favorites') || '[]');
      expect(stored.length).toBe(1);
      expect(stored[0].title).toBe('Deadpool & Wolverine');

      const favoritesLink = screen.getByRole('link', { name: /favorites/i });
      await userEvent.click(favoritesLink);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /my favorites/i })).toBeInTheDocument();
      });

      expect(screen.getByText('Deadpool & Wolverine')).toBeInTheDocument();
    });
  });

  describe('AI Mood Matcher and Movie Details', () => {
    it('opens AI Mood Matcher modal and suggests matching movie', async () => {
      render(<App />);
      const moodButton = screen.getByRole('button', { name: /ai mood matcher|mood/i });
      await userEvent.click(moodButton);

      expect(screen.getByRole('heading', { name: /ai mood matcher/i })).toBeInTheDocument();

      const textarea = screen.getByPlaceholderText(/i had a long day and want a cozy/i);
      await userEvent.type(textarea, 'I am feeling sad but want an action movie');

      const matchButton = screen.getByRole('button', { name: /match my mood/i });
      await userEvent.click(matchButton);

      await waitFor(() => {
        expect(screen.getByText(/"Deadpool & Wolverine"/i)).toBeInTheDocument();
      });

      const discoverButton = screen.getByRole('button', { name: /discover/i });
      await userEvent.click(discoverButton);

      const searchInput = screen.getByPlaceholderText(/search movies\.\.\./i) as HTMLInputElement;
      expect(searchInput.value).toBe('Deadpool & Wolverine');
    });

    it('resolves semantic mood heuristics correctly', async () => {
      const spaceResult = await matchMovieByMood('I want a space odyssey about time');
      expect(spaceResult).toBe('Interstellar');

      const mindResult = await matchMovieByMood('A deep mind bending dream thriller');
      expect(mindResult).toBe('Inception');
    });

    it('opens detail modal on movie card click and closes on escape/close button', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Dune: Part Two')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByText('Dune: Part Two'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      expect(screen.getByRole('heading', { name: 'Dune: Part Two', level: 2 })).toBeInTheDocument();
      expect(screen.getByText(/overview/i)).toBeInTheDocument();

      const closeBtn = screen.getByRole('button', { name: /close dialog/i });
      await userEvent.click(closeBtn);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });
});
