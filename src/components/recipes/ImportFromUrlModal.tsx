"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";
import type { RecipeInput } from "@/types";

interface ImportFromUrlModalProps {
  onImport?: (data: Partial<RecipeInput>) => void;
}

export function ImportFromUrlModal({ onImport }: ImportFromUrlModalProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/scrape-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error === "no_recipe_found" ? "No recipe found at that URL" : `Error: ${data.error}`);
        return;
      }
      onImport?.(data);
      toast.success("Recipe imported! Review and save.");
      setOpen(false);
      setUrl("");
    } catch {
      toast.error("Failed to import recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Import from URL
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Import recipe from URL">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Paste a link to any recipe page (BBC Good Food, AllRecipes, etc.) and we&apos;ll extract the details.
          </p>
          <Input
            label="Recipe URL"
            type="url"
            placeholder="https://www.bbcgoodfood.com/recipes/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleImport()}
          />
          <div className="flex gap-2">
            <Button onClick={handleImport} disabled={loading || !url.trim()}>
              {loading ? <><Spinner className="mr-2" /> Importing…</> : "Import"}
            </Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
