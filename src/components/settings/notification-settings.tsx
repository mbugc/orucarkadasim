"use client";

import { Bell } from "lucide-react";
import { useNotificationStore } from "@/store/notification-store";
import { useNotificationScheduler } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";

function ToggleRow({
  label,
  enabled,
  onToggle,
  minutesBefore,
  onMinutesChange,
  minuteOptions,
}: {
  label: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  minutesBefore?: number;
  onMinutesChange?: (v: number) => void;
  minuteOptions?: number[];
}) {
  return (
    <div className="space-y-2 border-b border-border/50 py-3 last:border-0">
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground">{label}</span>
        <button
          onClick={() => onToggle(!enabled)}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors",
            enabled ? "bg-primary" : "bg-border"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
              enabled ? "translate-x-5" : "translate-x-0.5"
            )}
          />
        </button>
      </div>
      {enabled && minuteOptions && onMinutesChange && (
        <div className="flex gap-1.5">
          {minuteOptions.map((m) => (
            <button
              key={m}
              onClick={() => onMinutesChange(m)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                minutesBefore === m
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {m} dk
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function NotificationSettings() {
  const {
    imsakEnabled,
    imsakMinutesBefore,
    iftarEnabled,
    iftarMinutesBefore,
    namazEnabled,
    permissionState,
    setImsakEnabled,
    setImsakMinutesBefore,
    setIftarEnabled,
    setIftarMinutesBefore,
    setNamazEnabled,
  } = useNotificationStore();
  const { requestPermission } = useNotificationScheduler();

  const notificationsSupported =
    typeof window !== "undefined" && "Notification" in window;

  const handleRequestPermission = async () => {
    await requestPermission();
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Bell className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Bildirimler</h3>
      </div>

      {!notificationsSupported && (
        <p className="text-sm text-muted-foreground">
          Tarayıcınız bildirimleri desteklemiyor.
        </p>
      )}

      {notificationsSupported && permissionState !== "granted" && (
        <div className="mb-4">
          {permissionState === "denied" ? (
            <p className="text-sm text-muted-foreground">
              Bildirim izni reddedildi. Tarayıcı ayarlarından etkinleştirin.
            </p>
          ) : (
            <button
              onClick={handleRequestPermission}
              className="w-full rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              Bildirimleri Etkinleştir
            </button>
          )}
        </div>
      )}

      {notificationsSupported && permissionState === "granted" && (
        <div>
          <ToggleRow
            label="İmsak Alarmı"
            enabled={imsakEnabled}
            onToggle={setImsakEnabled}
            minutesBefore={imsakMinutesBefore}
            onMinutesChange={setImsakMinutesBefore}
            minuteOptions={[15, 30, 45, 60]}
          />
          <ToggleRow
            label="İftar Alarmı"
            enabled={iftarEnabled}
            onToggle={setIftarEnabled}
            minutesBefore={iftarMinutesBefore}
            onMinutesChange={setIftarMinutesBefore}
            minuteOptions={[5, 10, 15, 30]}
          />
          <ToggleRow
            label="Namaz Vakitleri"
            enabled={namazEnabled}
            onToggle={setNamazEnabled}
          />
          <p className="mt-2 text-[10px] text-muted-foreground">
            Bildirimler uygulama açıkken çalışır. Capacitor ile mobil
            uygulamada arka planda da çalışacaktır.
          </p>
        </div>
      )}
    </div>
  );
}
