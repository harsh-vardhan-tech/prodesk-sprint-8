import React, { useState } from 'react';
import { Sparkles, X, Loader2, ArrowRight } from 'lucide-react';
import { matchMovieByMood } from '../services/tmdb';

interface MoodMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyMovie: (title: string) => void;
}

const PRESET_MOODS = [
  'I am feeling sad but want an action movie',
  'Need a mind-bending space thriller',
  'Heartwarming family movie for the weekend',
  'Late night gritty crime drama with a twist',
  'Crazy multiverse high-energy comedy',
];

export const MoodMatcherModal: React.FC<MoodMatcherModalProps> = ({
  isOpen,
  onClose,
  onApplyMovie,
}) => {
  const [moodInput, setMoodInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultTitle, setResultTitle] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMatch = async (customPrompt?: string) => {
    const promptToUse = customPrompt || moodInput;
    if (!promptToUse.trim()) return;

    setIsLoading(true);
    setResultTitle(null);

    try {
      const suggestedTitle = await matchMovieByMood(promptToUse);
      setResultTitle(suggestedTitle);
    } catch {
      setResultTitle('Inception');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmHandoff = () => {
    if (resultTitle) {
      onApplyMovie(resultTitle);
      onClose();
      setResultTitle(null);
      setMoodInput('');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-zinc-900 border border-purple-500/30 rounded-xl max-w-lg w-full p-6 shadow-2xl shadow-purple-950/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-800/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                AI Mood Matcher
              </h2>
              <p className="text-xs text-zinc-400">
                Tell us your current vibe and let AI find your perfect movie match.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-zinc-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-400 tracking-wider mb-1.5">
              How are you feeling right now?
            </label>
            <textarea
              rows={3}
              value={moodInput}
              onChange={(e) => setMoodInput(e.target.value)}
              placeholder="e.g., I had a long day and want a cozy, uplifting mystery..."
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div>
            <span className="block text-xs font-medium text-zinc-500 mb-2">
              Or pick an instant mood preset:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_MOODS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setMoodInput(preset);
                    handleMatch(preset);
                  }}
                  className="px-2.5 py-1 text-xs rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700 hover:border-purple-400 hover:text-white transition-all text-left"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {resultTitle && (
            <div className="p-4 rounded-lg bg-purple-950/30 border border-purple-500/50 flex items-center justify-between gap-3 animate-in fade-in">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-purple-400 font-semibold block">
                  AI Recommendation Match:
                </span>
                <span className="text-base font-bold text-white">
                  "{resultTitle}"
                </span>
              </div>
              <button
                type="button"
                onClick={handleConfirmHandoff}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#e50914] text-white text-xs font-semibold rounded-md hover:bg-red-700 transition-colors whitespace-nowrap shadow-md"
              >
                <span>Discover</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              disabled={isLoading || !moodInput.trim()}
              onClick={() => handleMatch()}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-950/40"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Consulting LLM...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Match My Mood</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
