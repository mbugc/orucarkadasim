"use client";

import { useEffect, useRef } from "react";
import type { AdSlot } from "@/lib/ad-config";
import { ADSENSE_PUB_ID } from "@/lib/ad-config";

interface AdBannerProps {
  slot: AdSlot;
  className?: string;
}

/**
 * Google AdSense banner / native reklam bileşeni.
 * - Web: AdSense <ins> etiketi oluşturur ve adsbygoogle.push ile tetikler.
 * - Mobil (Capacitor): AdMob entegrasyonu ileride Capacitor plugin ile yapılacak.
 * - adSenseSlot boşsa placeholder gösterir (geliştirme ortamı).
 */
export function AdBanner({ slot, className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Slot ID henüz tanımlanmamışsa push etme
    if (!slot.adSenseSlot || pushed.current) return;

    try {
      const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] })
        .adsbygoogle;
      if (adsbygoogle) {
        adsbygoogle.push({});
        pushed.current = true;
      }
    } catch {
      // AdSense script yüklenmemişse sessizce geç
    }
  }, [slot.adSenseSlot]);

  // Slot ID yoksa geliştirme placeholder'ı göster
  if (!slot.adSenseSlot) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/20 py-4 ${className}`}
        data-ad-slot={slot.id}
      >
        <p className="text-[10px] text-muted-foreground/50">Reklam Alanı</p>
      </div>
    );
  }

  const adFormat = slot.format === "native" ? "fluid" : "auto";
  const layoutKey = slot.format === "native" ? "-fb+5w+4e-db+86" : undefined;

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE_PUB_ID}
      data-ad-slot={slot.adSenseSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
      {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
    />
  );
}
