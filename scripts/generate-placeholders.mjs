import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "public", "images", "placeholders");
fs.mkdirSync(dir, { recursive: true });

function svg({ width, height, label, accent = 0 }) {
  const gold1 = "#d4af37";
  const gold2 = "#e8cf7a";
  const deep = "#4d0010";
  const burg = "#3a000c";
  const royal = "#760018";
  const cx = width / 2;
  const cy = height / 2;
  const framePad = Math.min(width, height) * 0.06;
  const diamond = 12 + (accent % 3) * 4;
  const rot = accent * 8;
  const fontSize = Math.max(14, Math.min(22, width * 0.035));

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${royal}"/>
      <stop offset="55%" stop-color="${deep}"/>
      <stop offset="100%" stop-color="${burg}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${gold1}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${gold2}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${gold1}" stop-opacity="0"/>
    </linearGradient>
    <pattern id="lines" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(${rot})">
      <path d="M0 48 L48 0" stroke="${gold1}" stroke-opacity="0.08" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#lines)"/>
  <rect x="${framePad}" y="${framePad}" width="${width - framePad * 2}" height="${height - framePad * 2}" fill="none" stroke="${gold1}" stroke-opacity="0.45" stroke-width="1.5"/>
  <rect x="${framePad + 8}" y="${framePad + 8}" width="${width - framePad * 2 - 16}" height="${height - framePad * 2 - 16}" fill="none" stroke="${gold2}" stroke-opacity="0.2" stroke-width="0.75"/>
  <g transform="translate(${cx}, ${cy - 28})">
    <path d="M0 -${diamond} L${diamond} 0 L0 ${diamond} L-${diamond} 0 Z" fill="none" stroke="${gold1}" stroke-width="1.25"/>
    <circle r="2.5" fill="${gold2}"/>
  </g>
  <line x1="${cx - 72}" y1="${cy + 8}" x2="${cx + 72}" y2="${cy + 8}" stroke="url(#shine)" stroke-width="1"/>
  <text x="${cx}" y="${cy + 36}" text-anchor="middle" fill="${gold2}" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" letter-spacing="0.18em">${label.toUpperCase()}</text>
  <text x="${cx}" y="${cy + 58}" text-anchor="middle" fill="#fffdf8" fill-opacity="0.55" font-family="Georgia, serif" font-size="11" letter-spacing="0.12em">UNCLE TIM ARCHIVE</text>
</svg>`;
}

const files = [];

for (let n = 1; n <= 4; n++) {
  files.push({ name: `hero-0${n}.svg`, w: 1920, h: 1080, label: "Archive Image", accent: n });
}
for (let n = 1; n <= 8; n++) {
  files.push({ name: `timeline-0${n}.svg`, w: 1000, h: 750, label: "Archive Image", accent: n + 1 });
}
for (let n = 1; n <= 9; n++) {
  files.push({ name: `gallery-0${n}.svg`, w: 900, h: 1100, label: "Archive Image", accent: n });
}
for (let n = 10; n <= 12; n++) {
  files.push({ name: `gallery-${n}.svg`, w: 1100, h: 800, label: "Archive Image", accent: n });
}
for (let n = 1; n <= 6; n++) {
  files.push({ name: `newspaper-0${n}.svg`, w: 900, h: 1200, label: "Press Archive", accent: n });
}
for (let n = 1; n <= 6; n++) {
  files.push({ name: `certificate-0${n}.svg`, w: 800, h: 1100, label: "Certificate", accent: n + 2 });
}
for (let n = 1; n <= 5; n++) {
  files.push({ name: `story-0${n}.svg`, w: 1400, h: 900, label: "Story Image", accent: n });
}
files.push({ name: "og-default.svg", w: 1200, h: 630, label: "Uncle Tim", accent: 5 });

for (const f of files) {
  fs.writeFileSync(
    path.join(dir, f.name),
    svg({ width: f.w, height: f.h, label: f.label, accent: f.accent }),
  );
}

console.log(`Wrote ${files.length} SVG placeholders to ${dir}`);
