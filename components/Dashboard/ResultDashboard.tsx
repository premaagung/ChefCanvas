import { AIAnalysisResult, ChefCanvasFormData } from '@/types';
import RecipeCard from './RecipeCard';
import FlavorAnalysis from './FlavorAnalysis';
import ChefRecommendations from './ChefRecommendations';

interface Props {
  result: AIAnalysisResult;
  formData: ChefCanvasFormData;
  onReset: () => void;
}

export default function ResultDashboard({ result, formData, onReset }: Props) {
  const filledComponents = Object.values(formData.components).filter(Boolean);

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <p className="font-mono text-xs text-white/40 tracking-wide">
          {formData.courseType}
          <span className="mx-2 text-white/20">·</span>
          {filledComponents.join(', ')}
        </p>
        <button
          onClick={onReset}
          className="font-mono text-[10px] tracking-widest uppercase border border-white/10 rounded-lg px-4 py-2 text-white/40 hover:border-white/30 hover:text-white/70 transition-colors cursor-pointer"
        >
          ← New dish
        </button>
      </div>

      <section className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
          01 — Generated recipe
        </p>
        <RecipeCard recipe={result.recipe} />
      </section>

      <section className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
          02 — Flavor analysis
        </p>
        <FlavorAnalysis analysis={result.flavorAnalysis} />
      </section>

      <section className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
          03 — Chef recommendations
        </p>
        <ChefRecommendations recommendations={result.chefRecommendations} />
      </section>
    </div>
  );
}