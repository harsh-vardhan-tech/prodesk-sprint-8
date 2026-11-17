# Prompts Log — AI Assistance & Pair Programming

This document contains the sequence of prompts used during the development of Cine-Stream to explain concepts, improve CSS styling, troubleshoot bugs, and implement core features.

---

### Prompt 1: Understanding Debouncing & Input Throttling
> "Can you explain how debouncing works in React? When a user types into a search bar, every keystroke triggers an API request to TMDB, which causes rate limiting and UI lag. How can I build a lightweight custom `useDebounce` hook with a 500ms timer that cancels previous timeouts using `useEffect`?"

---

### Prompt 2: Infinite Scroll Logic with IntersectionObserver
> "I don't understand how `IntersectionObserver` works for infinite scrolling in React without third-party libraries. Can you explain the logic of using a sentinel `div` at the bottom of the grid, how `isIntersecting` triggers, and how to append `page + 1` movies to the existing array without re-rendering or wiping out previous items?"

---

### Prompt 3: Handling Missing Images & API Fallbacks
> "Some movies returned by TMDB have `poster_path: null` or broken image URLs, which leaves ugly broken image icons in the grid. Can you show me how to handle `onError` on the `<img>` tag and provide a clean fallback UI with a movie icon, title, and 'No Poster Available' placeholder?"

---

### Prompt 4: CSS & Layout Enhancement for Movie Cards
> "Can you help me improve the CSS of the movie card using Tailwind CSS? I want:
> 1. The movie poster to maintain a 2:3 aspect ratio with rounded corners.
> 2. The favorite heart button positioned at the top-right corner with a semi-transparent dark backdrop.
> 3. The star rating badge positioned at the bottom-left of the poster image.
> 4. Subtle hover zoom and shadow effect on the whole card."

---

### Prompt 5: Bug Fixing — Duplicate Movie IDs on Pagination
> "I have a bug in my infinite scroll: when the user scrolls quickly, the observer triggers twice and appends duplicate movies with the same `movie.id`, causing React key warning errors in the console. Where should I add a line of code to filter out duplicate IDs before updating the state?"

---

### Prompt 6: LocalStorage State Persistence for Favorites
> "How do I persist a user's favorite movies in browser `localStorage`? I need a `FavoritesContext` that loads saved movies on initial mount, saves them whenever the favorites array updates, and provides a simple `toggleFavorite(movie)` function that adds the movie if it's not in the list or removes it if it already exists."

---

### Prompt 7: Modal Component Keyboard & Scroll Lock
> "When the movie detail modal opens, scrolling the mouse also scrolls the background page behind it. How do I lock body scroll with `document.body.style.overflow = 'hidden'` when the modal is open, reset it when closed, and listen to the 'Escape' key to close the modal?"

---

### Prompt 8: AI Mood Matcher Prompt Formulation
> "I want to build an AI Mood Matcher feature where the user enters how they are feeling (for example: 'I had a stressful day and want a cozy funny movie' or 'deep mind bending thriller') and the system resolves it into a single movie title. How should I structure the prompt sent to the LLM to return strictly the title without extra commentary, and what semantic fallback heuristics should I use if the API key isn't set?"

---

### Prompt 9: Fixing IntersectionObserver Mock in Vitest
> "My unit tests in Vitest are failing because JSDOM doesn't implement `IntersectionObserver`. What mock class or implementation should I put in `setup.ts` to satisfy TypeScript and let Vitest tests run without crashing on `new IntersectionObserver()`?"
