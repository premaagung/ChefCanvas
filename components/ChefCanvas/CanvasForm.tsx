'use client';

import { useState } from 'react';
import { ChefCanvasFormData, DishComponents } from '@/types';
import ComponentInput from './ComponentInput';
import CourseSelector from './CourseSelector';

const EMPTY_COMPONENTS: DishComponents = {
  protein: '',
  starchBase: '',
  vegetable: '',
  sauce: '',
  garnish: '',
};

const COMPONENT_CONFIG: {
  key: keyof DishComponents;
  label: string;
  placeholder: string;
}[] = [
  { key: 'protein',    label: 'Protein',       placeholder: 'e.g. Duck breast, Diver scallop' },
  { key: 'starchBase', label: 'Starch / Base',  placeholder: 'e.g. Pomme purée, Koshihikari rice' },
  { key: 'vegetable',  label: 'Vegetable',      placeholder: 'e.g. Charred bok choy, Pickled daikon' },
  { key: 'sauce',      label: 'Sauce / Liquid', placeholder: 'e.g. Gochujang glaze, Yuzu beurre blanc' },
  { key: 'garnish',    label: 'Garnish',        placeholder: 'e.g. Toasted sesame, Micro cilantro' },
];

interface Props {
  onSubmit: (data: ChefCanvasFormData) => void;
  error: string | null;
}

export default function CanvasForm({ onSubmit, error }: Props) {
  const [courseType, setCourseType] = useState<ChefCanvasFormData['courseType']>('Main Course');
  const [portions, setPortions] = useState<number>(10);
  const [components, setComponents] = useState<DishComponents>(EMPTY_COMPONENTS);
  const [flavorProfile, setFlavorProfile] = useState('');

  function updateComponent(key: keyof DishComponents, value: string) {
    setComponents((prev) => ({ ...prev, [key]: value }));
  }

  const filledComponents = Object.values(components).filter((v) => v.trim());
  const isReady = filledComponents.length > 0 && flavorProfile.trim().length > 0 && portions > 0;

  function getStatusText() {
    if (filledComponents.length === 0) return 'Add at least one dish component.';
    if (!flavorProfile.trim()) return `${filledComponents.length} component${filledComponents.length > 1 ? 's' : ''} added — state your flavor intention.`;
    return `${courseType} · ${portions} pax · ${filledComponents.length} component${filledComponents.length > 1 ? 's' : ''} · Ready.`;
  }

  function handleSubmit() {
    if (!isReady) return;
    onSubmit({ courseType, portions, components, intendedFlavorProfile: flavorProfile });
  }

  return (
    <div>
      {/* Section 01 — Course type */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
          01 — Course type
        </p>
        <CourseSelector selected={courseType} onChange={setCourseType} />
      </div>

      {/* Section 02 — Target portions */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
          02 — Target yield
        </p>
        <div className="flex flex-col sm:grid sm:grid-cols-[140px_1fr] items-stretch border border-white/10 rounded-lg overflow-hidden transition-colors focus-within:border-white/30">
          <label
            htmlFor="portions"
            className="flex items-center px-4 py-2 sm:py-0 bg-white/5 border-b sm:border-b-0 sm:border-r border-white/10 font-mono text-[10px] tracking-widest uppercase text-white/40 font-medium whitespace-nowrap"
          >
            Portions (pax)
          </label>
          <input
            id="portions"
            type="number"
            min={1}
            max={500}
            value={portions}
            onChange={(e) => setPortions(Math.max(1, parseInt(e.target.value) || 1))}
            className="bg-transparent font-mono text-sm text-white placeholder:text-white/20 px-4 py-3.5 outline-none w-full"
          />
        </div>
        <p className="font-mono text-[10px] text-white/20 mt-2">
          AI will scale all ingredient measurements to this yield.
        </p>
      </div>

      {/* Section 03 — Dish components */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
          03 — Dish components
        </p>
        <div className="flex flex-col gap-2">
          {COMPONENT_CONFIG.map(({ key, label, placeholder }) => (
            <ComponentInput
              key={key}
              id={key}
              label={label}
              value={components[key]}
              placeholder={placeholder}
              onChange={(val) => updateComponent(key, val)}
            />
          ))}
        </div>
      </div>

      {/* Section 04 — Flavor profile */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
          04 — Intended flavor profile
        </p>
        <textarea
          value={flavorProfile}
          onChange={(e) => setFlavorProfile(e.target.value)}
          maxLength={400}
          rows={4}
          placeholder={`Describe your flavor intention… e.g. "A rich, umami-forward dish with a sharp acidic finish to cut through the rendered fat."`}
          className="w-full border border-white/10 rounded-lg bg-white/5 font-serif text-lg italic text-white placeholder:text-white/20 px-4 py-4 outline-none resize-none leading-relaxed transition-colors focus:border-white/30"
        />
        <p className="font-mono text-[10px] text-white/20 text-right mt-1.5">
          {flavorProfile.length} / 400
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 border border-red-500/30 bg-red-500/10 rounded-lg px-4 py-3 font-mono text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-5 border-t border-white/10">
        <p className="font-mono text-[11px] text-white/30">{getStatusText()}</p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isReady}
          className="font-mono text-[11px] tracking-widest uppercase bg-white text-stone-900 rounded-lg px-7 py-3.5 transition-opacity hover:opacity-80 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
        >
          Analyse dish &#8594;
        </button>
      </div>
    </div>
  );
}