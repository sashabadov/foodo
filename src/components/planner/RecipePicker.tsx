"use client";

import { useState } from "react";

interface Recipe {
  id: string;
  name: string;
}

interface RecipePickerProps {
  recipes: Recipe[];
  onSelect: (recipeId: string) => void;
  onCancel: () => void;
}

export function RecipePicker({ recipes, onSelect, onCancel }: RecipePickerProps) {
  const [search, setSearch] = useState("");

  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-lg border border-emerald-300 bg-white shadow-md z-10 w-44">
      <div className="p-1.5">
        <input
          autoFocus
          type="text"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border border-gray-200 px-2 py-1 text-xs focus:border-emerald-400 focus:outline-none"
        />
      </div>
      <ul className="max-h-40 overflow-y-auto">
        {filtered.length === 0 ? (
          <li className="px-3 py-2 text-xs text-gray-400">No recipes found</li>
        ) : (
          filtered.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => onSelect(r.id)}
                className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {r.name}
              </button>
            </li>
          ))
        )}
      </ul>
      <div className="border-t border-gray-100 p-1.5">
        <button
          onClick={onCancel}
          className="w-full rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
