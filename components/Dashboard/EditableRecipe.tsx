'use client';

import { AIAnalysisResult, RecipeIngredient, RecipeStep } from '@/types';
import dynamic from 'next/dynamic';

const DownloadButton = dynamic(
  () => import('@/components/PDF/DownloadButton'),
  { ssr: false, loading: () => (
    <button disabled className="font-mono text-[11px] tracking-widest uppercase border border-white/20 rounded-lg px-7 py-3.5 text-white/20 cursor-not-allowed">
      Export PDF
    </button>
  )}
);
interface Props {
  result: AIAnalysisResult;
  portions: number;
  courseType: string;       // add this
  onChange: (updated: AIAnalysisResult) => void;
  onSave: () => void;
  saving: boolean;
}

export default function EditableRecipe({
  result,
  portions,
  courseType,
  onChange,
  onSave,
  saving,
}: Props) {
  function updateTitle(value: string) {
    onChange({ ...result, title: value });
  }

  function updateSummary(value: string) {
    onChange({ ...result, summary: value });
  }

  function updateIngredient(index: number, field: keyof RecipeIngredient, value: string) {
    const updated = result.ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    );
    onChange({ ...result, ingredients: updated });
  }

  function addIngredient() {
    onChange({
      ...result,
      ingredients: [
        ...result.ingredients,
        { amount: '', unit: 'g', ingredient: '', preparation: '' },
      ],
    });
  }

  function removeIngredient(index: number) {
    onChange({
      ...result,
      ingredients: result.ingredients.filter((_, i) => i !== index),
    });
  }

  function updateStep(index: number, field: keyof RecipeStep, value: string) {
    const updated = result.steps.map((step, i) =>
      i === index ? { ...step, [field]: value } : step
    );
    onChange({ ...result, steps: updated });
  }

  function addStep() {
    onChange({
      ...result,
      steps: [...result.steps, { stage: '', instruction: '' }],
    });
  }

  function removeStep(index: number) {
    onChange({
      ...result,
      steps: result.steps.filter((_, i) => i !== index),
    });
  }

  function updateFlavorAnalysis(value: string) {
    onChange({ ...result, flavorAnalysis: value });
  }

  function updateRecommendation(index: number, value: string) {
    const updated = result.chefRecommendations.map((r, i) =>
      i === index ? value : r
    );
    onChange({ ...result, chefRecommendations: updated });
  }

  return (
    <div className="space-y-10">

      {/* Title */}
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
          Menu title
        </p>
        <input
          type="text"
          value={result.title}
          onChange={(e) => updateTitle(e.target.value)}
          className="w-full bg-transparent border-b border-white/10 font-serif text-4xl text-white pb-2 outline-none focus:border-white/40 transition-colors"
        />
      </div>

      {/* Summary */}
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
          Executive summary
        </p>
        <textarea
          value={result.summary}
          onChange={(e) => updateSummary(e.target.value)}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg font-serif text-lg italic text-white/80 px-4 py-3 outline-none resize-none leading-relaxed focus:border-white/30 transition-colors"
        />
      </div>

      {/* Ingredients */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
            Ingredients — {portions} pax
          </p>
          <button
            onClick={addIngredient}
            className="font-mono text-[10px] tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors"
          >
            + Add row
          </button>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[80px_70px_1fr_1fr_32px] gap-2 mb-2 px-1">
          {['Amount', 'Unit', 'Ingredient', 'Preparation', ''].map((h) => (
            <p key={h} className="font-mono text-[9px] tracking-widest uppercase text-white/20">
              {h}
            </p>
          ))}
        </div>

        <div className="space-y-2">
          {result.ingredients.map((ing, i) => (
            <div
              key={i}
              className="grid grid-cols-[80px_70px_1fr_1fr_32px] gap-2 items-center"
            >
              <input
                type="text"
                value={ing.amount}
                onChange={(e) => updateIngredient(i, 'amount', e.target.value)}
                placeholder="240"
                className="bg-white/5 border border-white/10 rounded font-mono text-sm text-white px-3 py-2.5 outline-none focus:border-white/30 transition-colors text-right"
              />
              <input
                type="text"
                value={ing.unit}
                onChange={(e) => updateIngredient(i, 'unit', e.target.value)}
                placeholder="g"
                className="bg-white/5 border border-white/10 rounded font-mono text-sm text-white px-3 py-2.5 outline-none focus:border-white/30 transition-colors"
              />
              <input
                type="text"
                value={ing.ingredient}
                onChange={(e) => updateIngredient(i, 'ingredient', e.target.value)}
                placeholder="ingredient"
                className="bg-white/5 border border-white/10 rounded font-mono text-sm text-white px-3 py-2.5 outline-none focus:border-white/30 transition-colors"
              />
              <input
                type="text"
                value={ing.preparation}
                onChange={(e) => updateIngredient(i, 'preparation', e.target.value)}
                placeholder="prep note"
                className="bg-white/5 border border-white/10 rounded font-mono text-sm text-white/60 px-3 py-2.5 outline-none focus:border-white/30 transition-colors"
              />
              <button
                onClick={() => removeIngredient(i)}
                className="font-mono text-sm text-white/20 hover:text-red-400 transition-colors text-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
            Method
          </p>
          <button
            onClick={addStep}
            className="font-mono text-[10px] tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors"
          >
            + Add step
          </button>
        </div>

        <div className="space-y-3">
          {result.steps.map((step, i) => (
            <div
              key={i}
              className="grid grid-cols-[28px_140px_1fr_32px] gap-3 items-start"
            >
              <span className="font-mono text-[11px] text-white/20 pt-3">
                {String(i + 1).padStart(2, '0')}
              </span>
              <input
                type="text"
                value={step.stage}
                onChange={(e) => updateStep(i, 'stage', e.target.value)}
                placeholder="Stage"
                className="bg-white/5 border border-white/10 rounded font-mono text-[10px] tracking-wide uppercase text-white/50 px-3 py-2.5 outline-none focus:border-white/30 transition-colors"
              />
              <textarea
                value={step.instruction}
                onChange={(e) => updateStep(i, 'instruction', e.target.value)}
                rows={2}
                placeholder="Instruction…"
                className="bg-white/5 border border-white/10 rounded font-mono text-sm text-white/80 px-3 py-2.5 outline-none resize-none leading-relaxed focus:border-white/30 transition-colors"
              />
              <button
                onClick={() => removeStep(i)}
                className="font-mono text-sm text-white/20 hover:text-red-400 transition-colors text-center pt-2.5"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Flavor Analysis */}
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
          Flavor analysis
        </p>
        <textarea
          value={result.flavorAnalysis}
          onChange={(e) => updateFlavorAnalysis(e.target.value)}
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-lg font-serif text-lg italic text-white/80 px-4 py-3 outline-none resize-none leading-relaxed focus:border-white/30 transition-colors"
        />
      </div>

      {/* Chef Recommendations */}
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
          Chef recommendations
        </p>
        <div className="space-y-3">
          {result.chefRecommendations.map((rec, i) => (
            <div key={i} className="grid grid-cols-[28px_1fr] gap-3 items-start">
              <span className="font-mono text-[11px] text-white/20 pt-3">
                {String(i + 1).padStart(2, '0')}
              </span>
              <textarea
                value={rec}
                onChange={(e) => updateRecommendation(i, e.target.value)}
                rows={2}
                className="bg-white/5 border border-white/10 rounded font-mono text-sm text-white/80 px-3 py-2.5 outline-none resize-none leading-relaxed focus:border-white/30 transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

  {/* Action buttons */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <DownloadButton
            result={result}
            courseType={courseType}
            portions={portions}
          />
          <button
            onClick={onSave}
            disabled={saving}
            className="font-mono text-[11px] tracking-widest uppercase bg-white text-stone-900 rounded-lg px-8 py-3.5 transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? 'Saving\u2026' : 'Save to Recipe Book'}
          </button>
        </div>
    </div>
  );
}