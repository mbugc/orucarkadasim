"use client";

import { BookOpen } from "lucide-react";
import { useDailyContent } from "@/hooks/use-daily-content";

export function DailyVerseCard() {
  const { ayet } = useDailyContent();

  if (!ayet) return null;

  return (
    <div className="card-hover rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-primary">Günün Ayeti</h3>
      </div>

      <p className="font-arabic text-right text-lg leading-loose text-foreground/90" dir="rtl">
        {ayet.arabic}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        &ldquo;{ayet.turkish}&rdquo;
      </p>

      <p className="mt-2 text-xs text-muted-foreground">{ayet.reference}</p>
    </div>
  );
}
