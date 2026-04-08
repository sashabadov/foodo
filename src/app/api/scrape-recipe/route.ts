import { NextRequest, NextResponse } from "next/server";
import { scrapeRecipe } from "@/lib/scrapers";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "url required" }, { status: 400 });
    }
    const recipe = await scrapeRecipe(url);
    return NextResponse.json(recipe);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown_error";
    if (message === "no_recipe_found") {
      return NextResponse.json({ error: "no_recipe_found" }, { status: 422 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
