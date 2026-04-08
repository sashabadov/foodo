"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function getOrCreateMealPlan(weekStartDate: string) {
  return db.mealPlan.upsert({
    where: { weekStartDate },
    create: { weekStartDate },
    update: {},
  });
}

export async function upsertMealEntry({
  weekStartDate,
  dayOfWeek,
  mealType,
  recipeId,
  people,
  extraServings,
}: {
  weekStartDate: string;
  dayOfWeek: string;
  mealType: string;
  recipeId: string;
  people: number;
  extraServings: number;
}) {
  const plan = await getOrCreateMealPlan(weekStartDate);

  // Replace any existing entry for this day+mealType slot
  await db.mealEntry.deleteMany({
    where: { mealPlanId: plan.id, dayOfWeek, mealType },
  });

  await db.mealEntry.create({
    data: {
      mealPlanId: plan.id,
      recipeId,
      dayOfWeek,
      mealType,
      people,
      extraServings,
    },
  });

  revalidatePath("/planner");
  revalidatePath("/shopping-list");
}

export async function removeMealEntry(entryId: string) {
  await db.mealEntry.delete({ where: { id: entryId } });
  revalidatePath("/planner");
  revalidatePath("/shopping-list");
}

export async function updateMealEntry(
  entryId: string,
  people: number,
  extraServings: number
) {
  await db.mealEntry.update({
    where: { id: entryId },
    data: { people, extraServings },
  });
  revalidatePath("/planner");
  revalidatePath("/shopping-list");
}
