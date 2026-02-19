"use client";

import { useState, useEffect, useCallback } from "react";

interface CompassState {
  heading: number | null;
  error: string | null;
  permissionState: "prompt" | "granted" | "denied" | "unsupported";
}

export function useCompass() {
  const [state, setState] = useState<CompassState>({
    heading: null,
    error: null,
    permissionState: "prompt",
  });

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    // iOS: webkitCompassHeading, Android: 360 - alpha
    const heading =
      (event as unknown as { webkitCompassHeading?: number })
        .webkitCompassHeading ??
      (event.alpha != null ? (360 - event.alpha) % 360 : null);

    if (heading != null) {
      setState((prev) => ({ ...prev, heading, error: null }));
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("DeviceOrientationEvent" in window)) {
      setState((prev) => ({
        ...prev,
        permissionState: "unsupported",
        error: "Cihazınız pusula özelliğini desteklemiyor.",
      }));
      return;
    }

    // iOS 13+ izin gerektirir
    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof DOE.requestPermission === "function") {
      try {
        const permission = await DOE.requestPermission();
        if (permission === "granted") {
          setState((prev) => ({ ...prev, permissionState: "granted" }));
          window.addEventListener(
            "deviceorientation",
            handleOrientation,
            true
          );
        } else {
          setState((prev) => ({
            ...prev,
            permissionState: "denied",
            error: "Pusula izni reddedildi.",
          }));
        }
      } catch {
        setState((prev) => ({
          ...prev,
          permissionState: "denied",
          error: "Pusula izni alınamadı.",
        }));
      }
    } else {
      // Android / izin gerektirmeyen cihazlar
      setState((prev) => ({ ...prev, permissionState: "granted" }));
      window.addEventListener("deviceorientation", handleOrientation, true);
    }
  }, [handleOrientation]);

  useEffect(() => {
    return () => {
      window.removeEventListener(
        "deviceorientation",
        handleOrientation,
        true
      );
    };
  }, [handleOrientation]);

  return { ...state, requestPermission };
}
