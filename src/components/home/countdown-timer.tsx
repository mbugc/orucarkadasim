"use client";

import { Clock } from "lucide-react";
import { useCountdown } from "@/hooks/use-countdown";
import { useTodayPrayerTimes } from "@/hooks/use-prayer-times";
import { formatCountdown } from "@/lib/utils";

export function CountdownTimer() {
  const { todayTimings, todayData } = useTodayPrayerTimes();
  const countdown = useCountdown(todayTimings);

  if (!todayData || !todayTimings) return null;

  return (
    <div className="countdown-gradient rounded-2xl border border-border p-6">
      <div className="text-center">
        {countdown.isAfterIftar ? (
          <>
            <p className="text-sm font-medium text-primary">
              Hayırlı İftarlar!
            </p>
            <p className="mt-1 text-3xl font-bold text-foreground">
              Oruç Açıldı
            </p>
          </>
        ) : (
          <>
            <div className="mb-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{countdown.targetLabel} vaktine kalan</span>
            </div>
            <p className="font-mono text-4xl font-bold tracking-wider text-primary">
              {formatCountdown(countdown.remaining)}
            </p>
          </>
        )}

        <div className="mt-4 flex justify-center gap-8">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">İmsak</p>
            <p className="text-sm font-semibold text-foreground">
              {todayTimings.Imsak}
            </p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground">İftar</p>
            <p className="text-sm font-semibold text-foreground">
              {todayTimings.Maghrib}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
