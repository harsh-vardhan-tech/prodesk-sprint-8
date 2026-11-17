# Cine-Stream — Media Discovery Explorer

**Sprint**: Sprint 08 — Performance Optimization & Client-Side Polish  
**Phase**: Phase 3: Core Engineering  
**Author**: Harsh Vardhan `[PDIT-INT-1260]`  
**Point of Contact**: Mr. Nakul

---

## 1. Project Overview
**Cine-Stream** is a Netflix-lite media discovery Single Page Application (SPA) consuming the TMDB REST API. Engineered with a strong focus on runtime performance, DOM memory safety, and client-side responsiveness, Cine-Stream handles extensive movie catalogs without performance degradation or memory leaks.

---

## 2. Core Technical Architectures

### Phase 1: Base Architecture & API Consumption (P0)
- **TMDB REST API Consumption**: Consumes endpoints for popular releases, search queries, and backdrop/poster assets using `axios`.
- **High-Fidelity Media Grid**: Responsive CSS Grid displaying movie poster, title, release year, and star rating.
- **Graceful Asset Fallbacks**: Fallback placeholder rendering when poster assets are null to preserve grid structure.

### Phase 2: Performance Mastery & Persistence (P1)
- **Infinite Scroll Architecture**:
  - Deprecates standard pagination in favor of the browser native `IntersectionObserver` API.
  - Automatically fetches and appends Page `N+1` when the user scrolls near the bottom of the viewport.
- **500ms Input Debouncing**:
  - Custom `useDebounce` hook intercepts keystrokes to enforce a 500ms delay before triggering search HTTP requests.
  - Eliminates server bottlenecks and excessive re-renders during active user typing.
- **State Persistence (Favorites)**:
  - Interactive heart action on all media cards toggles items in and out of a favorites collection.
  - Synced automatically with browser `localStorage` across page reloads.
  - Dedicated route (`/favorites`) with breadcrumbs and real-time counter badges.

### Phase 3: AI Architecture & Asset Optimization (P2)
- **Asset Lazy Loading**: Native `loading="lazy"` on all movie poster elements ensures offscreen image assets are only fetched upon intersection.
- **AI "Mood Matcher" Engine**:
  - Accepts natural language emotion prompts (e.g., *"I am feeling sad but want an action movie"*).
  - Resolves the mood prompt into a movie title using Gemini API integration with local semantic heuristics.
  - Seamlessly handoffs the resolved title to the TMDB search pipeline.

---

## 3. Directory Structure

```
├── Prompts.md                         # AI pair-programming and prompt engineering log
├── README.md                          # Technical overview and documentation
├── .env.example                       # Environment configuration template
├── package.json                       # Dependencies and build scripts
├── vite.config.ts                     # Vite 8 & Vitest configuration
├── src/
│   ├── types/
│   │   └── movie.ts                   # Strongly-typed movie and API interfaces
│   ├── services/
│   │   └── tmdb.ts                    # TMDB client & AI mood matcher service
│   ├── hooks/
│   │   └── useDebounce.ts             # 500ms request debouncing hook
│   ├── context/
│   │   └── FavoritesContext.tsx       # localStorage-synced favorites state
│   ├── data/
│   │   └── fallbackMovies.ts          # Curated multi-page fallback cache
│   ├── components/
│   │   ├── Navbar.tsx                 # Header, search bar & route navigation
│   │   ├── MovieGrid.tsx              # Grid container & infinite scroll sentinel
│   │   ├── MovieCard.tsx              # Media card with lazy loading & heart action
│   │   ├── MovieModal.tsx             # Detail popup modal with backdrop & synopsis
│   │   └── MoodMatcherModal.tsx       # AI mood matcher interface & presets
│   ├── pages/
│   │   ├── HomePage.tsx               # Main catalog, hero banner & infinite scroll
│   │   └── FavoritesPage.tsx          # Saved watchlist page (/favorites)
│   ├── __tests__/
│   │   └── CineStream.test.tsx        # Vitest integration test suite
│   ├── test/
│   │   └── setup.ts                   # Test environment & IntersectionObserver mock
│   ├── App.tsx                        # Router & provider root
│   ├── main.tsx                       # React application entry point
│   └── index.css                      # Global Tailwind CSS and cinema theme styling
```

---

## 4. Local Setup & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables (Optional)
Copy `.env.example` to `.env` to configure live API keys:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```
*(Note: If no API key is specified, Cine-Stream seamlessly utilizes its built-in offline movie catalog and semantic mood heuristics).*

### 3. Start Development Server
```bash
npm run dev
```

### 4. Run Tests
```bash
npm test
```

### 5. Production Build
```bash
npm run build
```

---

## 5. Verification Checklist
- [x] High-fidelity popular movie discovery grid (Title, Year, Rating, Poster)
- [x] Search input with 500ms debounce
- [x] Infinite scroll pagination via native IntersectionObserver
- [x] State persistence with localStorage on `/favorites`
- [x] Native lazy loading on all poster images (`loading="lazy"`)
- [x] AI Mood Matcher integration with search handoff
- [x] Zero lint warnings (`npm run lint`)
- [x] All test suites passing (`npm test`)
