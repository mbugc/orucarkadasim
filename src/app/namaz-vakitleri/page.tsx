"use client";

import { Clock } from "lucide-react";
import { useTodayPrayerTimes } from "@/hooks/use-prayer-times";
import { useAppStore } from "@/store/app-store";
import { PRAYER_NAMES, TURKISH_DAYS } from "@/lib/constants";
import { cn, timeStringToDate } from "@/lib/utils";
import type { PrayerTimings } from "@/lib/api/types";
import { useState, useEffect } from "react";

const PRAYER_KEYS = ["Imsak", "Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

function getNextPrayer(timings: PrayerTimings): string | null {
  const now = new Date();
  for (const key of PRAYER_KEYS) {
    const time = timings[key as keyof PrayerTimings];
    const prayerDate = timeStringToDate(time, now);
    if (now < prayerDate) return key;
  }
  return null;
}

export default function NamazVakitleriPage() {
  const { todayTimings } = useTodayPrayerTimes();
  const location = useAppStore((s) => s.location);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);

  useEffect(() => {
    if (!todayTimings) return;

    const update = () => {
      setNextPrayer(getNextPrayer(todayTimings));
    };

    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [todayTimings]);

  const today = new Date();
  const dayName = TURKISH_DAYS[today.getDay()];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-lg font-bold">Namaz Vakitleri</h2>
          <p className="text-xs text-muted-foreground">
            {today.getDate()}{" "}
            {today.toLocaleDateString("tr-TR", { month: "long" })}{" "}
            {today.getFullYear()} | {dayName}
            {location
              ? ` | ${location.district ? `${location.district}, ${location.city}` : location.city}`
              : ""}
          </p>
        </div>
      </div>

      {todayTimings && (
        <div className="space-y-2">
          {PRAYER_KEYS.map((key) => {
            const isNext = key === nextPrayer;
            const time = todayTimings[key as keyof PrayerTimings];
            const name = PRAYER_NAMES[key] || key;

            return (
              <div
                key={key}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-4 py-3.5 transition-colors",
                  isNext
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-center gap-3">
                  {isNext && (
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  )}
                  <span
                    className={cn(
                      "font-medium",
                      isNext ? "text-primary" : "text-foreground"
                    )}
                  >
                    {name}
                  </span>
                </div>
                <span
                  className={cn(
                    "font-mono text-lg font-semibold",
                    isNext ? "text-primary" : "text-foreground"
                  )}
                >
                  {time}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
