import { db } from "@/lib/db";
import { getWeekStart } from "@/lib/utils";
import { WeekGrid } from "@/components/planner/WeekGrid";
import type { DayOfWeek, MealType } from "@/types";
import { DAYS, MEAL_TYPES } from "@/types";

export default async function PlannerPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { week } = await searchParams;
  const weekStart = week ?? getWeekStart();

  const [mealPlan, recipes] = await Promise.all([
    db.mealPlan.findUnique({
      where: { weekStartDate: weekStart },
      include: {
        mealEntries: {
          include: { recipe: { include: { ingredients: true } } },
        },
      },
    }),
    db.recipe.findMany({ orderBy: { name: "asc" } }),
  ]);

  // Build grid: day → mealType → entry | null
  type EntryWithRecipe = NonNullable<typeof mealPlan>["mealEntries"][0];
  const grid: Record<DayOfWeek, Record<MealType, EntryWithRecipe | null>> = {} as never;

  for (const day of DAYS) {
    grid[day] = {} as Record<MealType, EntryWithRecipe | null>;
    for (const meal of MEAL_TYPES) {
      grid[day][meal] =
        mealPlan?.mealEntries.find(
          (e) => e.dayOfWeek === day && e.mealType === meal
        ) ?? null;
    }
  }

  return (
    <WeekGrid
      weekStart={weekStart}
      grid={grid}
      recipes={recipes.map((r) => ({ id: r.id, name: r.name, servings: r.servings }))}
    />
  );
}
