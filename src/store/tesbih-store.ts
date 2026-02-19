import { create } from "zustand";
import { persist } from "zustand/middleware";

const ZIKR_TARGETS = [33, 33, 34] as const;

export const ZIKR_NAMES = [
  "Sübhanallah",
  "Elhamdülillah",
  "Allahu Ekber",
] as const;

export const ZIKR_TARGETS_ARRAY = ZIKR_TARGETS;

interface TesbihState {
  currentZikr: 0 | 1 | 2;
  counts: [number, number, number];
  totalCount: number;
  increment: () => void;
  reset: () => void;
}

export const useTesbihStore = create<TesbihState>()(
  persist(
    (set) => ({
      currentZikr: 0,
      counts: [0, 0, 0],
      totalCount: 0,

      increment: () =>
        set((state) => {
          const newCounts = [...state.counts] as [number, number, number];
          let currentZikr = state.currentZikr;
          newCounts[currentZikr]++;

          // Hedefe ulaşınca sonraki zikre geç
          if (
            newCounts[currentZikr] >= ZIKR_TARGETS[currentZikr] &&
            currentZikr < 2
          ) {
            currentZikr = (currentZikr + 1) as 0 | 1 | 2;
          }

          return {
            counts: newCounts,
            currentZikr,
            totalCount: state.totalCount + 1,
          };
        }),

      reset: () =>
        set({
          currentZikr: 0,
          counts: [0, 0, 0],
          totalCount: 0,
        }),
    }),
    {
      name: "oruc-tesbih-store",
    }
  )
);
