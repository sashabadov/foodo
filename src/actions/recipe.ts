"use server";

import { db } from "@/lib/db";
import type { RecipeInput } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createRecipe(input: RecipeInput) {
  const recipe = await db.recipe.create({
    data: {
      name: input.name,
      description: input.description,
      servings: input.servings,
      prepMins: input.prepMins,
      cookMins: input.cookMins,
      imageUrl: input.imageUrl,
      sourceUrl: input.sourceUrl,
      sourceType: input.sourceType ?? "manual",
      instructions: JSON.stringify(input.instructions),
      tags: JSON.stringify(input.tags),
      calories: input.calories,
      proteinG: input.proteinG,
      carbsG: input.carbsG,
      fatG: input.fatG,
      ingredients: {
        create: input.ingredients.map((ing) => ({
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          category: ing.category,
          notes: ing.notes,
        })),
      },
    },
  });
  revalidatePath("/recipes");
  revalidatePath("/");
  redirect(`/recipes/${recipe.id}`);
}

export async function updateRecipe(id: string, input: RecipeInput) {
  await db.ingredient.deleteMany({ where: { recipeId: id } });
  await db.recipe.update({
    where: { id },
    data: {
      name: input.name,
      description: input.description,
      servings: input.servings,
      prepMins: input.prepMins,
      cookMins: input.cookMins,
      imageUrl: input.imageUrl,
      sourceUrl: input.sourceUrl,
      sourceType: input.sourceType ?? "manual",
      instructions: JSON.stringify(input.instructions),
      tags: JSON.stringify(input.tags),
      calories: input.calories,
      proteinG: input.proteinG,
      carbsG: input.carbsG,
      fatG: input.fatG,
      ingredients: {
        create: input.ingredients.map((ing) => ({
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          category: ing.category,
          notes: ing.notes,
        })),
      },
    },
  });
  revalidatePath(`/recipes/${id}`);
  revalidatePath("/recipes");
  redirect(`/recipes/${id}`);
}

export async function deleteRecipe(id: string) {
  await db.recipe.delete({ where: { id } });
  revalidatePath("/recipes");
  revalidatePath("/");
  redirect("/recipes");
}
