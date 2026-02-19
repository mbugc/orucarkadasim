"use client";

import { CalendarDays, Loader2 } from "lucide-react";
import { useRamadanPrayerTimes } from "@/hooks/use-prayer-times";
import { useRamadanDay } from "@/hooks/use-ramadan-day";
import { useAppStore } from "@/store/app-store";
import { AdBanner } from "@/components/ads/ad-banner";
import { AD_PLACEMENTS } from "@/lib/ad-config";
import { useEffect, useRef } from "react";

// Tarih stringini formatla: "19-02-2026" → "19 Şub"
function formatDate(dateStr: string): string {
  const months: Record<string, string> = {
    "01": "Oca", "02": "Şub", "03": "Mar", "04": "Nis",
    "05": "May", "06": "Haz", "07": "Tem", "08": "Ağu",
    "09": "Eyl", "10": "Eki", "11": "Kas", "12": "Ara",
  };
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[0]} ${months[parts[1]] || parts[1]}`;
  }
  return dateStr;
}

export default function ImsakiyePage() {
  const { ramadanDays, error, isLoading, isDistrictData } = useRamadanPrayerTimes();
  const ramadanDay = useRamadanDay();
  const location = useAppStore((s) => s.location);
  const todayRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [ramadanDays.length]);

  const locationLabel = location
    ? location.district
      ? `${location.district}, ${location.city}`
      : location.city
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-lg font-bold">Ramazan İmsakiyesi 2026</h2>
          {locationLabel && (
            <p className="text-xs text-muted-foreground">
              {locationLabel} | Diyanet İşleri Başkanlığı hesaplama metodu
            </p>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="text-sm">İlçe namaz vakitleri yükleniyor...</p>
        </div>
      )}

      {error && (
        <p className="text-center text-sm text-destructive">
          {error.message}
        </p>
      )}

      {ramadanDays.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                <th className="px-2 py-2.5 text-left font-medium">Gün</th>
                <th className="px-2 py-2.5 text-left font-medium">Tarih</th>
                <th className="px-2 py-2.5 text-center font-medium">İmsak</th>
                <th className="px-2 py-2.5 text-center font-medium">Güneş</th>
                <th className="px-2 py-2.5 text-center font-medium">İftar</th>
              </tr>
            </thead>
            <tbody>
              {ramadanDays.map((day) => {
                const isToday = day.day === ramadanDay;

                return (
                  <tr
                    key={day.day}
                    ref={isToday ? todayRef : undefined}
                    className={
                      isToday
                        ? "today-row font-semibold"
                        : "border-b border-border/50"
                    }
                  >
                    <td className="px-2 py-2.5 text-left">{day.day}</td>
                    <td className="px-2 py-2.5 text-left text-xs text-muted-foreground">
                      {formatDate(day.date)}
                    </td>
                    <td className="px-2 py-2.5 text-center">{day.imsak}</td>
                    <td className="px-2 py-2.5 text-center">{day.sunrise}</td>
                    <td className="px-2 py-2.5 text-center font-semibold text-primary">
                      {day.maghrib}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AdBanner slot={AD_PLACEMENTS.imsakiyeBelow} />
    </div>
  );
}
