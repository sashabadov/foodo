import Link from "next/link";
import { db } from "@/lib/db";
import { parseRecipe } from "@/lib/recipe-utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default async function RecipesPage() {
  const recipes = await db.recipe.findMany({
    orderBy: { createdAt: "desc" },
    include: { ingredients: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Recipes</h1>
        <Link href="/recipes/new">
          <Button>+ New recipe</Button>
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <p className="text-gray-500">No recipes yet.</p>
          <Link href="/recipes/new" className="mt-3 inline-block text-sm font-medium text-emerald-600 hover:underline">
            Add your first recipe
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r) => {
            const recipe = parseRecipe(r);
            return (
              <Link
                key={r.id}
                href={`/recipes/${r.id}`}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                {r.imageUrl && (
                  <img
                    src={r.imageUrl}
                    alt={r.name}
                    className="mb-3 h-36 w-full rounded-lg object-cover"
                  />
                )}
                <h3 className="font-semibold text-gray-900 line-clamp-2">{r.name}</h3>
                {r.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{r.description}</p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span>{r.servings} servings</span>
                  {r.prepMins && <span>{r.prepMins + (r.cookMins ?? 0)} min</span>}
                  <span>{r.ingredients.length} ingredients</span>
                </div>
                {recipe.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
