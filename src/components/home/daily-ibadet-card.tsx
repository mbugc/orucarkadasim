"use client";

import { useState } from "react";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { useDailyContent } from "@/hooks/use-daily-content";

export function DailyIbadetCard() {
  const { ibadet } = useDailyContent();
  const [expanded, setExpanded] = useState(false);

  if (!ibadet) return null;

  const visibleItems = expanded
    ? ibadet.suggestions
    : ibadet.suggestions.slice(0, 2);
  const hasMore = ibadet.suggestions.length > 2;

  return (
    <div className="card-hover rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <Star className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-primary">{ibadet.title}</h3>
      </div>

      <div className="space-y-2">
        {visibleItems.map((item: { type: string; title: string; description: string }, index: number) => (
          <div key={index} className="rounded-lg bg-muted/30 p-3">
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium capitalize text-primary">
                {item.type}
              </span>
              <h4 className="text-xs font-semibold text-foreground">
                {item.title}
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
        >
          {expanded ? (
            <>
              Daralt
              <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              +{ibadet.suggestions.length - 2} daha fazla ibadet önerisi
              <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
