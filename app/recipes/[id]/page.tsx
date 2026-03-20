'use client';

import { useEffect, useState } from 'react';
import { AIAnalysisResult } from '@/types';
import dynamic from 'next/dynamic';

const DownloadButton = dynamic(
  () => import('@/components/PDF/DownloadButton'),
  {
    ssr: false,
    loading: () => (
      <button
        disabled
        className="font-mono text-[10px] tracking-widest uppercase border border-white/20 rounded-lg px-4 py-2 text-white/20 cursor-not-allowed"
      >
        PDF
      </button>
    ),
  }
);

const EditableRecipe = dynamic(
  () => import('@/components/Dashboard/EditableRecipe'),
  { ssr: false }
);

interface FullRecipe extends AIAnalysisResult {
  id: string;
  courseType: string;
  portions: number;
  createdAt: string;
  flavorGoal: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

function parseAmount(amount: string): number {
  const trimmed = amount.trim();
  const fractionMatch = trimmed.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (fractionMatch) return parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
  const mixed = trimmed.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) return parseInt(mixed[1]) + parseInt(mixed[2]) / parseInt(mixed[3]);
  return parseFloat(trimmed) || 0;
}

function formatAmount(value: number): string {
  if (value === 0) return '0';
  const rounded = Math.round(value * 100) / 100;
  return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(2).replace(/\.?0+$/, '');
}

function scaleIngredients(
  ingredients: AIAnalysisResult['ingredients'],
  originalPortions: number,
  newPortions: number
) {
  const ratio = newPortions / originalPortions;
  return ingredients.map((ing) => ({
    ...ing,
    amount: formatAmount(parseAmount(ing.amount) * ratio),
  }));
}

function formatRecipeAsText(recipe: FullRecipe, displayPortions: number, displayIngredients: AIAnalysisResult['ingredients']): string {
  const lines: string[] = [];

  lines.push(recipe.title.toUpperCase());
  lines.push(`${recipe.courseType} · ${displayPortions} pax`);
  lines.push('');

  lines.push('SUMMARY');
  lines.push(recipe.summary);
  lines.push('');

  lines.push(`INGREDIENTS — ${displayPortions} pax`);
  displayIngredients.forEach((ing) => {
    const parts = [ing.amount, ing.unit, ing.ingredient];
    if (ing.preparation) parts.push(`— ${ing.preparation}`);
    lines.push(parts.filter(Boolean).join('  '));
  });
  lines.push('');

  lines.push('METHOD');
  recipe.steps.forEach((step, i) => {
    lines.push(`${String(i + 1).padStart(2, '0')}. ${step.stage.toUpperCase()}`);
    lines.push(`    ${step.instruction}`);
  });
  lines.push('');

  lines.push('FLAVOR ANALYSIS');
  lines.push(recipe.flavorAnalysis);
  lines.push('');

  lines.push('CHEF RECOMMENDATIONS');
  recipe.chefRecommendations.forEach((rec, i) => {
    lines.push(`${String(i + 1).padStart(2, '0')}. ${rec}`);
  });

  return lines.join('\n');
}

export default function RecipePage({ params }: PageProps) {
  const [id, setId] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<FullRecipe | null>(null);
  const [editedRecipe, setEditedRecipe] = useState<FullRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rescale state
  const [isRescaling, setIsRescaling] = useState(false);
  const [rescaleInput, setRescaleInput] = useState('');
  const [scaledPortions, setScaledPortions] = useState<number | null>(null);

  // Copy state
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    async function fetchRecipe() {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        if (res.status === 404) { setNotFound(true); return; }
        const data = await res.json();
        setRecipe(data);
        setEditedRecipe(data);
      } catch (err) {
        console.error('Failed to fetch recipe:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [id]);

  async function handleSaveEdit() {
    if (!editedRecipe || !id) return;
    setSaving(true);
    setSaveSuccess(false);
    setError(null);
    try {
      const res = await fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedRecipe),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Update failed');
      setRecipe(json);
      setEditedRecipe(json);
      setIsEditing(false);
      setSaveSuccess(true);
      setScaledPortions(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    setEditedRecipe(recipe);
    setIsEditing(false);
    setError(null);
  }

  function handleRescaleConfirm() {
    if (!recipe) return;
    const newPortions = parseInt(rescaleInput);
    if (!newPortions || newPortions < 1) return;
    setScaledPortions(newPortions);
    setIsRescaling(false);
    setRescaleInput('');
  }

  function handleRescaleReset() {
    setScaledPortions(null);
    setIsRescaling(false);
    setRescaleInput('');
  }

  async function handleCopy() {
    if (!recipe) return;
    const text = formatRecipeAsText(recipe, displayPortions, displayIngredients);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not access clipboard.');
    }
  }

  if (!id || loading) {
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-center py-32">
          <div className="w-16 h-px bg-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/60 animate-[shimmer_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !recipe || !editedRecipe) {
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <p className="font-serif text-2xl italic text-white/30 text-center py-32">
          Recipe not found.
        </p>
      </main>
    );
  }

  const displayPortions = scaledPortions ?? recipe.portions;
  const displayIngredients = scaledPortions
    ? scaleIngredients(recipe.ingredients, recipe.portions, scaledPortions)
    : recipe.ingredients;

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

      {/* Header */}
      <header className="border-b border-white/10 pb-6 mb-10">
        <div className="mb-4">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
            {recipe.courseType} &#183; {recipe.portions} pax
            {scaledPortions && (
              <span className="ml-2 text-amber-400/70">
                &#8594; rescaled to {scaledPortions} pax
              </span>
            )}
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-white leading-tight">
            {recipe.title}
          </h1>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {!isEditing && (
            <DownloadButton
              result={recipe}
              courseType={recipe.courseType}
              portions={recipe.portions}
            />
          )}
          {!isEditing && !isRescaling && (
            <button
              onClick={() => { setIsEditing(true); setSaveSuccess(false); setScaledPortions(null); }}
              className="font-mono text-[10px] tracking-widest uppercase border border-white/10 rounded-lg px-4 py-2 text-white/40 hover:border-white/30 hover:text-white/70 transition-colors cursor-pointer"
            >
              Edit
            </button>
          )}
          {!isEditing && !isRescaling && (
            <button
              onClick={() => { setIsRescaling(true); setRescaleInput(String(recipe.portions)); }}
              className="font-mono text-[10px] tracking-widest uppercase border border-white/10 rounded-lg px-4 py-2 text-white/40 hover:border-white/30 hover:text-white/70 transition-colors cursor-pointer"
            >
              Rescale
            </button>
          )}
          {!isEditing && !isRescaling && (
            <button
              onClick={handleCopy}
              className={`font-mono text-[10px] tracking-widest uppercase border rounded-lg px-4 py-2 transition-colors cursor-pointer ${
                copied
                  ? 'border-green-500/40 text-green-400'
                  : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
              }`}
            >
              {copied ? 'Copied!' : 'Copy text'}
            </button>
          )}
          {isEditing && (
            <button
              onClick={handleCancelEdit}
              className="font-mono text-[10px] tracking-widest uppercase border border-white/10 rounded-lg px-4 py-2 text-white/40 hover:border-red-400/50 hover:text-red-400 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          <a
            href="/recipes"
            className="font-mono text-[10px] tracking-widest uppercase border border-white/10 rounded-lg px-4 py-2 text-white/40 hover:border-white/30 hover:text-white/70 transition-colors"
          >
            Back
          </a>
        </div>

        {/* Rescale input — inline below buttons */}
        {isRescaling && (
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
              Rescale to
            </p>
            <input
              type="number"
              min={1}
              max={9999}
              value={rescaleInput}
              onChange={(e) => setRescaleInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRescaleConfirm()}
              autoFocus
              className="w-20 bg-transparent border border-white/20 rounded-lg px-3 py-1.5 font-mono text-sm text-white outline-none focus:border-white/40 text-center"
            />
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">pax</p>
            <button
              onClick={handleRescaleConfirm}
              className="font-mono text-[10px] tracking-widest uppercase border border-white/20 rounded-lg px-3 py-1.5 text-white/60 hover:border-white/40 hover:text-white transition-colors cursor-pointer"
            >
              Apply
            </button>
            <button
              onClick={() => { setIsRescaling(false); setRescaleInput(''); }}
              className="font-mono text-[10px] tracking-widest uppercase text-white/25 hover:text-white/50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Active rescale banner */}
        {scaledPortions && !isRescaling && (
          <div className="mt-4 flex items-center gap-3">
            <p className="font-mono text-[10px] text-amber-400/60 uppercase tracking-widest">
              Showing quantities for {scaledPortions} pax
            </p>
            <button
              onClick={handleRescaleReset}
              className="font-mono text-[10px] tracking-widest uppercase text-white/25 hover:text-white/50 transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}
      </header>

      {/* Save success banner */}
      {saveSuccess && (
        <div className="mb-8 border border-green-500/30 bg-green-500/10 rounded-lg px-4 py-3">
          <p className="font-mono text-xs text-green-400">Changes saved successfully.</p>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mb-8 border border-red-500/30 bg-red-500/10 rounded-lg px-4 py-3">
          <p className="font-mono text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* Edit mode */}
      {isEditing && (
        <EditableRecipe
          result={editedRecipe}
          portions={editedRecipe.portions}
          courseType={editedRecipe.courseType}
          onChange={(updated) => setEditedRecipe({ ...editedRecipe, ...updated })}
          onSave={handleSaveEdit}
          saving={saving}
        />
      )}

      {/* View mode */}
      {!isEditing && (
        <div className="space-y-10">

          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
              Executive summary
            </p>
            <p className="font-serif text-xl italic text-white/70 leading-relaxed">
              {recipe.summary}
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-4">
              Ingredients &#8212; {displayPortions} pax
              {scaledPortions && (
                <span className="ml-2 normal-case text-amber-400/50 tracking-normal">
                  (rescaled from {recipe.portions})
                </span>
              )}
            </p>
            <div className="hidden sm:grid sm:grid-cols-[80px_60px_1fr_1fr] gap-2 mb-2 px-1">
              {['Amount', 'Unit', 'Ingredient', 'Preparation'].map((h) => (
                <p key={h} className="font-mono text-[9px] tracking-widest uppercase text-white/20">
                  {h}
                </p>
              ))}
            </div>
            <div className="space-y-3 sm:space-y-1">
              {displayIngredients.map((ing, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-0.5 border-b border-white/5 py-3 sm:grid sm:grid-cols-[80px_60px_1fr_1fr] sm:gap-2 sm:py-2"
                >
                  <div className="flex items-baseline gap-2 sm:contents">
                    <span className={`font-mono text-sm sm:text-right sm:pr-2 ${scaledPortions ? 'text-amber-400/80' : 'text-white'}`}>
                      {ing.amount}
                    </span>
                    <span className="font-mono text-sm text-white/60">{ing.unit}</span>
                    <span className="font-mono text-sm text-white sm:col-start-3">{ing.ingredient}</span>
                  </div>
                  <span className="font-mono text-xs sm:text-sm text-white/40 italic sm:col-start-4">
                    {ing.preparation}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-4">
              Method
            </p>
            <div className="space-y-4">
              {recipe.steps.map((step, i) => (
                <div key={i} className="grid grid-cols-[28px_1fr] gap-3 sm:gap-4">
                  <span className="font-mono text-[11px] text-white/20 pt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-1">
                      {step.stage}
                    </p>
                    <p className="font-mono text-sm text-white/80 leading-relaxed">
                      {step.instruction}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
              Flavor analysis
            </p>
            <p className="font-serif text-xl italic text-white/70 leading-relaxed">
              {recipe.flavorAnalysis}
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-4">
              Chef recommendations
            </p>
            <div className="space-y-3">
              {recipe.chefRecommendations.map((rec, i) => (
                <div key={i} className="grid grid-cols-[28px_1fr] gap-3 sm:gap-4">
                  <span className="font-mono text-[11px] text-white/20 pt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="font-mono text-sm text-white/80 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </main>
  );
}