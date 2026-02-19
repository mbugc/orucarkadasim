import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotificationState {
  imsakEnabled: boolean;
  imsakMinutesBefore: number;
  iftarEnabled: boolean;
  iftarMinutesBefore: number;
  namazEnabled: boolean;
  permissionState: string; // "default" | "granted" | "denied"

  setImsakEnabled: (enabled: boolean) => void;
  setImsakMinutesBefore: (minutes: number) => void;
  setIftarEnabled: (enabled: boolean) => void;
  setIftarMinutesBefore: (minutes: number) => void;
  setNamazEnabled: (enabled: boolean) => void;
  setPermissionState: (state: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      imsakEnabled: false,
      imsakMinutesBefore: 30,
      iftarEnabled: false,
      iftarMinutesBefore: 15,
      namazEnabled: false,
      permissionState: "default",

      setImsakEnabled: (enabled) => set({ imsakEnabled: enabled }),
      setImsakMinutesBefore: (minutes) =>
        set({ imsakMinutesBefore: minutes }),
      setIftarEnabled: (enabled) => set({ iftarEnabled: enabled }),
      setIftarMinutesBefore: (minutes) =>
        set({ iftarMinutesBefore: minutes }),
      setNamazEnabled: (enabled) => set({ namazEnabled: enabled }),
      setPermissionState: (state) => set({ permissionState: state }),
    }),
    {
      name: "oruc-notification-store",
    }
  )
);
