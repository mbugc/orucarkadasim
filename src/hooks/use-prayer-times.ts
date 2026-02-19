"use client";

import { useMemo, useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/store/app-store";
import { useRamadanDay } from "./use-ramadan-day";
import type { StaticPrayerDay, PrayerTimings } from "@/lib/api/types";
import { fetchPrayerTimes, getCachedPrayerTimes } from "@/lib/api/aladhan";
import prayerTimesData from "@/data/prayer-times-static.json";

type PrayerTimesMap = Record<
  string,
  { lat: number; lng: number; days: StaticPrayerDay[] }
>;

// İlçe verisi için cache (uygulama içi, localStorage'a ek olarak)
const memoryCache = new Map<string, StaticPrayerDay[]>();

function getMemoryCacheKey(lat: number, lng: number): string {
  return `${lat.toFixed(4)}-${lng.toFixed(4)}`;
}

/**
 * Ramazan namaz vakitlerini getirir.
 * - İl seçilmişse: statik veriden
 * - İlçe seçilmişse: API'den (cache'li) + il verisi fallback
 */
export function useRamadanPrayerTimes() {
  const location = useAppStore((s) => s.location);
  const [districtDays, setDistrictDays] = useState<StaticPrayerDay[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // İl seviyesi statik veri (her zaman mevcut, fallback olarak)
  const cityDays = useMemo(() => {
    if (!location) return [];
    const cityData = (prayerTimesData as PrayerTimesMap)[location.city];
    return cityData?.days ?? [];
  }, [location]);

  // İlçe seçilince API'den çek
  const fetchDistrict = useCallback(async () => {
    if (!location?.district) {
      setDistrictDays(null);
      setError(null);
      return;
    }

    const key = getMemoryCacheKey(location.lat, location.lng);

    // Önce memory cache
    const memoryCached = memoryCache.get(key);
    if (memoryCached) {
      setDistrictDays(memoryCached);
      return;
    }

    // Sonra localStorage cache
    const localCached = getCachedPrayerTimes(location.lat, location.lng);
    if (localCached) {
      memoryCache.set(key, localCached);
      setDistrictDays(localCached);
      return;
    }

    // API'den çek
    setLoading(true);
    setError(null);

    try {
      const days = await fetchPrayerTimes(location.lat, location.lng);
      memoryCache.set(key, days);
      setDistrictDays(days);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("İlçe namaz vakitleri yüklenemedi.")
      );
      // Hata durumunda il verisine fallback
      setDistrictDays(null);
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchDistrict();
  }, [fetchDistrict]);

  // İlçe verisi varsa onu, yoksa il verisini kullan
  const ramadanDays = districtDays ?? cityDays;

  return {
    ramadanDays,
    isLoading: loading,
    error,
    isDistrictData: districtDays !== null,
  };
}

/**
 * Bugünün namaz vakitlerini PrayerTimings formatında getirir.
 */
export function useTodayPrayerTimes() {
  const { ramadanDays, isLoading } = useRamadanPrayerTimes();
  const ramadanDay = useRamadanDay();

  return useMemo(() => {
    if (ramadanDays.length === 0 || ramadanDay < 1 || ramadanDay > 30) {
      return { todayTimings: null, todayData: null, isLoading };
    }

    const todayData = ramadanDays[ramadanDay - 1];

    if (!todayData) {
      return { todayTimings: null, todayData: null, isLoading };
    }

    const todayTimings: PrayerTimings = {
      Imsak: todayData.imsak,
      Fajr: todayData.fajr,
      Sunrise: todayData.sunrise,
      Dhuhr: todayData.dhuhr,
      Asr: todayData.asr,
      Maghrib: todayData.maghrib,
      Isha: todayData.isha,
    };

    return { todayTimings, todayData, isLoading };
  }, [ramadanDays, ramadanDay, isLoading]);
}
