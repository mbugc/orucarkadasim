import sharp from "sharp";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const ANDROID_RES = "android/app/src/main/res";

// Android launcher icon sizes (mipmap)
const MIPMAP_SIZES = {
  "mipmap-mdpi": 48,
  "mipmap-hdpi": 72,
  "mipmap-xhdpi": 96,
  "mipmap-xxhdpi": 144,
  "mipmap-xxxhdpi": 192,
};

// Adaptive icon foreground (with padding for safe zone: 108dp mapped)
const ADAPTIVE_SIZES = {
  "mipmap-mdpi": 108,
  "mipmap-hdpi": 162,
  "mipmap-xhdpi": 216,
  "mipmap-xxhdpi": 324,
  "mipmap-xxxhdpi": 432,
};

// Splash screen icon sizes
const SPLASH_SIZES = {
  "drawable-port-mdpi": { w: 320, h: 480 },
  "drawable-port-hdpi": { w: 480, h: 800 },
  "drawable-port-xhdpi": { w: 720, h: 1280 },
  "drawable-port-xxhdpi": { w: 1080, h: 1920 },
  "drawable-port-xxxhdpi": { w: 1440, h: 2560 },
  "drawable-land-mdpi": { w: 480, h: 320 },
  "drawable-land-hdpi": { w: 800, h: 480 },
  "drawable-land-xhdpi": { w: 1280, h: 720 },
  "drawable-land-xxhdpi": { w: 1920, h: 1080 },
  "drawable-land-xxxhdpi": { w: 2560, h: 1440 },
};

const svgPath = "public/icon.svg";

// Full icon SVG (with background)
const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="0" fill="#0f0f23"/>
  <circle cx="256" cy="230" r="120" fill="#c9a84c"/>
  <circle cx="300" cy="210" r="100" fill="#0f0f23"/>
  <polygon points="220,160 228,182 252,182 233,196 240,218 220,204 200,218 207,196 188,182 212,182" fill="#c9a84c"/>
  <text x="256" y="420" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="700" fill="#c9a84c">Oruç</text>
</svg>`;

// Foreground-only SVG (transparent bg, content centered in safe zone)
const fgSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108">
  <circle cx="48" cy="42" r="22" fill="#c9a84c"/>
  <circle cx="56" cy="38" r="18.5" fill="#0f0f23"/>
  <polygon points="41,29 42.5,33 47,33 43.5,35.5 44.8,39.5 41,37 37.2,39.5 38.5,35.5 35,33 39.5,33" fill="#c9a84c"/>
  <text x="54" y="80" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="700" fill="#c9a84c">Oruç</text>
</svg>`;

async function generate() {
  console.log("Generating Android icons...");

  // 1. Launcher icons (ic_launcher.png)
  for (const [folder, size] of Object.entries(MIPMAP_SIZES)) {
    const dir = join(ANDROID_RES, folder);
    mkdirSync(dir, { recursive: true });

    await sharp(Buffer.from(fullSvg))
      .resize(size, size)
      .png()
      .toFile(join(dir, "ic_launcher.png"));

    // Round icon (circular crop)
    const roundMask = Buffer.from(
      `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`
    );
    await sharp(Buffer.from(fullSvg))
      .resize(size, size)
      .png()
      .composite([{ input: roundMask, blend: "dest-in" }])
      .toFile(join(dir, "ic_launcher_round.png"));

    console.log(`  ${folder}: ${size}x${size}`);
  }

  // 2. Adaptive icon foreground
  for (const [folder, size] of Object.entries(ADAPTIVE_SIZES)) {
    const dir = join(ANDROID_RES, folder);
    await sharp(Buffer.from(fgSvg))
      .resize(size, size)
      .png()
      .toFile(join(dir, "ic_launcher_foreground.png"));
  }

  // 3. Splash screens (dark bg with centered icon)
  for (const [folder, dims] of Object.entries(SPLASH_SIZES)) {
    const dir = join(ANDROID_RES, folder);
    mkdirSync(dir, { recursive: true });

    const iconSize = Math.min(dims.w, dims.h) * 0.35;
    const icon = await sharp(Buffer.from(fullSvg))
      .resize(Math.round(iconSize), Math.round(iconSize))
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: dims.w,
        height: dims.h,
        channels: 4,
        background: { r: 15, g: 15, b: 35, alpha: 1 },
      },
    })
      .composite([{ input: icon, gravity: "centre" }])
      .png()
      .toFile(join(dir, "splash.png"));

    console.log(`  ${folder}: ${dims.w}x${dims.h}`);
  }

  // 4. Play Store icon (512x512)
  await sharp(Buffer.from(fullSvg))
    .resize(512, 512)
    .png()
    .toFile("play-store-icon.png");
  console.log("  play-store-icon.png: 512x512");

  // 5. Feature graphic (1024x500)
  const fgIcon = await sharp(Buffer.from(fullSvg))
    .resize(200, 200)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 1024,
      height: 500,
      channels: 4,
      background: { r: 15, g: 15, b: 35, alpha: 1 },
    },
  })
    .composite([{ input: fgIcon, gravity: "centre" }])
    .png()
    .toFile("play-store-feature.png");
  console.log("  play-store-feature.png: 1024x500");

  console.log("Done!");
}

generate().catch(console.error);
