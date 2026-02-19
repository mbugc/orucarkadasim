"use client";

import { Settings, MapPin, Info } from "lucide-react";
import { LocationPicker } from "@/components/location/location-picker";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { useAppStore } from "@/store/app-store";

export default function AyarlarPage() {
  const location = useAppStore((s) => s.location);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold">Ayarlar</h2>
      </div>

      {/* Konum */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Konum</h3>
        </div>

        {location && (
          <div className="mb-4 rounded-lg bg-muted/50 p-3">
            <p className="text-sm text-foreground">
              Mevcut konum:{" "}
              <span className="font-semibold">
                {location.district
                  ? `${location.district}, ${location.city}`
                  : location.city}
              </span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          </div>
        )}

        <LocationPicker />
      </div>

      {/* Bildirimler */}
      <NotificationSettings />

      {/* Hakkında */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Hakkında</h3>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="text-foreground">Oruç Arkadaşım</span> v1.0.0
          </p>
          <p>Namaz vakitleri: Diyanet İşleri Başkanlığı hesaplama metodu</p>
          <p>Mezhep: Hanefi</p>
          <p>İl verileri önceden yüklenmiştir. İlçe verileri ilk seçimde indirilir ve cache&apos;lenir.</p>
        </div>
      </div>
    </div>
  );
}
