"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { RecipeInput, Unit, GroceryCategory } from "@/types";
import { GROCERY_CATEGORIES } from "@/types";
import { createRecipe, updateRecipe } from "@/actions/recipe";
import { toast } from "sonner";
import { useTransition } from "react";

const UNIT_OPTIONS: { value: Unit; label: string }[] = [
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
  { value: "ml", label: "ml" },
  { value: "l", label: "l" },
  { value: "tsp", label: "tsp" },
  { value: "tbsp", label: "tbsp" },
  { value: "cup", label: "cup" },
  { value: "oz", label: "oz" },
  { value: "lb", label: "lb" },
  { value: "piece", label: "piece" },
  { value: "clove", label: "clove" },
  { value: "can", label: "can" },
  { value: "bunch", label: "bunch" },
  { value: "slice", label: "slice" },
  { value: "", label: "—" },
];

const CATEGORY_OPTIONS = GROCERY_CATEGORIES.map((c) => ({
  value: c,
  label: c.charAt(0).toUpperCase() + c.slice(1),
}));

interface RecipeFormProps {
  defaultValues?: Partial<RecipeInput>;
  recipeId?: string;
}

export function RecipeForm({ defaultValues, recipeId }: RecipeFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipeInput>({
    defaultValues: {
      name: "",
      servings: 2,
      instructions: [""],
      tags: [],
      ingredients: [{ name: "", quantity: 1, unit: "g", category: "other" }],
      sourceType: "manual",
      ...defaultValues,
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control, name: "ingredients" });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({ control, name: "instructions" as never });

  const onSubmit = (data: RecipeInput) => {
    // Filter empty instructions
    data.instructions = (data.instructions as unknown as string[]).filter((s) => s.trim());
    startTransition(async () => {
      try {
        if (recipeId) {
          await updateRecipe(recipeId, data);
        } else {
          await createRecipe(data);
        }
      } catch (e: unknown) {
        // redirect throws, which is expected — ignore NEXT_REDIRECT
        if (e instanceof Error && e.message === "NEXT_REDIRECT") return;
        toast.error("Failed to save recipe");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic info */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-900">Basic info</h2>
        <Input
          label="Recipe name *"
          id="name"
          {...register("name", { required: "Name is required" })}
          error={errors.name?.message}
        />
        <div>
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            rows={2}
            {...register("description")}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Input label="Servings *" id="servings" type="number" min={1} {...register("servings", { valueAsNumber: true, min: 1 })} />
          <Input label="Prep (min)" id="prepMins" type="number" min={0} {...register("prepMins", { valueAsNumber: true })} />
          <Input label="Cook (min)" id="cookMins" type="number" min={0} {...register("cookMins", { valueAsNumber: true })} />
        </div>
        <Input label="Image URL" id="imageUrl" type="url" {...register("imageUrl")} />
        <Input label="Source URL" id="sourceUrl" type="url" {...register("sourceUrl")} />
        <Input
          label="Tags (comma-separated)"
          id="tags"
          placeholder="italian, pasta, quick"
          {...register("tags", {
            setValueAs: (v: string | string[]) =>
              Array.isArray(v) ? v : v.split(",").map((t: string) => t.trim()).filter(Boolean),
          })}
        />
      </section>

      {/* Ingredients */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-900">Ingredients</h2>
        <div className="space-y-3">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label={index === 0 ? "Name" : undefined}
                  placeholder="e.g. onion"
                  {...register(`ingredients.${index}.name`, { required: true })}
                />
              </div>
              <div className="w-20">
                <Input
                  label={index === 0 ? "Qty" : undefined}
                  type="number"
                  step="0.01"
                  min={0}
                  {...register(`ingredients.${index}.quantity`, { valueAsNumber: true })}
                />
              </div>
              <div className="w-24">
                <Select
                  label={index === 0 ? "Unit" : undefined}
                  options={UNIT_OPTIONS}
                  {...register(`ingredients.${index}.unit`)}
                />
              </div>
              <div className="w-28">
                <Select
                  label={index === 0 ? "Category" : undefined}
                  options={CATEGORY_OPTIONS}
                  {...register(`ingredients.${index}.category`)}
                />
              </div>
              <div className="flex-1">
                <Input
                  label={index === 0 ? "Notes" : undefined}
                  placeholder="e.g. finely chopped"
                  {...register(`ingredients.${index}.notes`)}
                />
              </div>
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="mb-0.5 p-1.5 text-gray-400 hover:text-red-500"
                aria-label="Remove ingredient"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => appendIngredient({ name: "", quantity: 1, unit: "g", category: "other" })}
        >
          + Add ingredient
        </Button>
      </section>

      {/* Instructions */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-900">Instructions</h2>
        <div className="space-y-2">
          {instructionFields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <span className="mt-2.5 w-5 shrink-0 text-sm font-medium text-gray-400">{index + 1}.</span>
              <textarea
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                rows={2}
                placeholder={`Step ${index + 1}`}
                {...register(`instructions.${index}` as never)}
              />
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="mt-2.5 p-1.5 text-gray-400 hover:text-red-500"
                aria-label="Remove step"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => appendInstruction("" as never)}
        >
          + Add step
        </Button>
      </section>

      {/* Macros (optional) */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-900">Nutrition (optional, per serving)</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Input label="Calories" type="number" min={0} {...register("calories", { valueAsNumber: true })} />
          <Input label="Protein (g)" type="number" min={0} step="0.1" {...register("proteinG", { valueAsNumber: true })} />
          <Input label="Carbs (g)" type="number" min={0} step="0.1" {...register("carbsG", { valueAsNumber: true })} />
          <Input label="Fat (g)" type="number" min={0} step="0.1" {...register("fatG", { valueAsNumber: true })} />
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending} size="lg">
          {isPending ? "Saving…" : recipeId ? "Save changes" : "Create recipe"}
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={() => history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
