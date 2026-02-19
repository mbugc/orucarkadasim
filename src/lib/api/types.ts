// Statik namaz vakitleri veri yapısı (Diyanet hesaplama metodu)

export interface StaticPrayerDay {
  date: string; // "19-02-2026"
  day: number; // Ramazan günü (1-30)
  imsak: string; // "06:22"
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string; // İftar vakti
  isha: string;
}

export interface StaticCityData {
  lat: number;
  lng: number;
  days: StaticPrayerDay[];
}

export interface StaticPrayerTimesData {
  [cityName: string]: StaticCityData;
}

// Eski Aladhan tipleriyle uyumluluk için
export interface PrayerTimings {
  Imsak: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}
