import OpenAI from "openai";
import { z } from "zod";
import { getDemoAnalysis } from "./demo-data";
import type { VisionAnalysis } from "./types";

const visionSchema = z.object({
  dish: z.string(),
  description: z.string(),
  cuisine: z.string(),
  servingDescription: z.string(),
  calories: z.object({ low: z.number(), high: z.number(), best: z.number() }),
  macros: z.object({ protein: z.number(), carbs: z.number(), fat: z.number() }),
  confidence: z.number().min(0).max(100),
  ingredients: z.array(z.object({
    name: z.string(), amount: z.number(), unit: z.string(), calories: z.number(),
    confidence: z.enum(["high", "medium", "low"]), note: z.string().optional()
  })).min(1).max(16),
  warnings: z.array(z.string()).max(4)
});

const jsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["dish", "description", "cuisine", "servingDescription", "calories", "macros", "confidence", "ingredients", "warnings"],
  properties: {
    dish: { type: "string" }, description: { type: "string" }, cuisine: { type: "string" }, servingDescription: { type: "string" },
    calories: { type: "object", additionalProperties: false, required: ["low", "high", "best"], properties: { low: { type: "number" }, high: { type: "number" }, best: { type: "number" } } },
    macros: { type: "object", additionalProperties: false, required: ["protein", "carbs", "fat"], properties: { protein: { type: "number" }, carbs: { type: "number" }, fat: { type: "number" } } },
    confidence: { type: "number" },
    ingredients: { type: "array", minItems: 1, maxItems: 16, items: { type: "object", additionalProperties: false, required: ["name", "amount", "unit", "calories", "confidence", "note"], properties: { name: { type: "string" }, amount: { type: "number" }, unit: { type: "string" }, calories: { type: "number" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, note: { type: "string" } } } },
    warnings: { type: "array", maxItems: 4, items: { type: "string" } }
  }
};

export async function analyzeFood(imageDataUrl: string, filename: string): Promise<{ data: VisionAnalysis; mode: "ai" | "demo" }> {
  if (!process.env.OPENAI_API_KEY || filename.endsWith(".svg")) {
    return { data: getDemoAnalysis(filename), mode: "demo" };
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: process.env.OPENAI_VISION_MODEL || "gpt-4o-mini",
    instructions: "You are a cautious food analyst. Identify only visible or strongly implied ingredients. Estimate the full recipe ingredients and calories, but clearly lower confidence for hidden ingredients. Calories.best and macros must describe the visible serving, while ingredient calories describe the estimated full recipe. Do not provide medical advice.",
    input: [{ role: "user", content: [
      { type: "input_text", text: "Analyze this food photo. Return a practical ingredient breakdown for recreating the dish." },
      { type: "input_image", image_url: imageDataUrl, detail: "auto" }
    ] }],
    text: { format: { type: "json_schema", name: "food_analysis", strict: true, schema: jsonSchema } }
  });
  const parsed = visionSchema.safeParse(JSON.parse(response.output_text));
  if (!parsed.success) throw new Error("The food analysis returned an unexpected format.");
  return { data: parsed.data, mode: "ai" };
}
