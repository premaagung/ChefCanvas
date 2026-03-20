interface Props {
  label: string;
  id: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export default function ComponentInput({ label, id, value, placeholder, onChange }: Props) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-stretch border border-white/10 rounded-lg overflow-hidden transition-colors focus-within:border-white/30">
      <label
        htmlFor={id}
        className="flex items-center px-4 bg-white/5 border-r border-white/10 font-mono text-[10px] tracking-widest uppercase text-white/40 font-medium whitespace-nowrap"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent font-mono text-sm text-white placeholder:text-white/20 px-4 py-3.5 outline-none w-full"
      />
    </div>
  );
}