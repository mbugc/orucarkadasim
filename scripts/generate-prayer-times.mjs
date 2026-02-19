// Bu script Aladhan API'den Diyanet hesaplama metodu (method=13) ile
// 81 il için Ramazan 2026 namaz vakitlerini çeker ve statik JSON olarak kaydeder.
// Kullanım: node scripts/generate-prayer-times.mjs

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const ALADHAN_BASE = "https://api.aladhan.com/v1/calendar";
const METHOD = 13; // Diyanet İşleri Başkanlığı
const SCHOOL = 1; // Hanefi

// Ramazan 2026: 19 Şubat - 20 Mart (Türkiye)
const RAMADAN_START_MONTH = 2; // Şubat
const RAMADAN_START_DAY = 19;
const RAMADAN_END_MONTH = 3; // Mart
const RAMADAN_END_DAY = 20;
const YEAR = 2026;

const locationsPath = resolve(__dirname, "../src/data/locations-tr.json");
const outputPath = resolve(__dirname, "../src/data/prayer-times-static.json");

const locations = JSON.parse(readFileSync(locationsPath, "utf-8"));

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function cleanTime(time) {
  return time.replace(/\s*\(.*\)/, "").trim();
}

async function fetchMonth(lat, lng, year, month) {
  const url = `${ALADHAN_BASE}/${year}/${month}?latitude=${lat}&longitude=${lng}&method=${METHOD}&school=${SCHOOL}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status} for ${url}`);
  const json = await res.json();
  return json.data;
}

async function main() {
  const result = {};
  const cities = locations.cities;
  console.log(`${cities.length} il için namaz vakitleri çekiliyor...`);

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    console.log(`[${i + 1}/${cities.length}] ${city.name}...`);

    try {
      // Şubat ve Mart verilerini çek
      const febData = await fetchMonth(city.lat, city.lng, YEAR, RAMADAN_START_MONTH);
      await sleep(300); // Rate limit koruması
      const marData = await fetchMonth(city.lat, city.lng, YEAR, RAMADAN_END_MONTH);
      await sleep(300);

      // Ramazan günlerini çıkar
      const ramadanDays = [];

      // Şubat 19-28 (index 18-27)
      for (let d = RAMADAN_START_DAY - 1; d < febData.length; d++) {
        const day = febData[d];
        ramadanDays.push({
          date: day.date.gregorian.date,
          day: ramadanDays.length + 1,
          imsak: cleanTime(day.timings.Imsak),
          fajr: cleanTime(day.timings.Fajr),
          sunrise: cleanTime(day.timings.Sunrise),
          dhuhr: cleanTime(day.timings.Dhuhr),
          asr: cleanTime(day.timings.Asr),
          maghrib: cleanTime(day.timings.Maghrib),
          isha: cleanTime(day.timings.Isha),
        });
      }

      // Mart 1-20 (index 0-19)
      for (let d = 0; d < RAMADAN_END_DAY; d++) {
        const day = marData[d];
        ramadanDays.push({
          date: day.date.gregorian.date,
          day: ramadanDays.length + 1,
          imsak: cleanTime(day.timings.Imsak),
          fajr: cleanTime(day.timings.Fajr),
          sunrise: cleanTime(day.timings.Sunrise),
          dhuhr: cleanTime(day.timings.Dhuhr),
          asr: cleanTime(day.timings.Asr),
          maghrib: cleanTime(day.timings.Maghrib),
          isha: cleanTime(day.timings.Isha),
        });
      }

      result[city.name] = {
        lat: city.lat,
        lng: city.lng,
        days: ramadanDays,
      };
    } catch (err) {
      console.error(`  HATA: ${city.name} - ${err.message}`);
    }
  }

  writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf-8");
  console.log(`\nTamamlandı! ${Object.keys(result).length} il kaydedildi: ${outputPath}`);
}

main().catch(console.error);
