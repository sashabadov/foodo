import { db } from "@/lib/db";
import { getWeekStart, formatDate } from "@/lib/utils";
import { buildShoppingList, formatShoppingList } from "@/lib/aggregator";
import { GROCERY_CATEGORIES } from "@/types";
import { CopyButton } from "@/components/shopping/CopyButton";
import Link from "next/link";

export default async function ShoppingListPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { week } = await searchParams;
  const weekStart = week ?? getWeekStart();

  const mealPlan = await db.mealPlan.findUnique({
    where: { weekStartDate: weekStart },
    include: {
      mealEntries: {
        include: {
          recipe: { include: { ingredients: true } },
        },
      },
    },
  });

  const entries = mealPlan?.mealEntries ?? [];
  const list = buildShoppingList(entries);
  const plainText = formatShoppingList(list);
  const isEmpty = GROCERY_CATEGORIES.every((c) => list[c].length === 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shopping List</h1>
          <p className="mt-1 text-sm text-gray-500">
            Week of {formatDate(weekStart)} · {entries.length} meal{entries.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          {!isEmpty && <CopyButton text={plainText} />}
          <Link
            href={`/planner?week=${weekStart}`}
            className="text-sm font-medium text-emerald-600 hover:underline self-center"
          >
            Edit planner
          </Link>
        </div>
      </div>

      {isEmpty ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <p className="text-gray-500">No meals planned for this week.</p>
          <Link
            href={`/planner?week=${weekStart}`}
            className="mt-3 inline-block text-sm font-medium text-emerald-600 hover:underline"
          >
            Add meals to the planner
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GROCERY_CATEGORIES.map((cat) => {
            const items = list[cat];
            if (items.length === 0) return null;
            return (
              <div
                key={cat}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
                  {cat}
                </h2>
                <ul className="space-y-1.5">
                  {items.map((item) => (
                    <li key={item.name} className="flex items-baseline justify-between gap-2">
                      <span className="text-sm text-gray-900">{item.name}</span>
                      <span className="shrink-0 text-sm text-gray-500">
                        {item.quantity > 0 && `${item.quantity}${item.unit ? " " + item.unit : ""}`}
                        {item.notes && (
                          <span className="ml-1 text-xs text-gray-400">({item.notes})</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
