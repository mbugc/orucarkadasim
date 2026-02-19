// =============================================
// Google AdSense (Web) + AdMob (Capacitor) config
// =============================================
// Hesap açıldıktan sonra aşağıdaki değerleri doldurun:
//   ADSENSE_PUB_ID  → AdSense Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
//   Her slot'un adSenseSlot → AdSense'den alınan slot numarası
//   Her slot'un adMobId    → AdMob'dan alınan unit ID

export const ADSENSE_PUB_ID = "ca-pub-XXXXXXXXXXXXXXXX"; // TODO: gerçek ID

export type AdFormat = "banner" | "native" | "interstitial";

export interface AdSlot {
  id: string;
  format: AdFormat;
  /** AdSense data-ad-slot değeri (web) */
  adSenseSlot: string;
  /** AdMob unit ID (Capacitor mobil) — Android: ca-app-pub-xxx/yyy */
  adMobId: string;
}

// ── Banner & Native reklamlar ──────────────────────
export const AD_PLACEMENTS = {
  homeBetweenCards: {
    id: "home-between-cards",
    format: "native" as const,
    adSenseSlot: "", // TODO
    adMobId: "",     // TODO
  },
  imsakiyeBelow: {
    id: "imsakiye-below",
    format: "banner" as const,
    adSenseSlot: "", // TODO
    adMobId: "",     // TODO
  },
  menuBelow: {
    id: "menu-below",
    format: "banner" as const,
    adSenseSlot: "", // TODO
    adMobId: "",     // TODO
  },
  kibleBanner: {
    id: "kible-banner",
    format: "banner" as const,
    adSenseSlot: "", // TODO
    adMobId: "",     // TODO
  },
  tesbihBanner: {
    id: "tesbih-banner",
    format: "banner" as const,
    adSenseSlot: "", // TODO
    adMobId: "",     // TODO
  },
} as const;

// ── Interstitial (tam sayfa) reklam ────────────────
export const INTERSTITIAL_CONFIG = {
  adSenseSlot: "",  // TODO
  adMobId: "",      // TODO
  /** İlk gösterim öncesi kaç tab değişikliği beklenecek (ilk girişte gösterme) */
  navCountThreshold: 2,
  /** İki interstitial arası minimum süre (ms) — 60 saniye */
  cooldownMs: 60_000,
} as const;
