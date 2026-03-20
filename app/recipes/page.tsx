'use client';

import { useEffect, useState } from 'react';

interface RecipeSummary {
  id: string;
  title: string;
  summary: string;
  courseType: string;
  portions: number;
  createdAt: string;
}

const COURSE_TYPES = [
  'All',
  'Amuse-Bouche',
  'Appetizer',
  'Soup',
  'Main Course',
  'Dessert',
] as const;

type FilterType = (typeof COURSE_TYPES)[number];

function SkeletonCard() {
  return (
    <div className="border border-white/10 rounded-xl p-5 sm:p-6 bg-white/5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="h-6 w-2/3 bg-white/20 rounded animate-pulse" />
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-3 w-6 bg-white/20 rounded animate-pulse" />
          <div className="h-3 w-8 bg-white/20 rounded animate-pulse" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full bg-white/20 rounded animate-pulse" />
        <div className="h-3 w-4/5 bg-white/20 rounded animate-pulse" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="h-5 w-20 bg-white/20 rounded animate-pulse" />
        <div className="h-5 w-12 bg-white/20 rounded animate-pulse" />
        <div className="h-3 w-16 bg-white/20 rounded animate-pulse sm:ml-auto" />
      </div>
    </div>
  );
}

export default function RecipeBook() {
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  useEffect(() => {
    fetchRecipes();
  }, []);

  async function fetchRecipes() {
    try {
      const res = await fetch('/api/recipes');
      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this recipe from your book?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  const filtered =
    activeFilter === 'All'
      ? recipes
      : recipes.filter((r) => r.courseType === activeFilter);

  // Only show pills for course types that actually exist in the data, plus All
  const availableTypes = COURSE_TYPES.filter(
    (c) => c === 'All' || recipes.some((r) => r.courseType === c)
  );

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

      {/* Header */}
      <header className="border-b border-white/10 pb-6 mb-8 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-4xl sm:text-6xl font-medium tracking-tight text-white">
            Recipe Book
          </h1>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mt-2">
            Your saved dishes
          </p>
        </div>
        <a
          href="/canvas"
          className="font-mono text-[10px] tracking-widest uppercase border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-white/40 hover:border-white/30 hover:text-white/70 transition-colors shrink-0"
        >
          New dish
        </a>
      </header>

      {/* Filter pills — only shown once data is loaded and there are recipes */}
      {!loading && recipes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {availableTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`font-mono text-[10px] tracking-widest uppercase rounded-lg px-3 py-1.5 transition-colors cursor-pointer border ${
                activeFilter === type
                  ? 'border-white/40 text-white bg-white/10'
                  : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/60'
              }`}
            >
              {type}
            </button>
          ))}
          {activeFilter !== 'All' && (
            <span className="font-mono text-[10px] text-white/25 self-center ml-1">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state — no recipes at all */}
      {!loading && recipes.length === 0 && (
        <div className="text-center py-32">
          <p className="font-serif text-2xl italic text-white/30 mb-4">
            No recipes saved yet.
          </p>
          <a
            href="/canvas"
            className="font-mono text-[10px] tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors"
          >
            Create your first dish
          </a>
        </div>
      )}

      {/* Empty state — filter has no results */}
      {!loading && recipes.length > 0 && filtered.length === 0 && (
        <div className="text-center py-24">
          <p className="font-serif text-xl italic text-white/30 mb-3">
            No {activeFilter.toLowerCase()} recipes yet.
          </p>
          <button
            onClick={() => setActiveFilter('All')}
            className="font-mono text-[10px] tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors cursor-pointer"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Recipe list */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((recipe) => (
            <div
              key={recipe.id}
              className="border border-white/10 rounded-xl p-5 sm:p-6 bg-white/5 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="font-serif text-xl sm:text-2xl text-white leading-tight min-w-0">
                  {recipe.title}
                </h2>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={`/recipes/${recipe.id}`}
                    className="font-mono text-[10px] tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    disabled={deletingId === recipe.id}
                    className="font-mono text-[10px] tracking-widest uppercase text-white/20 hover:text-red-400 transition-colors disabled:opacity-40"
                  >
                    {deletingId === recipe.id ? 'Removing\u2026' : 'Delete'}
                  </button>
                </div>
              </div>
              <p className="font-serif text-base italic text-white/50 leading-relaxed mb-4 line-clamp-2">
                {recipe.summary}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] tracking-wide uppercase bg-white/5 border border-white/10 rounded px-2 py-1 text-white/40">
                  {recipe.courseType}
                </span>
                <span className="font-mono text-[10px] tracking-wide uppercase bg-white/5 border border-white/10 rounded px-2 py-1 text-white/40">
                  {recipe.portions} pax
                </span>
                <span className="font-mono text-[10px] text-white/20 sm:ml-auto">
                  {formatDate(recipe.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </main>
  );
}