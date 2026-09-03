import type { Ingredient, PricedIngredient, RecipeGuide, StoreOffer } from "./types";

const stores = [
  { store: "Walmart", color: "#2574d8", multiplier: 0.92, distance: 1.8, pickup: "Today, 5–6 PM" },
  { store: "ALDI", color: "#1454a3", multiplier: 0.86, distance: 3.1, pickup: "Today, 6–7 PM" },
  { store: "Target", color: "#cc2d35", multiplier: 1.08, distance: 2.4, pickup: "Ready in 2 hours" }
];

const basePrices: Record<string, [number, string]> = {
  flour: [3.12, "5 lb bag"], sugar: [2.84, "4 lb bag"], butter: [4.49, "1 lb box"], milk: [3.29, "1 gallon"],
  egg: [3.48, "dozen"], vanilla: [5.28, "2 fl oz"], berries: [3.78, "12 oz pack"], tomato: [1.46, "14.5 oz can"],
  mozzarella: [4.29, "8 oz pack"], oil: [8.47, "25.5 fl oz"], basil: [2.18, "0.5 oz pack"], yeast: [1.62, "3 pack"],
  quinoa: [4.38, "16 oz bag"], chickpea: [0.96, "15.5 oz can"], cucumber: [0.78, "1 each"], feta: [3.88, "6 oz tub"],
  tahini: [5.48, "16 oz jar"], greens: [3.28, "5 oz box"]
};

function productFor(name: string): [number, string] {
  const key = Object.keys(basePrices).find((candidate) => name.toLowerCase().includes(candidate));
  return key ? basePrices[key] : [3.49, "standard package"];
}

function seededVariance(value: string, salt: number) {
  const sum = value.split("").reduce((total, char) => total + char.charCodeAt(0), salt * 17);
  return 0.94 + (sum % 13) / 100;
}

export function priceIngredients(ingredients: Ingredient[], zip: string) {
  const priced: PricedIngredient[] = ingredients.map((ingredient) => {
    const [base, packageName] = productFor(ingredient.name);
    const offers = stores.map((store, storeIndex) => ({
      store: store.store,
      price: Number((base * store.multiplier * seededVariance(zip + ingredient.name, storeIndex)).toFixed(2))
    })).sort((a, b) => a.price - b.price);
    return { ...ingredient, package: packageName, bestPrice: offers[0].price, store: offers[0].store, alternatives: offers.slice(1) };
  });

  const storeOffers: StoreOffer[] = stores.map((store) => ({
    store: store.store,
    color: store.color,
    total: Number(priced.reduce((sum, item) => sum + ([{ store: item.store, price: item.bestPrice }, ...item.alternatives].find((offer) => offer.store === store.store)?.price ?? 0), 0).toFixed(2)),
    distance: Number((store.distance + (Number(zip.slice(-1)) || 0) * 0.04).toFixed(1)),
    itemCount: priced.length,
    pickup: store.pickup
  })).sort((a, b) => a.total - b.total);

  return { ingredients: priced, stores: storeOffers, cheapestTotal: storeOffers[0]?.total ?? 0 };
}

export function recipeGuides(dish: string): RecipeGuide[] {
  const query = encodeURIComponent(dish);
  return [
    { title: `A reliable guide to ${dish.toLowerCase()}`, publisher: "Serious Eats", minutes: 45, difficulty: "Intermediate", url: `https://www.seriouseats.com/search?q=${query}` },
    { title: `${dish}: step-by-step`, publisher: "BBC Good Food", minutes: 35, difficulty: "Easy", url: `https://www.bbcgoodfood.com/search?q=${query}` },
    { title: `Make ${dish.toLowerCase()} at home`, publisher: "The Kitchn", minutes: 40, difficulty: "Easy", url: `https://www.thekitchn.com/search?q=${query}` }
  ];
}
