import { db } from "@/lib/db";
import { parseRecipe } from "@/lib/recipe-utils";
import { deleteRecipe } from "@/actions/recipe";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const raw = await db.recipe.findUnique({
    where: { id },
    include: { ingredients: true },
  });
  if (!raw) notFound();
  const recipe = parseRecipe(raw);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/recipes" className="text-sm text-gray-500 hover:text-gray-700">
              Recipes
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-sm text-gray-700">{recipe.name}</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{recipe.name}</h1>
          {recipe.description && <p className="mt-1 text-gray-500">{recipe.description}</p>}
        </div>
        <div className="flex shrink-0 gap-2">
          <Link href={`/recipes/${id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <form
            action={async () => {
              "use server";
              await deleteRecipe(id);
            }}
          >
            <Button variant="danger" type="submit">Delete</Button>
          </form>
        </div>
      </div>

      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="h-64 w-full rounded-xl object-cover"
        />
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetaBox label="Servings" value={String(recipe.servings)} />
        {recipe.prepMins != null && <MetaBox label="Prep" value={`${recipe.prepMins} min`} />}
        {recipe.cookMins != null && <MetaBox label="Cook" value={`${recipe.cookMins} min`} />}
        {recipe.calories != null && <MetaBox label="Calories" value={`${recipe.calories} kcal`} />}
      </div>

      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <Badge key={tag} variant="green">{tag}</Badge>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Ingredients */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing) => (
              <li key={ing.id} className="flex items-baseline justify-between gap-2 border-b border-gray-100 pb-2 last:border-0">
                <span className="text-sm text-gray-900">{ing.name}</span>
                <span className="shrink-0 text-sm text-gray-500">
                  {ing.quantity} {ing.unit}
                  {ing.notes && <span className="ml-1 text-gray-400">({ing.notes})</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Instructions</h2>
          <ol className="space-y-3">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {recipe.sourceUrl && (
        <p className="text-sm text-gray-400">
          Source:{" "}
          <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
            {recipe.sourceUrl}
          </a>
        </p>
      )}
    </div>
  );
}

function MetaBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 text-center shadow-sm">
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
