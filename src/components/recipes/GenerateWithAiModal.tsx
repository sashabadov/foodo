"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";
import type { RecipeInput } from "@/types";

interface GenerateWithAiModalProps {
  onGenerate?: (data: Partial<RecipeInput>) => void;
}

export function GenerateWithAiModal({ onGenerate }: GenerateWithAiModalProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(`Error: ${data.error}`);
        return;
      }
      onGenerate?.(data);
      toast.success("Recipe generated! Review and save.");
      setOpen(false);
      setPrompt("");
    } catch {
      toast.error("Failed to generate recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Generate with AI
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Generate recipe with AI">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Describe what you want and Claude will generate a full recipe with ingredients and instructions.
          </p>
          <div>
            <label className="text-sm font-medium text-gray-700">Describe the recipe</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              rows={4}
              placeholder="e.g. A quick Thai green curry with chicken and vegetables, serves 4, ready in 30 minutes"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
              {loading ? <><Spinner className="mr-2" /> Generating…</> : "Generate"}
            </Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
