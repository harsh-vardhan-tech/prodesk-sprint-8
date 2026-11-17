# Cine-Stream

Cine-Stream is a media discovery web application built with React, TypeScript, Vite, and Tailwind CSS. It connects to the TMDB (The Movie Database) API to explore popular movies, search titles with debounced input, dynamically load pages via infinite scrolling, and save favorite movies locally in the browser.

## Features

- **Movie Discovery Grid**: Browse trending and popular movies with posters, release dates, ratings, and synopsis details.
- **Debounced Search**: Search query input throttled with a 500ms delay using a custom hook to avoid unnecessary API requests while typing.
- **Infinite Scrolling**: Automatically loads the next page of movies as the user scrolls near the bottom of the page using the native browser `IntersectionObserver` API.
- **Favorites Watchlist**: Add or remove movies from favorites with a single click. State is persisted in `localStorage` across page reloads and accessible on the `/favorites` route.
- **Performance & Asset Optimization**: Native `loading="lazy"` on image posters with automatic placeholder fallback when posters are unavailable.
- **AI Mood Matcher**: Enter a mood or vibe (e.g., "cozy rainy day mystery" or "uplifting action") to receive a contextual movie recommendation that directly filters the catalog.

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite 8**
- **Tailwind CSS v4**
- **React Router Dom v7**
- **Axios**
- **Lucide React**
- **Vitest & React Testing Library**

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables (Optional)

Create a `.env` file based on `.env.example`:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

*Note: If no API keys are provided, the app will automatically use its internal multi-page offline dataset and semantic mood matcher.*

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
