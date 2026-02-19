"use client";

import { useState, useMemo } from "react";
import { MapPin, Navigation, Building2 } from "lucide-react";
import { useAppStore, type Location } from "@/store/app-store";
import locationsData from "@/data/locations-tr.json";
import districtsData from "@/data/districts-tr.json";

type DistrictsMap = Record<string, { name: string; lat: number; lng: number }[]>;

interface LocationPickerProps {
  onLocationSet?: () => void;
}

export function LocationPicker({ onLocationSet }: LocationPickerProps) {
  const { location, setLocation } = useAppStore();
  const [selectedCity, setSelectedCity] = useState(location?.city || "");
  const [selectedDistrict, setSelectedDistrict] = useState(
    location?.district || ""
  );
  const [gpsLoading, setGpsLoading] = useState(false);
  const [error, setError] = useState("");

  const districts = useMemo(() => {
    if (!selectedCity) return [];
    return (districtsData as DistrictsMap)[selectedCity] || [];
  }, [selectedCity]);

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setSelectedDistrict("");
    // İl seçildi → ilçe dropdown'ı açılacak, store'a henüz yazma
  };

  const handleDistrictSelect = (districtName: string) => {
    setSelectedDistrict(districtName);

    if (!districtName) return; // Placeholder "İlçe seçin..." seçildi, bir şey yapma

    if (districtName === "__city_center__") {
      // "İl merkezi (genel)" seçildi
      const city = locationsData.cities.find((c) => c.name === selectedCity);
      if (city) {
        setLocation({
          city: selectedCity,
          lat: city.lat,
          lng: city.lng,
        });
        onLocationSet?.();
      }
      return;
    }

    const district = districts.find((d) => d.name === districtName);
    if (district) {
      const loc: Location = {
        city: selectedCity,
        district: district.name,
        lat: district.lat,
        lng: district.lng,
      };
      setLocation(loc);
      onLocationSet?.();
    }
  };

  const handleGPS = async () => {
    if (!navigator.geolocation) {
      setError("Tarayıcınız konum özelliğini desteklemiyor.");
      return;
    }

    setGpsLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // En yakın şehri bul
        let nearestCity = locationsData.cities[0];
        let minCityDist = Infinity;

        for (const city of locationsData.cities) {
          const dist = Math.sqrt(
            Math.pow(city.lat - latitude, 2) +
              Math.pow(city.lng - longitude, 2)
          );
          if (dist < minCityDist) {
            minCityDist = dist;
            nearestCity = city;
          }
        }

        // O şehirdeki en yakın ilçeyi bul
        const cityDistricts =
          (districtsData as DistrictsMap)[nearestCity.name] || [];
        let nearestDistrict = cityDistricts[0];
        let minDistDist = Infinity;

        for (const district of cityDistricts) {
          const dist = Math.sqrt(
            Math.pow(district.lat - latitude, 2) +
              Math.pow(district.lng - longitude, 2)
          );
          if (dist < minDistDist) {
            minDistDist = dist;
            nearestDistrict = district;
          }
        }

        const loc: Location = {
          city: nearestCity.name,
          district: nearestDistrict?.name,
          lat: nearestDistrict?.lat ?? latitude,
          lng: nearestDistrict?.lng ?? longitude,
        };

        setLocation(loc);
        setSelectedCity(nearestCity.name);
        setSelectedDistrict(nearestDistrict?.name || "");
        setGpsLoading(false);
        onLocationSet?.();
      },
      () => {
        setError("Konum alınamadı. Lütfen manuel olarak seçin.");
        setGpsLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleGPS}
        disabled={gpsLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        <Navigation className="h-5 w-5" />
        {gpsLoading ? "Konum alınıyor..." : "GPS ile Belirle"}
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">veya</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* İl Seçimi */}
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <select
          value={selectedCity}
          onChange={(e) => handleCitySelect(e.target.value)}
          className="w-full appearance-none rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">İl seçin...</option>
          {locationsData.cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* İlçe Seçimi (il seçildikten sonra görünür) */}
      {selectedCity && districts.length > 0 && (
        <div className="relative">
          <Building2 className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <select
            value={selectedDistrict}
            onChange={(e) => handleDistrictSelect(e.target.value)}
            className="w-full appearance-none rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">İlçe seçin...</option>
            <option value="__city_center__">İl merkezi (genel)</option>
            {districts.map((district) => (
              <option key={district.name} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <p className="text-center text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
