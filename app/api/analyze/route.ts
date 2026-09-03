import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeFood } from "@/lib/analysis";
import { priceIngredients, recipeGuides } from "@/lib/pricing";

export const runtime = "nodejs";
export const maxDuration = 30;

function corsHeaders(request: Request): Record<string, string> {
  const allowedOrigin = process.env.ALLOWED_ORIGIN;
  const requestOrigin = request.headers.get("origin");
  if (!allowedOrigin || !requestOrigin || (allowedOrigin !== "*" && requestOrigin !== allowedOrigin)) return {};
  return {
    "Access-Control-Allow-Origin": allowedOrigin === "*" ? "*" : requestOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}

const requestSchema = z.object({
  image: z.string().startsWith("data:image/").max(8_000_000),
  filename: z.string().max(200).default("food-photo"),
  zip: z.string().regex(/^\d{5}$/, "Enter a valid 5-digit ZIP code")
});

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
    const analysis = await analyzeFood(body.image, body.filename);
    const pricing = priceIngredients(analysis.data.ingredients, body.zip);
    return NextResponse.json({
      ...analysis.data,
      ...pricing,
      recipes: recipeGuides(analysis.data.dish),
      pricingMode: "estimated",
      analysisMode: analysis.mode,
      zip: body.zip
    }, { headers: corsHeaders(request) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid request" }, { status: 400, headers: corsHeaders(request) });
    }
    console.error("Food analysis failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "We could not analyze that photo." }, { status: 500, headers: corsHeaders(request) });
  }
}
