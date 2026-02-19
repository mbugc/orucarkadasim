"use client";

import { CountdownTimer } from "@/components/home/countdown-timer";
import { DailyVerseCard } from "@/components/home/daily-verse-card";
import { DailyDuaCard } from "@/components/home/daily-dua-card";
import { DailyQuoteCard } from "@/components/home/daily-quote-card";
import { DailyIbadetCard } from "@/components/home/daily-ibadet-card";
import { WelcomeModal } from "@/components/location/welcome-modal";
import { AdBanner } from "@/components/ads/ad-banner";
import { AD_PLACEMENTS } from "@/lib/ad-config";
import { useRamadanDay } from "@/hooks/use-ramadan-day";

export default function HomePage() {
  const ramadanDay = useRamadanDay();

  return (
    <>
      <WelcomeModal />
      <div className="space-y-4">
        {ramadanDay > 0 && ramadanDay <= 30 && (
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Ramazan 2026
            </p>
            <p className="text-sm text-muted-foreground">
              {ramadanDay}. Gün
            </p>
          </div>
        )}

        <CountdownTimer />
        <DailyVerseCard />
        <DailyDuaCard />
        <AdBanner slot={AD_PLACEMENTS.homeBetweenCards} />
        <DailyQuoteCard />
        <DailyIbadetCard />
      </div>
    </>
  );
}
