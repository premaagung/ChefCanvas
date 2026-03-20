'use client';

import { useState } from 'react';
import CanvasForm from '@/components/ChefCanvas/CanvasForm';
import EditableRecipe from '@/components/Dashboard/EditableRecipe';
import { ChefCanvasFormData, AIAnalysisResult } from '@/types';

type AppState = 'form' | 'loading' | 'result';

const LOADING_MESSAGES = [
  'Briefing Chef Atelier\u2026',
  'Scaling measurements to yield\u2026',
  'Composing the recipe card\u2026',
  'Plating the recommendations\u2026',
];

export default function Home() {
  const [appState, setAppState] = useState<AppState>('form');
  const [formData, setFormData] = useState<ChefCanvasFormData | null>(null);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [editedResult, setEditedResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  async function handleSubmit(data: ChefCanvasFormData) {
    setFormData(data);
    setError(null);
    setSaveSuccess(false);
    setAppState('loading');

    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[msgIndex]);
    }, 2000);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Unknown error');

      setResult(json);
      setEditedResult(json);
      setAppState('result');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Chef Atelier is unavailable. Please try again.'
      );
      setAppState('form');
    } finally {
      clearInterval(msgInterval);
    }
  }

  async function handleSave() {
    if (!editedResult || !formData) return;

    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editedResult,
          courseType: formData.courseType,
          portions: formData.portions,
          components: formData.components,
          flavorGoal: formData.intendedFlavorProfile,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');

      setSaveSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save recipe.'
      );
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setAppState('form');
    setResult(null);
    setEditedResult(null);
    setError(null);
    setSaveSuccess(false);
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

      {/* Header */}
      <header className="border-b border-white/10 pb-6 mb-10 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-4xl sm:text-6xl font-medium tracking-tight text-white">
            ChefCanvas
          </h1>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mt-2">
            AI menu ideation &#8212; professional kitchen
          </p>
        </div>
        <a
          href="/recipes"
          className="font-mono text-[10px] tracking-widest uppercase border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-white/40 hover:border-white/30 hover:text-white/70 transition-colors shrink-0"
        >
          Recipe Book
        </a>
      </header>

      {/* Form view */}
      {appState === 'form' && (
        <CanvasForm onSubmit={handleSubmit} error={error} />
      )}

      {/* Loading view */}
      {appState === 'loading' && (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="w-16 h-px bg-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/60 animate-[shimmer_1.5s_ease-in-out_infinite]" />
          </div>
          <p className="font-mono text-[11px] tracking-widest uppercase text-white/40 text-center px-4">
            {loadingMessage}
          </p>
        </div>
      )}

      {/* Result view */}
      {appState === 'result' && editedResult !== null && formData !== null && (
        <div>
          {/* Top bar */}
          <div className="flex items-center justify-between gap-4 mb-10">
            <p className="font-mono text-xs text-white/40 tracking-wide min-w-0 truncate">
              {formData.courseType}
              <span className="mx-2 text-white/20">&#183;</span>
              {formData.portions} pax
            </p>
            <button
              onClick={handleReset}
              className="font-mono text-[10px] tracking-widest uppercase border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-white/40 hover:border-white/30 hover:text-white/70 transition-colors cursor-pointer shrink-0"
            >
              New dish
            </button>
          </div>

          {/* Save success banner */}
          {saveSuccess && (
            <div className="mb-8 border border-green-500/30 bg-green-500/10 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
              <p className="font-mono text-xs text-green-400">
                Recipe saved to your Recipe Book.
              </p>
              <a
                href="/recipes"
                className="font-mono text-[10px] tracking-widest uppercase text-green-400 hover:text-green-300 transition-colors shrink-0"
              >
                View
              </a>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="mb-8 border border-red-500/30 bg-red-500/10 rounded-lg px-4 py-3">
              <p className="font-mono text-xs text-red-400">{error}</p>
            </div>
          )}

          <EditableRecipe
            result={editedResult}
            portions={formData.portions}
            courseType={formData.courseType}
            onChange={(updated) => setEditedResult(updated)}
            onSave={handleSave}
            saving={saving}
          />
        </div>
      )}

    </main>
  );
}