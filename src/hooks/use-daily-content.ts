"use client";

import { useMemo } from "react";
import { useRamadanDay } from "./use-ramadan-day";
import menusData from "@/data/menus.json";
import duasData from "@/data/duas.json";
import ayetlerData from "@/data/ayetler.json";
import nasihatlerData from "@/data/nasihatler.json";
import ibadetlerData from "@/data/ibadetler.json";

export function useDailyContent() {
  const ramadanDay = useRamadanDay();

  return useMemo(() => {
    const dayIndex = Math.max(0, Math.min(29, ramadanDay - 1));

    return {
      ramadanDay,
      menu: menusData.days[dayIndex],
      dua: duasData.days[dayIndex],
      ayet: ayetlerData.days[dayIndex],
      nasihat: nasihatlerData.days[dayIndex],
      ibadet: ibadetlerData.days[dayIndex],
    };
  }, [ramadanDay]);
}
