"use client";

import { useEffect, useCallback } from "react";
import { useNotificationStore } from "@/store/notification-store";
import { useTodayPrayerTimes } from "./use-prayer-times";
import { timeStringToDate } from "@/lib/utils";

export function useNotificationScheduler() {
  const prefs = useNotificationStore();
  const { todayTimings } = useTodayPrayerTimes();

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "denied";
    }
    const permission = await Notification.requestPermission();
    prefs.setPermissionState(permission);
    return permission;
  }, [prefs]);

  const scheduleNotification = useCallback(
    (title: string, body: string, targetTime: Date) => {
      const delay = targetTime.getTime() - Date.now();
      if (delay <= 0) return null;

      return setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification(title, {
            body,
            icon: "/icon-192.png",
          });
        }
      }, delay);
    },
    []
  );

  useEffect(() => {
    if (!todayTimings || prefs.permissionState !== "granted") return;
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const now = new Date();

    // İmsak bildirimi
    if (prefs.imsakEnabled) {
      const imsakTime = timeStringToDate(todayTimings.Imsak, now);
      const notifyTime = new Date(
        imsakTime.getTime() - prefs.imsakMinutesBefore * 60000
      );
      const id = scheduleNotification(
        "İmsak Vakti Yaklaşıyor",
        `İmsak vaktine ${prefs.imsakMinutesBefore} dakika kaldı (${todayTimings.Imsak})`,
        notifyTime
      );
      if (id) timeouts.push(id);
    }

    // İftar bildirimi
    if (prefs.iftarEnabled) {
      const iftarTime = timeStringToDate(todayTimings.Maghrib, now);
      const notifyTime = new Date(
        iftarTime.getTime() - prefs.iftarMinutesBefore * 60000
      );
      const id = scheduleNotification(
        "İftar Vakti Yaklaşıyor",
        `İftar vaktine ${prefs.iftarMinutesBefore} dakika kaldı (${todayTimings.Maghrib})`,
        notifyTime
      );
      if (id) timeouts.push(id);
    }

    // Namaz vakitleri bildirimleri
    if (prefs.namazEnabled) {
      const prayers = [
        { key: "Imsak" as const, name: "İmsak" },
        { key: "Fajr" as const, name: "Sabah" },
        { key: "Dhuhr" as const, name: "Öğle" },
        { key: "Asr" as const, name: "İkindi" },
        { key: "Maghrib" as const, name: "Akşam" },
        { key: "Isha" as const, name: "Yatsı" },
      ];

      for (const prayer of prayers) {
        const time = todayTimings[prayer.key];
        const prayerDate = timeStringToDate(time, now);
        const id = scheduleNotification(
          `${prayer.name} Vakti`,
          `${prayer.name} namazı vakti girmiştir (${time})`,
          prayerDate
        );
        if (id) timeouts.push(id);
      }
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [
    todayTimings,
    prefs.imsakEnabled,
    prefs.imsakMinutesBefore,
    prefs.iftarEnabled,
    prefs.iftarMinutesBefore,
    prefs.namazEnabled,
    prefs.permissionState,
    scheduleNotification,
  ]);

  return { requestPermission };
}
