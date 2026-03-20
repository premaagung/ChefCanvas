interface Props {
  analysis: string;
}

export default function FlavorAnalysis({ analysis }: Props) {
  return (
    <div className="border border-white/10 rounded-xl p-6 bg-white/5">
      <p className="font-serif text-xl italic text-white/80 leading-relaxed">
        {analysis}
      </p>
    </div>
  );
}