import Link from "next/link";
import { db } from "@/lib/db";
import { getWeekStart } from "@/lib/utils";

export default async function DashboardPage() {
  const [recipeCount, mealPlanCount] = await Promise.all([
    db.recipe.count(),
    db.mealPlan.count(),
  ]);

  const thisWeek = getWeekStart();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to foodo</h1>
        <p className="mt-2 text-gray-500">Plan your meals, scale recipes, and generate shopping lists.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Recipes saved" value={recipeCount} />
        <StatCard label="Weeks planned" value={mealPlanCount} />
        <StatCard label="Shopping lists" value={mealPlanCount} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLink
          href="/recipes/new"
          title="Add a recipe"
          description="Enter it manually, paste a URL, or describe it to AI"
          color="emerald"
        />
        <QuickLink
          href={`/planner?week=${thisWeek}`}
          title="Plan this week"
          description="Drag recipes into days and set portions"
          color="blue"
        />
        <QuickLink
          href="/shopping-list"
          title="Shopping list"
          description="Auto-aggregated from this week's plan"
          color="purple"
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}

function QuickLink({
  href,
  title,
  description,
  color,
}: {
  href: string;
  title: string;
  description: string;
  color: "emerald" | "blue" | "purple";
}) {
  const colorMap = {
    emerald: "border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50",
    blue: "border-blue-200 hover:border-blue-400 hover:bg-blue-50",
    purple: "border-purple-200 hover:border-purple-400 hover:bg-purple-50",
  };
  return (
    <Link
      href={href}
      className={`rounded-xl border-2 bg-white p-6 shadow-sm transition-colors ${colorMap[color]}`}
    >
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </Link>
  );
}
