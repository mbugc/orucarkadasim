"use client";

import { RotateCcw } from "lucide-react";
import {
  useTesbihStore,
  ZIKR_NAMES,
  ZIKR_TARGETS_ARRAY,
} from "@/store/tesbih-store";
import { cn } from "@/lib/utils";
import { AdBanner } from "@/components/ads/ad-banner";
import { AD_PLACEMENTS } from "@/lib/ad-config";

export default function TesbihPage() {
  const { currentZikr, counts, totalCount, increment, reset } =
    useTesbihStore();

  const currentCount = counts[currentZikr];
  const currentTarget = ZIKR_TARGETS_ARRAY[currentZikr];
  const progress = currentCount / currentTarget;
  const isComplete = counts[0] >= 33 && counts[1] >= 33 && counts[2] >= 34;

  const handleTap = () => {
    if (isComplete) return;
    increment();

    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(progress, 1));

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <h2 className="text-lg font-bold">Tesbih</h2>

      {/* Zikir gösterge tabları */}
      <div className="flex w-full gap-1 rounded-xl bg-muted p-1">
        {ZIKR_NAMES.map((name, i) => (
          <div
            key={name}
            className={cn(
              "flex-1 rounded-lg px-2 py-2 text-center text-xs font-medium transition-colors",
              i === currentZikr
                ? "bg-primary text-primary-foreground"
                : counts[i] >= ZIKR_TARGETS_ARRAY[i]
                  ? "bg-accent/20 text-accent"
                  : "text-muted-foreground"
            )}
          >
            <div className="truncate">{name}</div>
            <div className="mt-0.5 text-[10px]">
              {counts[i]}/{ZIKR_TARGETS_ARRAY[i]}
            </div>
          </div>
        ))}
      </div>

      {/* Dokunma alanı + ilerleme halkası */}
      <button
        onClick={handleTap}
        disabled={isComplete}
        className="relative flex h-60 w-60 items-center justify-center rounded-full transition-transform active:scale-95"
      >
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 240 240">
          <circle
            cx="120"
            cy="120"
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="6"
          />
          <circle
            cx="120"
            cy="120"
            r={radius}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-200"
          />
        </svg>

        <div className="text-center">
          <p className="text-5xl font-bold text-primary">{currentCount}</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {ZIKR_NAMES[currentZikr]}
          </p>
        </div>
      </button>

      {/* Toplam sayaç */}
      <div className="rounded-xl bg-muted/50 px-6 py-2 text-center">
        <p className="text-xs text-muted-foreground">
          Toplam:{" "}
          <span className="font-semibold text-foreground">
            {totalCount}/100
          </span>
        </p>
      </div>

      {/* Tamamlandı mesajı */}
      {isComplete && (
        <div className="rounded-xl bg-accent/10 px-4 py-3 text-center">
          <p className="text-sm font-medium text-accent">
            MaşaAllah! Tesbihat tamamlandı.
          </p>
        </div>
      )}

      {/* Sıfırla butonu */}
      <button
        onClick={reset}
        className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <RotateCcw className="h-4 w-4" />
        Sıfırla
      </button>

      <AdBanner slot={AD_PLACEMENTS.tesbihBanner} />
    </div>
  );
}
