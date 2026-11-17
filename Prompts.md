# Prompts.md — Sprint 08 Engineering & AI Pair-Programming Log

## Project Information
- **Sprint**: Sprint 08: Cine-Stream — Performance Optimization & Client-Side Polish
- **Phase**: Phase 3: Core Engineering
- **Engineering Track**: Common Sprint (Pre-specialization track split)
- **Author / Engineer**: Harsh Vardhan `[PDIT-INT-1260]`
- **Point of Contact**: Mr. Nakul

---

## Engineering Overview & Architectural Strategy
Cine-Stream is a Netflix-style single page application (SPA) architected to discover, filter, and stream media metadata using the TMDB REST API. The core engineering focus centers on DOM performance, client-side memory safety, debounced request throttling, and persistent state management.

### Key Architectural Pillars
1. **Request Throttling (Debouncing)**:
   - A custom `useDebounce` hook intercepts keystrokes in the search component with a 500ms delay.
   - Prevents cascading HTTP requests and compute bottlenecks on the TMDB API.
2. **On-Demand DOM Hydration (Infinite Scroll)**:
   - Replaced standard pagination with the native `IntersectionObserver` API.
   - Attaches a viewport observer to a sentinel node at the bottom of the grid, dynamically appending Page `N+1` via array spreading without DOM teardown.
3. **State Persistence (Favorites)**:
   - Synchronizes a "My Favorites" collection with browser `localStorage`.
   - Accessible via dedicated client-side routing at `/favorites`.
4. **Asset Optimization**:
   - Native lazy-loading (`loading="lazy"`) on all movie posters to delay offscreen image fetching until intersection.
   - Graceful fallback placeholder assets for titles lacking poster paths.
5. **AI "Mood Matcher" Handoff**:
   - Accepts freeform natural language mood prompts (e.g. *"I am feeling sad but want an action movie"*).
   - Resolves context to a specific movie title and silently pipelines it into the search engine.

---

## Prompt Sequence & Engineering Iterations

### Session 1: Project Initialization & Base Architecture (P0)
**Objective**: Scaffold Vite + React + TypeScript with Tailwind CSS and establish TMDB REST API contracts.  
**Prompt**:
> *"Initialize a Vite React TypeScript project for 'Cine-Stream'. Configure Tailwind CSS and Axios. Define TypeScript models for Movie and TMDBResponse. Build the popular movies discovery grid displaying Poster, Title, Release Year, and Star Rating. Implement responsive CSS Grid and native image lazy-loading (`loading='lazy'`)."*

**Engineering Outcome**:
- Clean component architecture (`MovieGrid`, `MovieCard`, `Navbar`).
- Robust TMDB client service handling base CDN URL resolution (`https://image.tmdb.org/t/p/w500`).
- Integrated curated offline fallback data to ensure uninterrupted evaluation if TMDB is ISP-blocked or key is absent.

---

### Session 2: Performance Mastery & State Persistence (P1)
**Objective**: Implement 500ms input debouncing, Infinite Scroll with IntersectionObserver, and localStorage favorites.  
**Prompt**:
> *"Implement a reusable `useDebounce` hook with a 500ms delay for search queries. Implement infinite scroll using native IntersectionObserver so scrolling to the bottom appends Page N+1. Create a `FavoritesContext` syncing liked movies to `localStorage` under key `cine_stream_favorites`, and wire a dedicated `/favorites` route."*

**Engineering Outcome**:
- Verified that rapid typing emits only 1 API call after 500ms of inactivity.
- Configured sentinel element with `threshold: 0.2` to append next pages smoothly.
- Persisted favorites array in `localStorage` with reactive badge counters in the navbar.

---

### Session 3: AI Mood Matcher & Modal Interactions (P2)
**Objective**: Connect contextual mood prompts to movie recommendations and detailed modal views.  
**Prompt**:
> *"Build an AI Mood Matcher modal that takes an emotional or contextual user prompt, resolves it to a single movie title (via Gemini API or built-in semantic mood mapping), and executes the search handoff. Implement a MovieModal displaying synopsis, backdrop, rating, and release date on card click."*

**Engineering Outcome**:
- Created `MoodMatcherModal` with quick preset chips and AI consultation states.
- Handed off suggested titles seamlessly into the search state.
- Implemented accessible `MovieModal` with Escape key and outside click listeners.

---

### Session 4: Test Suite & Release Verification
**Objective**: Author Vitest integration tests and confirm zero-error production build.  
**Prompt**:
> *"Write a comprehensive Vitest suite verifying base rendering, debounced search, favorites persistence across routes, AI mood matcher handoff, and modal controls. Run linting and production build verification."*

**Engineering Outcome**:
- All test suites passing with 100% success rate.
- Zero lint warnings (`oxlint`).
- Production build compilation verified in sub-second time.
