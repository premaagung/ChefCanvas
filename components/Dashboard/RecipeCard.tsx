import { AIAnalysisResult } from '@/types';

interface Props {
  recipe: AIAnalysisResult['recipe'];
}

export default function RecipeCard({ recipe }: Props) {
  const steps: string[] = Array.isArray(recipe)
    ? recipe
    : recipe.split('\n').filter((l) => l.trim());

  return (
    <div className="border border-white/10 rounded-xl p-6 bg-white/5">
      {steps.map((step, i) => {
        const colonIndex = step.indexOf(':');
        const hasStageLabel = colonIndex > 0 && colonIndex < 20;
        const stageLabel = hasStageLabel ? step.slice(0, colonIndex) : null;
        const stepBody = hasStageLabel ? step.slice(colonIndex + 1).trim() : step;

        return (
          <div key={i} className="grid grid-cols-[28px_1fr] gap-3 mb-5 last:mb-0">
            <span className="font-mono text-[11px] text-white/20 pt-0.5 font-medium">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              {stageLabel && (
                <span className="font-mono text-[10px] tracking-widest uppercase text-white/40 block mb-1">
                  {stageLabel}
                </span>
              )}
              <p className="font-mono text-sm text-white/80 leading-relaxed">
                {stepBody}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}