const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const OUT = path.join("public", "images", "timeline", "1990s");
fs.mkdirSync(OUT, { recursive: true });

const urls = [
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783931565/WhatsApp_Image_2026-07-13_at_11.25.46_AM_q8dqut.jpg",
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783933792/WhatsApp_Image_2026-07-13_at_11.55.10_AM_gjigwz.jpg",
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783933793/WhatsApp_Image_2026-07-13_at_12.06.36_PM_fqdprb.jpg",
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783933792/WhatsApp_Image_2026-07-13_at_11.53.33_AM_ctdunc.jpg",
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783933793/WhatsApp_Image_2026-07-13_at_12.08.22_PM_bxfase.jpg",
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783933793/WhatsApp_Image_2026-07-13_at_11.57.21_AM_u5aekk.jpg",
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783933794/WhatsApp_Image_2026-07-13_at_11.50.26_AM_skddpf.jpg",
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783933793/WhatsApp_Image_2026-07-13_at_12.09.20_PM_pqaty3.jpg",
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783933793/WhatsApp_Image_2026-07-13_at_12.07.22_PM_my5nhe.jpg",
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783933793/WhatsApp_Image_2026-07-13_at_12.02.22_PM_smzypo.jpg",
];

function download(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    lib
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return download(res.headers.location).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error("HTTP " + res.statusCode + " " + url));
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

function isDark(r, g, b, threshold = 48) {
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

function slugFromUrl(url) {
  const base = url.split("/").pop().replace(/\.jpg$/i, "");
  return base.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80);
}

(async () => {
  const mapping = {};
  for (const url of urls) {
    const slug = slugFromUrl(url);
    const outName = `${slug}-white.jpg`;
    const outPath = path.join(OUT, outName);
    process.stdout.write(`Processing ${slug}... `);
    const buf = await download(url);
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
      .toFile(outPath);

    mapping[url] = `/images/timeline/1990s/${outName}`;
    console.log(`done (bg fill ${(ratio * 100).toFixed(1)}%)`);
  }

  fs.writeFileSync(path.join(OUT, "map.json"), JSON.stringify(mapping, null, 2));
  console.log("Wrote map.json");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
