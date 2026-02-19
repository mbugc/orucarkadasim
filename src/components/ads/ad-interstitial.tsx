"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { ADSENSE_PUB_ID, INTERSTITIAL_CONFIG } from "@/lib/ad-config";

/**
 * Tam sayfa (interstitial) reklam bileşeni.
 *
 * Davranış:
 * - Tab (sayfa) değişikliklerini sayar.
 * - navCountThreshold kadar değişiklikten sonra interstitial gösterir.
 * - Gösterimler arası minimum cooldownMs süre bırakır.
 * - 5 saniyelik geri sayım sonrası kapatma butonu aktif olur.
 * - AdSense slot boşsa (geliştirme) placeholder gösterir.
 */
export function AdInterstitial() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const navCount = useRef(0);
  const lastShown = useRef(0);
  const prevPathname = useRef(pathname);

  const close = useCallback(() => {
    setVisible(false);
    setCountdown(5);
    navCount.current = 0;
    lastShown.current = Date.now();
  }, []);

  // Sayfa değişimini algıla
  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    navCount.current += 1;

    const { navCountThreshold, cooldownMs } = INTERSTITIAL_CONFIG;
    const now = Date.now();
    const cooldownPassed = now - lastShown.current >= cooldownMs;

    if (navCount.current >= navCountThreshold && cooldownPassed) {
      setVisible(true);
    }
  }, [pathname]);

  // Geri sayım
  useEffect(() => {
    if (!visible) return;

    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [visible, countdown]);

  // AdSense push (slot tanımlanmışsa)
  useEffect(() => {
    if (!visible || !INTERSTITIAL_CONFIG.adSenseSlot) return;

    try {
      const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] })
        .adsbygoogle;
      if (adsbygoogle) {
        adsbygoogle.push({});
      }
    } catch {
      // sessizce geç
    }
  }, [visible]);

  if (!visible) return null;

  const canClose = countdown <= 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative mx-4 flex w-full max-w-lg flex-col items-center rounded-2xl bg-card p-6 shadow-2xl">
        {/* Kapat butonu */}
        <button
          onClick={canClose ? close : undefined}
          disabled={!canClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Reklamı kapat"
        >
          {canClose ? (
            <X className="h-4 w-4" />
          ) : (
            <span className="text-xs font-bold">{countdown}</span>
          )}
        </button>

        {/* Reklam alanı */}
        <div className="mt-4 w-full min-h-[250px] flex items-center justify-center">
          {INTERSTITIAL_CONFIG.adSenseSlot ? (
            <ins
              className="adsbygoogle block"
              style={{ display: "block", width: "100%", minHeight: 250 }}
              data-ad-client={ADSENSE_PUB_ID}
              data-ad-slot={INTERSTITIAL_CONFIG.adSenseSlot}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          ) : (
            <div className="flex h-[250px] w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/20">
              <p className="text-sm text-muted-foreground/50">
                Tam Sayfa Reklam Alanı
              </p>
            </div>
          )}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground">
          {canClose ? "Reklamı kapatabilirsiniz" : `${countdown} saniye sonra kapatılabilir`}
        </p>
      </div>
    </div>
  );
}
