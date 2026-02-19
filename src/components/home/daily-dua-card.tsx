"use client";

import { HandHelping } from "lucide-react";
import { useDailyContent } from "@/hooks/use-daily-content";

export function DailyDuaCard() {
  const { dua } = useDailyContent();

  if (!dua) return null;

  return (
    <div className="card-hover rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <HandHelping className="h-4 w-4 text-accent" />
        <h3 className="text-sm font-semibold text-accent">{dua.title}</h3>
      </div>

      <p className="font-arabic text-right text-lg leading-loose text-foreground/90" dir="rtl">
        {dua.arabic}
      </p>

      {dua.turkishTransliteration && (
        <p className="mt-2 text-sm italic text-muted-foreground">
          {dua.turkishTransliteration}
        </p>
      )}

      <p className="mt-2 text-sm leading-relaxed text-foreground/80">
        {dua.turkishMeaning}
      </p>
    </div>
  );
}
