import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Location {
  city: string;
  district?: string;
  lat: number;
  lng: number;
}

interface AppState {
  location: Location | null;
  setLocation: (location: Location) => void;
  clearLocation: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      location: null,
      setLocation: (location) => set({ location }),
      clearLocation: () => set({ location: null }),
    }),
    {
      name: "oruc-arkadasim-store",
    }
  )
);
