// types/index.ts

export interface DishComponents {
  protein: string;
  starchBase: string;
  vegetable: string;
  sauce: string;
  garnish: string;
}

export interface ChefCanvasFormData {
  courseType: 'Amuse-Bouche' | 'Appetizer' | 'Soup' | 'Main Course' | 'Dessert';
  portions: number;
  components: DishComponents;
  intendedFlavorProfile: string;
}

// A single ingredient line with precise measurements
export interface RecipeIngredient {
  amount: string;      // e.g. "240"
  unit: string;        // e.g. "g", "ml", "tsp"
  ingredient: string;  // e.g. "duck breast"
  preparation: string; // e.g. "skin scored, trimmed"
}

// A single instruction step
export interface RecipeStep {
  stage: string;       // e.g. "Protein", "Sauce", "Plating"
  instruction: string; // the full step text
}

// The full structured response from Gemini
export interface AIAnalysisResult {
  title: string;
  summary: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  flavorAnalysis: string;
  chefRecommendations: string[];
}