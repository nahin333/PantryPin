export type Ingredient = {
  name: string;
  amount: number;
  unit: string;
  calories: number;
  confidence: "high" | "medium" | "low";
  note?: string;
};

export type StoreOffer = {
  store: string; color: string; total: number; distance: number; itemCount: number; pickup: string;
};

export type PricedIngredient = Ingredient & {
  package: string; bestPrice: number; store: string; alternatives: { store: string; price: number }[];
};

export type RecipeGuide = {
  title: string; publisher: string; minutes: number; difficulty: string; url: string;
};

export type AnalysisResult = {
  dish: string;
  description: string;
  cuisine: string;
  servingDescription: string;
  calories: { low: number; high: number; best: number };
  macros: { protein: number; carbs: number; fat: number };
  confidence: number;
  ingredients: PricedIngredient[];
  stores: StoreOffer[];
  recipes: RecipeGuide[];
  cheapestTotal: number;
  pricingMode: "estimated" | "live";
  analysisMode: "ai" | "demo";
  zip: string;
  warnings: string[];
};

export type VisionAnalysis = Pick<AnalysisResult, "dish" | "description" | "cuisine" | "servingDescription" | "calories" | "macros" | "confidence"> & {
  ingredients: Ingredient[];
  warnings: string[];
};
