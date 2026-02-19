"use client";

import { Compass } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useCompass } from "@/hooks/use-compass";
import { calculateQiblaBearing } from "@/lib/qibla";
import { AdBanner } from "@/components/ads/ad-banner";
import { AD_PLACEMENTS } from "@/lib/ad-config";

export default function KiblePage() {
  const location = useAppStore((s) => s.location);
  const { heading, error, permissionState, requestPermission } = useCompass();

  if (!location) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Compass className="mb-3 h-12 w-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Kıble yönünü görmek için önce konumunuzu ayarlayın.
        </p>
      </div>
    );
  }

  const qiblaBearing = calculateQiblaBearing(location.lat, location.lng);
  const rotation = heading != null ? qiblaBearing - heading : 0;
  const hasCompass = permissionState === "granted" && heading != null;

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="text-center">
        <h2 className="text-lg font-bold">Kıble Yönü</h2>
        <p className="text-xs text-muted-foreground">
          {location.district
            ? `${location.district}, ${location.city}`
            : location.city}
        </p>
      </div>

      {/* iOS izin butonu */}
      {permissionState === "prompt" && (
        <button
          onClick={requestPermission}
          className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Pusulayı Etkinleştir
        </button>
      )}

      {/* Pusula görselleştirmesi */}
      {hasCompass && (
        <div className="relative flex h-64 w-64 items-center justify-center">
          {/* Pusula halkası (cihaz yönüne göre döner) */}
          <div
            className="absolute inset-0 rounded-full border-2 border-border"
            style={{ transform: `rotate(${-heading}deg)`, transition: "transform 0.15s ease-out" }}
          >
            <span className="absolute left-1/2 top-2 -translate-x-1/2 text-xs font-bold text-primary">
              K
            </span>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
              G
            </span>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              D
            </span>
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              B
            </span>
          </div>

          {/* Kıble oku */}
          <div
            className="absolute inset-8"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <div className="flex h-full flex-col items-center">
              {/* Ok başı */}
              <div className="h-0 w-0 border-b-[14px] border-l-[7px] border-r-[7px] border-b-primary border-l-transparent border-r-transparent" />
              {/* Ok gövdesi */}
              <div className="h-16 w-1 bg-primary" />
            </div>
          </div>

          {/* Merkez */}
          <div className="z-10 flex h-14 w-14 items-center justify-center rounded-full bg-card border border-border">
            <span className="text-lg font-bold text-primary">
              {Math.round(qiblaBearing)}°
            </span>
          </div>
        </div>
      )}

      {/* Fallback: pusula donanımı yok */}
      {(permissionState === "unsupported" ||
        permissionState === "denied" ||
        (permissionState === "granted" && heading == null)) && (
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <Compass className="mx-auto mb-3 h-12 w-12 text-primary" />
            <p className="text-sm text-muted-foreground">
              {permissionState === "denied"
                ? "Pusula izni reddedildi."
                : "Pusula kullanılamıyor."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Kıble yönünüz:
            </p>
            <p className="mt-2 text-4xl font-bold text-primary">
              {qiblaBearing.toFixed(1)}°
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Kuzeyden saat yönünde
            </p>
          </div>
        )}

      {error && (
        <p className="text-center text-sm text-destructive">{error}</p>
      )}

      {/* Açı bilgisi */}
      <div className="rounded-xl bg-muted/50 px-4 py-2 text-center">
        <p className="text-xs text-muted-foreground">
          Kıble açısı:{" "}
          <span className="font-semibold text-foreground">
            {qiblaBearing.toFixed(1)}°
          </span>{" "}
          (kuzeyden saat yönünde)
        </p>
      </div>

      <AdBanner slot={AD_PLACEMENTS.kibleBanner} />
    </div>
  );
}
