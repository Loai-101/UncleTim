const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const https = require("https");

const OUT = path.join("public", "images", "timeline", "1990s");
fs.mkdirSync(OUT, { recursive: true });

/** Only press clippings that need black → white */
const urls = [
  {
    url: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783933792/WhatsApp_Image_2026-07-13_at_11.55.10_AM_gjigwz.jpg",
    out: "gjigwz-white.jpg",
  },
  {
    url: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783933793/WhatsApp_Image_2026-07-13_at_11.57.21_AM_u5aekk.jpg",
    out: "u5aekk-white.jpg",
  },
  {
    url: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783933793/WhatsApp_Image_2026-07-13_at_12.02.22_PM_smzypo.jpg",
    out: "smzypo-white.jpg",
  },
  {
    url: "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783933794/WhatsApp_Image_2026-07-13_at_11.50.26_AM_skddpf.jpg",
    out: "skddpf-white.jpg",
  },
];

function download(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return download(res.headers.location).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error("HTTP " + res.statusCode));
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

function isDark(r, g, b, threshold = 55) {
  return (r + g + b) / 3 < threshold;
}

function floodFillBlackToWhite(data, width, height, channels) {
  const visited = new Uint8Array(width * height);
  const stack = [];
  const pushIfDark = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = y * width + x;
    if (visited[i]) return;
    const o = i * channels;
    if (!isDark(data[o], data[o + 1], data[o + 2])) return;
    visited[i] = 1;
    stack.push(i);
  };

  for (let x = 0; x < width; x++) {
    pushIfDark(x, 0);
    pushIfDark(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushIfDark(0, y);
    pushIfDark(width - 1, y);
  }

  while (stack.length) {
    const i = stack.pop();
    const x = i % width;
    const y = (i / width) | 0;
    const o = i * channels;
    data[o] = 255;
    data[o + 1] = 255;
    data[o + 2] = 255;
    if (channels === 4) data[o + 3] = 255;
    pushIfDark(x + 1, y);
    pushIfDark(x - 1, y);
    pushIfDark(x, y + 1);
    pushIfDark(x, y - 1);
  }

  let count = 0;
  for (let i = 0; i < visited.length; i++) count += visited[i];
  return count / visited.length;
}

(async () => {
  for (const item of urls) {
    process.stdout.write(`${item.out}... `);
    const buf = await download(item.url);
    const { data, info } = await sharp(buf)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const ratio = floodFillBlackToWhite(
      data,
      info.width,
      info.height,
      info.channels,
    );
    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels,
      },
    })
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(path.join(OUT, item.out));
    console.log(`ok (${(ratio * 100).toFixed(1)}% filled)`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
