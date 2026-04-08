"use client";

import { useState, useTransition } from "react";
import type { DayOfWeek, MealType } from "@/types";
import { removeMealEntry, upsertMealEntry, updateMealEntry } from "@/actions/planner";
import { RecipePicker } from "./RecipePicker";
import { toast } from "sonner";

interface Recipe {
  id: string;
  name: string;
  servings: number;
}

interface MealEntry {
  id: string;
  recipeId: string;
  people: number;
  extraServings: number;
  recipe: Recipe;
}

interface MealSlotProps {
  weekStart: string;
  day: DayOfWeek;
  meal: MealType;
  entry: MealEntry | null;
  recipes: Recipe[];
}

export function MealSlot({ weekStart, day, meal, entry, recipes }: MealSlotProps) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (recipeId: string) => {
    startTransition(async () => {
      await upsertMealEntry({
        weekStartDate: weekStart,
        dayOfWeek: day,
        mealType: meal,
        recipeId,
        people: 2,
        extraServings: 0,
      });
      setEditing(false);
    });
  };

  const handleRemove = () => {
    if (!entry) return;
    startTransition(async () => {
      await removeMealEntry(entry.id);
    });
  };

  const handleUpdate = (people: number, extraServings: number) => {
    if (!entry) return;
    startTransition(async () => {
      try {
        await updateMealEntry(entry.id, people, extraServings);
      } catch {
        toast.error("Failed to update");
      }
    });
  };

  if (editing) {
    return (
      <RecipePicker
        recipes={recipes}
        onSelect={handleSelect}
        onCancel={() => setEditing(false)}
      />
    );
  }

  if (!entry) {
    return (
      <button
        onClick={() => setEditing(true)}
        disabled={isPending}
        className="flex h-14 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-gray-400 transition-colors hover:border-emerald-300 hover:text-emerald-500 disabled:opacity-50"
        aria-label={`Add ${meal} on ${day}`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    );
  }

  return (
    <div className="group relative rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-xs">
      <p className="font-medium text-emerald-900 line-clamp-2 leading-tight">{entry.recipe.name}</p>
      <div className="mt-1 flex items-center gap-1.5">
        <button
          onClick={() => handleUpdate(Math.max(1, entry.people - 1), entry.extraServings)}
          className="rounded p-0.5 text-emerald-600 hover:bg-emerald-100"
          disabled={isPending}
        >–</button>
        <span className="text-emerald-700">{entry.people}p</span>
        <button
          onClick={() => handleUpdate(entry.people + 1, entry.extraServings)}
          className="rounded p-0.5 text-emerald-600 hover:bg-emerald-100"
          disabled={isPending}
        >+</button>
        {entry.extraServings > 0 && (
          <span className="text-emerald-500">+{entry.extraServings} extra</span>
        )}
      </div>
      <div className="absolute right-1 top-1 hidden gap-0.5 group-hover:flex">
        <button
          onClick={() => setEditing(true)}
          className="rounded p-0.5 text-gray-400 hover:bg-white hover:text-gray-600"
          title="Change recipe"
          disabled={isPending}
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 0L20 8l-7 7H9v-2z" />
          </svg>
        </button>
        <button
          onClick={handleRemove}
          className="rounded p-0.5 text-gray-400 hover:bg-white hover:text-red-500"
          title="Remove"
          disabled={isPending}
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
