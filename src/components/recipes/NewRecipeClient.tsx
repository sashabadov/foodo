"use client";

import { useState } from "react";
import { RecipeForm } from "./RecipeForm";
import { ImportFromUrlModal } from "./ImportFromUrlModal";
import { GenerateWithAiModal } from "./GenerateWithAiModal";
import type { RecipeInput } from "@/types";

export function NewRecipeClient() {
  const [prefill, setPrefill] = useState<Partial<RecipeInput> | undefined>();
  const [formKey, setFormKey] = useState(0);

  const handlePrefill = (data: Partial<RecipeInput>) => {
    // Ensure tags is always an array
    if (data.tags && !Array.isArray(data.tags)) {
      data.tags = [];
    }
    setPrefill(data);
    setFormKey((k) => k + 1); // force RecipeForm to remount with new defaults
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New recipe</h1>
          <p className="mt-1 text-sm text-gray-500">Fill in manually or use one of the shortcuts below.</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <ImportFromUrlModal onImport={handlePrefill} />
          <GenerateWithAiModal onGenerate={handlePrefill} />
        </div>
      </div>
      <RecipeForm key={formKey} defaultValues={prefill} />
    </div>
  );
}
