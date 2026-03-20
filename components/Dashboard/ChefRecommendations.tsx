interface Props {
  recommendations: string[];
}

export default function ChefRecommendations({ recommendations }: Props) {
  return (
    <div className="border border-white/10 rounded-xl p-6 bg-white/5 divide-y divide-white/10">
      {recommendations.map((rec, i) => (
        <div key={i} className="grid grid-cols-[28px_1fr] gap-3 py-4 first:pt-0 last:pb-0">
          <span className="font-mono text-[11px] text-white/20 pt-0.5 font-medium">
            {String(i + 1).padStart(2, '0')}
          </span>
          <p className="font-mono text-sm text-white/80 leading-relaxed">
            {rec}
          </p>
        </div>
      ))}
    </div>
  );
}