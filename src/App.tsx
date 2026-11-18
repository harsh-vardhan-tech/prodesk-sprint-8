import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { MoodMatcherModal } from './components/MoodMatcherModal';

export const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);

  const handleApplyMoodMatch = (suggestedMovie: string) => {
    setSearchQuery(suggestedMovie);
  };

  return (
    <FavoritesProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#141414] text-white flex flex-col">
          <Navbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenMoodMatcher={() => setIsMoodModalOpen(true)}
          />

          <div className="flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onOpenMoodMatcher={() => setIsMoodModalOpen(true)}
                  />
                }
              />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </div>

          <footer className="border-t border-zinc-800/80 bg-zinc-950 py-8 px-4 text-center text-xs text-zinc-500 font-mono">
            <p>Cine-Stream Media Discovery</p>
            <p className="mt-1 text-zinc-600">Built with React, TMDB API, Infinite Scroll &amp; AI Mood Matcher</p>
          </footer>

          <MoodMatcherModal
            isOpen={isMoodModalOpen}
            onClose={() => setIsMoodModalOpen(false)}
            onApplyMovie={handleApplyMoodMatch}
          />
        </div>
      </BrowserRouter>
    </FavoritesProvider>
  );
};

export default App;
