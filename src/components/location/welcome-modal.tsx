"use client";

import { useState } from "react";
import { Moon } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { LocationPicker } from "./location-picker";

export function WelcomeModal() {
  const location = useAppStore((s) => s.location);
  const [dismissed, setDismissed] = useState(false);

  // Konum daha önce kaydedilmişse (sayfa yenilemede) veya kullanıcı seçimi tamamladıysa gösterme
  if (dismissed || location) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <Moon className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Hoş Geldiniz!</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Oruç Arkadaşım&apos;ı kullanmak için konumunuzu belirleyin
          </p>
        </div>
        <LocationPicker onLocationSet={() => setDismissed(true)} />
      </div>
    </div>
  );
}
