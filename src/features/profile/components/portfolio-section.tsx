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
import { portfolioSchema, type PortfolioInput } from "@/features/profile/schemas";
import type { PortfolioItem } from "@/types/profile";

interface Props {
  portfolio: PortfolioItem[];
  onChange: (portfolio: PortfolioItem[]) => void;
}

export function PortfolioSection({ portfolio, onChange }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PortfolioInput>({ resolver: zodResolver(portfolioSchema) });

  function onSubmit(values: PortfolioInput) {
    // Track B: replace with real API call -> services/profile.ts:addPortfolioItem(values)
    onChange([
      ...portfolio,
      {
        id: `p-${Date.now()}`,
        title: values.title,
        description: values.description,
        link: values.link || undefined,
      },
    ]);
    reset();
    setIsAdding(false);
  }

  function removeItem(id: string) {
    // Track B: replace with real API call -> services/profile.ts:removePortfolioItem(id)
    onChange(portfolio.filter((p) => p.id !== id));
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3>Portfolio</h3>
        {!isAdding && (
          <Button type="button" size="sm" variant="secondary" onClick={() => setIsAdding(true)}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add project
          </Button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {portfolio.map((item) => (
          <div key={item.id} className="rounded-md border border-border p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-text-primary">{item.title}</p>
              <button
                onClick={() => removeItem(item.id)}
                aria-label="Remove project"
                className="shrink-0 text-text-secondary hover:text-status-error"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-1 text-sm text-text-secondary">{item.description}</p>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-600"
              >
                View project <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        ))}
        {portfolio.length === 0 && !isAdding && (
          <p className="text-sm text-text-secondary sm:col-span-2">
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
            className="mt-4 space-y-4 overflow-hidden border-t border-border pt-4"
          >
            <div>
              <Label htmlFor="portTitle">Project title</Label>
              <Input id="portTitle" {...register("title")} />
              {errors.title && (
                <p className="mt-1 text-xs text-status-error">{errors.title.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="portDescription">Description</Label>
              <Textarea id="portDescription" rows={3} {...register("description")} />
              {errors.description && (
                <p className="mt-1 text-xs text-status-error">{errors.description.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="portLink">Project link (optional)</Label>
              <Input id="portLink" placeholder="https://..." {...register("link")} />
              {errors.link && (
                <p className="mt-1 text-xs text-status-error">{errors.link.message}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm">Save</Button>
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