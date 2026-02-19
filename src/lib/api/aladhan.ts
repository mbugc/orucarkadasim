import type { StaticPrayerDay } from "./types";
import { RAMADAN_START, RAMADAN_END } from "@/lib/constants";

const BASE_URL = "https://api.aladhan.com/v1";

interface AladhanTiming {
  Imsak: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

interface AladhanDay {
  timings: AladhanTiming;
  date: {
    gregorian: { day: string; month: { number: number }; year: string };
  };
}

interface AladhanResponse {
  code: number;
  data: AladhanDay[];
}

function cleanTime(time: string): string {
  return time.replace(/\s*\(.*\)/, "").trim();
}

const CACHE_KEY_PREFIX = "oruc-prayer-times-";

function getCacheKey(lat: number, lng: number): string {
  return `${CACHE_KEY_PREFIX}${lat.toFixed(4)}-${lng.toFixed(4)}`;
}

export function getCachedPrayerTimes(
  lat: number,
  lng: number
): StaticPrayerDay[] | null {
  try {
    const key = getCacheKey(lat, lng);
    const cached = localStorage.getItem(key);
    if (cached) {
      const data = JSON.parse(cached);
      // Cache geçerliliğini kontrol et (7 gün)
      if (data.timestamp && Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000) {
        return data.days;
      }
    }
  } catch {
    // Cache okuma hatası, görmezden gel
  }
  return null;
}

function setCachedPrayerTimes(
  lat: number,
  lng: number,
  days: StaticPrayerDay[]
): void {
  try {
    const key = getCacheKey(lat, lng);
    localStorage.setItem(key, JSON.stringify({ days, timestamp: Date.now() }));
  } catch {
    // Cache yazma hatası, görmezden gel
  }
}

/**
 * Aladhan API'den belirli bir konum için Ramazan namaz vakitlerini çeker.
 * Diyanet hesaplama metodu (method=13) ve Hanefi mezhebi (school=1) kullanır.
 */
export async function fetchPrayerTimes(
  lat: number,
  lng: number
): Promise<StaticPrayerDay[]> {
  // Önce cache'e bak
  const cached = getCachedPrayerTimes(lat, lng);
  if (cached) return cached;

  const ramadanStart = RAMADAN_START;
  const ramadanEnd = RAMADAN_END;

  // Şubat ve Mart 2026 verilerini çek
  const months = [
    { year: ramadanStart.getFullYear(), month: ramadanStart.getMonth() + 1 },
  ];

  // Ramazan iki aya yayılıyorsa ikinci ayı da ekle
  if (ramadanEnd.getMonth() !== ramadanStart.getMonth()) {
    months.push({
      year: ramadanEnd.getFullYear(),
      month: ramadanEnd.getMonth() + 1,
    });
  }

  const allDays: AladhanDay[] = [];

  for (const { year, month } of months) {
    const url = `${BASE_URL}/calendar/${year}/${month}?latitude=${lat}&longitude=${lng}&method=13&school=1`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API hatası: ${response.status}`);
    }

    const data: AladhanResponse = await response.json();
    allDays.push(...data.data);
  }

  // Ramazan günlerini filtrele
  const ramadanDays: StaticPrayerDay[] = [];
  let dayNum = 1;

  for (const day of allDays) {
    const { gregorian } = day.date;
    const date = new Date(
      parseInt(gregorian.year),
      gregorian.month.number - 1,
      parseInt(gregorian.day)
    );

    if (date >= ramadanStart && date <= ramadanEnd && dayNum <= 30) {
      const t = day.timings;
      ramadanDays.push({
        date: `${gregorian.day.padStart(2, "0")}-${String(gregorian.month.number).padStart(2, "0")}-${gregorian.year}`,
        day: dayNum,
        imsak: cleanTime(t.Imsak),
        fajr: cleanTime(t.Fajr),
        sunrise: cleanTime(t.Sunrise),
        dhuhr: cleanTime(t.Dhuhr),
        asr: cleanTime(t.Asr),
        maghrib: cleanTime(t.Maghrib),
        isha: cleanTime(t.Isha),
      });
      dayNum++;
    }
  }

  // Cache'e kaydet
  if (ramadanDays.length > 0) {
    setCachedPrayerTimes(lat, lng, ramadanDays);
  }

  return ramadanDays;
}
