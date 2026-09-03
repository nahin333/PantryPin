import { describe, expect, it } from "vitest";
import { getDemoAnalysis } from "./demo-data";
import { priceIngredients, recipeGuides } from "./pricing";

describe("priceIngredients", () => {
  it("returns every ingredient with sorted store offers", () => {
    const analysis = getDemoAnalysis("cake.jpg");
    const result = priceIngredients(analysis.ingredients, "94107");
    expect(result.ingredients).toHaveLength(analysis.ingredients.length);
    expect(result.stores).toHaveLength(3);
    expect(result.stores[0].total).toBeLessThanOrEqual(result.stores[1].total);
    expect(result.cheapestTotal).toBe(result.stores[0].total);
    expect(result.ingredients.every((item) => item.bestPrice > 0)).toBe(true);
  });

  it("is deterministic for the same ZIP code", () => {
    const ingredients = getDemoAnalysis("pizza.png").ingredients;
    expect(priceIngredients(ingredients, "10001")).toEqual(priceIngredients(ingredients, "10001"));
  });
});

describe("recipeGuides", () => {
  it("returns encoded external searches for the identified dish", () => {
    const guides = recipeGuides("Vanilla layer cake");
    expect(guides).toHaveLength(3);
    expect(guides.every((guide) => guide.url.startsWith("https://"))).toBe(true);
    expect(guides[0].url).toContain("Vanilla%20layer%20cake");
  });
});
