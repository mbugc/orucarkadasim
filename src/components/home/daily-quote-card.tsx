"use client";

import { Quote } from "lucide-react";
import { useDailyContent } from "@/hooks/use-daily-content";

export function DailyQuoteCard() {
  const { nasihat } = useDailyContent();

  if (!nasihat) return null;

  return (
    <div className="card-hover rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <Quote className="h-4 w-4 text-gold-light" />
        <h3 className="text-sm font-semibold text-gold-light">
          Günün Nasihati
        </h3>
      </div>

      <p className="text-sm leading-relaxed text-foreground/90">
        &ldquo;{nasihat.quote}&rdquo;
      </p>

      <p className="mt-2 text-xs font-medium text-primary">{nasihat.source}</p>

      {nasihat.explanation && (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {nasihat.explanation}
        </p>
      )}
    </div>
  );
}
