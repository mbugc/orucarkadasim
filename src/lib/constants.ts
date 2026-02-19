// Ramazan 2026 (Türkiye/Diyanet): 19 Şubat - 20 Mart
export const RAMADAN_START = new Date(2026, 1, 19); // Şubat = 1
export const RAMADAN_END = new Date(2026, 2, 20); // Mart = 2
export const RAMADAN_DAYS = 30;

export const APP_NAME = "Oruç Arkadaşım";
export const APP_DESCRIPTION = "Ramazan Rehberiniz";

export const PRAYER_NAMES: Record<string, string> = {
  Imsak: "İmsak",
  Fajr: "Sabah",
  Sunrise: "Güneş",
  Dhuhr: "Öğle",
  Asr: "İkindi",
  Maghrib: "Akşam",
  Isha: "Yatsı",
};

// Namaz vakitleri: Diyanet İşleri Başkanlığı hesaplama metodu (method=13)
// Hanefi mezhebi (İkindi namazı için school=1)
// Veriler statik olarak uygulamaya gömülüdür.

export const TURKISH_MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export const TURKISH_DAYS = [
  "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi",
];
