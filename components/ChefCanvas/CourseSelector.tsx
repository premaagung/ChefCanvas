import { ChefCanvasFormData } from '@/types';

const COURSES: ChefCanvasFormData['courseType'][] = [
  'Amuse-Bouche',
  'Appetizer',
  'Soup',
  'Main Course',
  'Dessert',
];

interface Props {
  selected: ChefCanvasFormData['courseType'];
  onChange: (course: ChefCanvasFormData['courseType']) => void;
}

export default function CourseSelector({ selected, onChange }: Props) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {COURSES.map((course) => (
        <button
          key={course}
          type="button"
          onClick={() => onChange(course)}
          className={`
            border rounded-lg py-3 px-1 font-mono text-[10px] tracking-wide
            text-center leading-snug transition-all duration-150 cursor-pointer
            ${
              selected === course
                ? 'bg-white text-stone-900 border-white'
                : 'bg-transparent text-white/40 border-white/10 hover:border-white/30 hover:text-white/70'
            }
          `}
        >
          {course}
        </button>
      ))}
    </div>
  );
}