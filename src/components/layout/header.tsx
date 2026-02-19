"use client";

import { Moon, Settings } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/store/app-store";
import { useRamadanDay } from "@/hooks/use-ramadan-day";

export function Header() {
  const { location } = useAppStore();
  const ramadanDay = useRamadanDay();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-sm font-bold text-foreground">
              Oruç Arkadaşım
            </h1>
            {location && (
              <p className="text-xs text-muted-foreground">
                {location.district
                  ? `${location.district}, ${location.city}`
                  : location.city}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {ramadanDay > 0 && ramadanDay <= 30 && (
            <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {ramadanDay}. Gün
            </span>
          )}
          <Link
            href="/ayarlar"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
