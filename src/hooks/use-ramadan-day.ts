"use client";

import { useState, useEffect } from "react";
import { differenceInCalendarDays } from "date-fns";
import { RAMADAN_START } from "@/lib/constants";

export function useRamadanDay(): number {
  const [day, setDay] = useState(0);

  useEffect(() => {
    const today = new Date();
    const diff = differenceInCalendarDays(today, RAMADAN_START);
    setDay(Math.max(0, Math.min(30, diff + 1)));
  }, []);

  return day;
}
