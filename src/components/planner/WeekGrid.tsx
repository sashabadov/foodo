"use client";

import Link from "next/link";
import { formatDate, offsetWeek } from "@/lib/utils";
import { DAYS, MEAL_TYPES } from "@/types";
import type { DayOfWeek, MealType } from "@/types";
import { MealSlot } from "./MealSlot";
import { Button } from "@/components/ui/Button";

interface Recipe {
  id: string;
  name: string;
  servings: number;
}

interface MealEntry {
  id: string;
  recipeId: string;
  dayOfWeek: string;
  mealType: string;
  people: number;
  extraServings: number;
  recipe: Recipe;
}

interface WeekGridProps {
  weekStart: string;
  grid: Record<DayOfWeek, Record<MealType, MealEntry | null>>;
  recipes: Recipe[];
}

export function WeekGrid({ weekStart, grid, recipes }: WeekGridProps) {
  const prevWeek = offsetWeek(weekStart, -1);
  const nextWeek = offsetWeek(weekStart, 1);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Weekly Planner</h1>
        <div className="flex items-center gap-3">
          <Link href={`/planner?week=${prevWeek}`}>
            <Button variant="secondary" size="sm">← Prev</Button>
          </Link>
          <span className="text-sm font-medium text-gray-700">
            Week of {formatDate(weekStart)}
          </span>
          <Link href={`/planner?week=${nextWeek}`}>
            <Button variant="secondary" size="sm">Next →</Button>
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr>
              <th className="w-24 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500" />
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {day.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MEAL_TYPES.map((meal) => (
              <tr key={meal} className="border-t border-gray-200">
                <td className="pr-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400 capitalize">
                  {meal}
                </td>
                {DAYS.map((day) => (
                  <td key={day} className="px-1 py-1 align-top">
                    <MealSlot
                      weekStart={weekStart}
                      day={day}
                      meal={meal}
                      entry={grid[day][meal]}
                      recipes={recipes}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-2">
        <Link href="/shopping-list" className="text-sm font-medium text-emerald-600 hover:underline">
          View shopping list for this week →
        </Link>
      </div>
    </div>
  );
}
