const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Verilen koordinattan Kabe'ye olan yönü (bearing) hesaplar.
 * Kuzeyden saat yönünde derece cinsinden (0-360) döner.
 */
export function calculateQiblaBearing(lat: number, lng: number): number {
  const lat1 = toRad(lat);
  const lat2 = toRad(KAABA_LAT);
  const dLng = toRad(KAABA_LNG - lng);

  const x = Math.sin(dLng);
  const y = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLng);

  let bearing = toDeg(Math.atan2(x, y));
  return ((bearing % 360) + 360) % 360;
}
