import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#0f0f23"/>
  <circle cx="256" cy="220" r="130" fill="#c9a84c"/>
  <circle cx="310" cy="195" r="110" fill="#0f0f23"/>
  <polygon points="215,145 225,172 254,172 231,189 239,216 215,199 191,216 199,189 176,172 205,172" fill="#c9a84c"/>
  <text x="256" y="430" text-anchor="middle" font-family="Arial, sans-serif" font-size="76" font-weight="700" fill="#c9a84c">Oruç</text>
</svg>`;

const sizes = [192, 512];

for (const size of sizes) {
  const buffer = await sharp(Buffer.from(svgIcon))
    .resize(size, size)
    .png()
    .toBuffer();

  const outputPath = join(publicDir, `icon-${size}.png`);
  writeFileSync(outputPath, buffer);
  console.log(`Generated: icon-${size}.png (${buffer.length} bytes)`);
}

// Also generate a favicon
const favicon = await sharp(Buffer.from(svgIcon))
  .resize(32, 32)
  .png()
  .toBuffer();

writeFileSync(join(publicDir, "favicon.png"), favicon);
console.log(`Generated: favicon.png (${favicon.length} bytes)`);

console.log("Done!");
