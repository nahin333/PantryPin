import type { VisionAnalysis } from "./types";

const analyses: Record<string, VisionAnalysis> = {
  cake: {
    dish: "Vanilla layer cake",
    description: "Two layers of vanilla sponge with buttercream frosting and fresh berries.",
    cuisine: "American bakery",
    servingDescription: "1 slice (about 1/10 of cake)",
    calories: { low: 480, high: 620, best: 540 },
    macros: { protein: 6, carbs: 72, fat: 27 },
    confidence: 82,
    ingredients: [
      { name: "All-purpose flour", amount: 2.5, unit: "cups", calories: 1140, confidence: "medium" },
      { name: "Granulated sugar", amount: 1.75, unit: "cups", calories: 1350, confidence: "medium" },
      { name: "Unsalted butter", amount: 1, unit: "cup", calories: 1628, confidence: "medium" },
      { name: "Whole milk", amount: 1, unit: "cup", calories: 149, confidence: "low" },
      { name: "Large eggs", amount: 4, unit: "eggs", calories: 288, confidence: "medium" },
      { name: "Vanilla extract", amount: 2, unit: "tsp", calories: 24, confidence: "low" },
      { name: "Powdered sugar", amount: 3, unit: "cups", calories: 1401, confidence: "low", note: "Likely used in frosting" },
      { name: "Fresh berries", amount: 1, unit: "cup", calories: 65, confidence: "high" }
    ],
    warnings: ["Frosting thickness and slice size have the largest effect on this estimate."]
  },
  pizza: {
    dish: "Margherita pizza",
    description: "A hand-stretched pizza with tomato sauce, mozzarella, basil, and olive oil.",
    cuisine: "Italian",
    servingDescription: "2 slices (about 1/4 of a 12-inch pizza)",
    calories: { low: 520, high: 700, best: 610 },
    macros: { protein: 25, carbs: 76, fat: 23 },
    confidence: 88,
    ingredients: [
      { name: "Bread flour", amount: 2.5, unit: "cups", calories: 1140, confidence: "medium" },
      { name: "Crushed tomatoes", amount: 0.75, unit: "cup", calories: 45, confidence: "high" },
      { name: "Fresh mozzarella", amount: 8, unit: "oz", calories: 640, confidence: "high" },
      { name: "Olive oil", amount: 2, unit: "tbsp", calories: 238, confidence: "medium" },
      { name: "Fresh basil", amount: 0.5, unit: "cup", calories: 3, confidence: "high" },
      { name: "Active dry yeast", amount: 1, unit: "tsp", calories: 11, confidence: "low" }
    ],
    warnings: ["Cheese quantity and crust thickness are estimated from the visible portion."]
  },
  bowl: {
    dish: "Mediterranean grain bowl",
    description: "A fresh grain bowl with quinoa, chickpeas, greens, vegetables, feta, and tahini dressing.",
    cuisine: "Mediterranean-inspired",
    servingDescription: "1 bowl (about 3 cups)",
    calories: { low: 590, high: 760, best: 670 },
    macros: { protein: 25, carbs: 86, fat: 27 },
    confidence: 91,
    ingredients: [
      { name: "Quinoa", amount: 0.75, unit: "cup cooked", calories: 167, confidence: "high" },
      { name: "Chickpeas", amount: 0.5, unit: "cup", calories: 135, confidence: "high" },
      { name: "Cherry tomatoes", amount: 0.5, unit: "cup", calories: 14, confidence: "high" },
      { name: "Cucumber", amount: 0.5, unit: "cup", calories: 8, confidence: "high" },
      { name: "Feta cheese", amount: 1.5, unit: "oz", calories: 113, confidence: "medium" },
      { name: "Tahini", amount: 2, unit: "tbsp", calories: 178, confidence: "medium" },
      { name: "Mixed greens", amount: 1.5, unit: "cups", calories: 12, confidence: "high" },
      { name: "Olive oil", amount: 1, unit: "tbsp", calories: 119, confidence: "low", note: "Likely present in dressing" }
    ],
    warnings: ["Hidden oil and dressing can meaningfully change the calorie estimate."]
  }
};

export function getDemoAnalysis(filename = ""): VisionAnalysis {
  const lower = filename.toLowerCase();
  if (lower.includes("cake") || lower.includes("dessert")) return analyses.cake;
  if (lower.includes("pizza")) return analyses.pizza;
  return analyses.bowl;
}
