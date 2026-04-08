import { db } from "@/lib/db";
import { parseRecipe } from "@/lib/recipe-utils";
import { notFound } from "next/navigation";
import { RecipeForm } from "@/components/recipes/RecipeForm";
import type { RecipeInput } from "@/types";

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const raw = await db.recipe.findUnique({
    where: { id },
    include: { ingredients: true },
  });
  if (!raw) notFound();
  const recipe = parseRecipe(raw);

  const defaultValues: Partial<RecipeInput> = {
    name: recipe.name,
    description: recipe.description ?? undefined,
    servings: recipe.servings,
    prepMins: recipe.prepMins ?? undefined,
    cookMins: recipe.cookMins ?? undefined,
    imageUrl: recipe.imageUrl ?? undefined,
    sourceUrl: recipe.sourceUrl ?? undefined,
    sourceType: (recipe.sourceType as RecipeInput["sourceType"]) ?? "manual",
    instructions: recipe.instructions,
    tags: recipe.tags,
    calories: recipe.calories ?? undefined,
    proteinG: recipe.proteinG ?? undefined,
    carbsG: recipe.carbsG ?? undefined,
    fatG: recipe.fatG ?? undefined,
    ingredients: recipe.ingredients.map((ing) => ({
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit as RecipeInput["ingredients"][0]["unit"],
      category: ing.category as RecipeInput["ingredients"][0]["category"],
      notes: ing.notes ?? undefined,
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit recipe</h1>
        <p className="mt-1 text-sm text-gray-500">{recipe.name}</p>
      </div>
      <RecipeForm defaultValues={defaultValues} recipeId={id} />
    </div>
  );
}
