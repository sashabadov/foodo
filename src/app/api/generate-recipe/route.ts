import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a recipe assistant. When given a description, return ONLY valid JSON matching this TypeScript type (no markdown, no explanation):

{
  name: string;
  description: string;
  servings: number;
  prepMins: number;
  cookMins: number;
  instructions: string[];
  tags: string[];
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: "g"|"kg"|"ml"|"l"|"tsp"|"tbsp"|"cup"|"oz"|"lb"|"piece"|"clove"|"can"|"bunch"|"slice"|"";
    category: "produce"|"meat"|"seafood"|"dairy"|"bakery"|"frozen"|"pantry"|"spices"|"beverages"|"other";
    notes?: string;
  }>;
}

Use metric units. Be precise with quantities. Return nothing but the JSON object.`;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "prompt required" }, { status: 400 });
    }

    const client = new Anthropic();
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const recipe = JSON.parse(text);
    recipe.sourceType = "ai";
    return NextResponse.json(recipe);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
