"use client";

import { useState, useEffect } from "react";
import { timeStringToDate } from "@/lib/utils";
import type { PrayerTimings } from "@/lib/api/types";

interface CountdownState {
  remaining: number; // saniye cinsinden
  targetLabel: string; // "İftar" veya "Sahur"
  targetTime: string; // "18:47"
  isAfterIftar: boolean;
}

export function useCountdown(timings: PrayerTimings | null | undefined): CountdownState {
  const [state, setState] = useState<CountdownState>({
    remaining: 0,
    targetLabel: "",
    targetTime: "",
    isAfterIftar: false,
  });

  useEffect(() => {
    if (!timings) return;

    const update = () => {
      const now = new Date();
      const imsakTime = timeStringToDate(timings.Imsak, now);
      const iftarTime = timeStringToDate(timings.Maghrib, now);

      let remaining: number;
      let targetLabel: string;
      let targetTime: string;
      let isAfterIftar = false;

      if (now < imsakTime) {
        remaining = Math.floor((imsakTime.getTime() - now.getTime()) / 1000);
        targetLabel = "Sahur";
        targetTime = timings.Imsak;
      } else if (now < iftarTime) {
        remaining = Math.floor((iftarTime.getTime() - now.getTime()) / 1000);
        targetLabel = "İftar";
        targetTime = timings.Maghrib;
      } else {
        remaining = 0;
        targetLabel = "İftar";
        targetTime = timings.Maghrib;
        isAfterIftar = true;
      }

      setState({ remaining, targetLabel, targetTime, isAfterIftar });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timings]);

  return state;
}
