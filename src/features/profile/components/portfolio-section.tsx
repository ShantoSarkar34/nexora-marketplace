"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Plus, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  useAddPortfolio,
  useRemovePortfolio,
} from "@/hooks/use-freelancer-profile";
import {
  portfolioSchema,
  type PortfolioInput,
} from "@/features/profile/schemas";
import type { PortfolioItem } from "@/types/profile";

export function PortfolioSection({
  portfolio,
}: {
  portfolio: PortfolioItem[];
}) {
  const [isAdding, setIsAdding] = useState(false);
  const addPortfolio = useAddPortfolio();
  const removePortfolio = useRemovePortfolio();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PortfolioInput>({
    resolver: zodResolver(portfolioSchema),
  });

  async function onSubmit(values: PortfolioInput) {
    try {
      await addPortfolio.mutateAsync(values);
      reset();
      setIsAdding(false);
    } catch {
      // toasted globally
    }
  }

  async function handleRemove(id: string) {
    try {
      await removePortfolio.mutateAsync(id);
    } catch {
      // toasted globally
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3>Portfolio</h3>
        {!isAdding && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add project
          </Button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {portfolio.map((item) => (
          <div key={item.id} className="border-border rounded-md border p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-text-primary text-sm font-medium">
                {item.title}
              </p>
              <button
                onClick={() => handleRemove(item.id)}
                aria-label="Remove project"
                className="text-text-secondary hover:text-status-error shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            {item.description && (
              <p className="text-text-secondary mt-1 text-sm">
                {item.description}
              </p>
            )}
            {item.projectUrl && (
              <a
                href={item.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 mt-2 flex items-center gap-1 text-xs font-medium"
              >
                View project <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        ))}
        {portfolio.length === 0 && !isAdding && (
          <p className="text-text-secondary text-sm sm:col-span-2">
            No portfolio projects added yet.
          </p>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="border-border mt-4 space-y-4 overflow-hidden border-t pt-4"
          >
            <div>
              <Label htmlFor="portTitle">Project title</Label>
              <Input id="portTitle" {...register("title")} />
              {errors.title && (
                <p className="text-status-error mt-1 text-xs">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="portDescription">Description (optional)</Label>
              <Textarea
                id="portDescription"
                rows={3}
                {...register("description")}
              />
            </div>
            <div>
              <Label htmlFor="portUrl">Project link (optional)</Label>
              <Input
                id="portUrl"
                placeholder="https://..."
                {...register("projectUrl")}
              />
              {errors.projectUrl && (
                <p className="text-status-error mt-1 text-xs">
                  {errors.projectUrl.message}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                isLoading={addPortfolio.isPending}
              >
                Save
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  reset();
                  setIsAdding(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Card>
  );
}
