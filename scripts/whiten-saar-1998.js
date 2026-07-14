const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const OUT = path.join("public", "images", "timeline", "1990s");
fs.mkdirSync(OUT, { recursive: true });

const urls = [
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783935810/WhatsApp_Image_2026-07-13_at_12.31.23_PM_eeszmb.jpg",
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783935809/WhatsApp_Image_2026-07-13_at_12.28.43_PM_n2ooqo.jpg",
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783935809/WhatsApp_Image_2026-07-13_at_12.23.56_PM_w8yjoo.jpg",
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783935810/WhatsApp_Image_2026-07-13_at_12.39.07_PM_qei8fx.jpg",
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783935809/WhatsApp_Image_2026-07-13_at_12.26.23_PM_ierhkb.jpg",
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783935810/WhatsApp_Image_2026-07-13_at_12.22.18_PM_qk5pvx.jpg",
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783935810/WhatsApp_Image_2026-07-13_at_12.42.51_PM_tlkm77.jpg",
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783935810/WhatsApp_Image_2026-07-13_at_12.40.09_PM_piywk6.jpg",
  "https://res.cloudinary.com/dvybb2xnc/image/upload/v1783935810/WhatsApp_Image_2026-07-13_at_12.41.05_PM_ju2n7q.jpg",
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

    mapping[url] = {
      path: `/images/timeline/1990s/${outName}`,
      fill: ratio,
    };
    console.log(`done (bg fill ${(ratio * 100).toFixed(1)}%)`);
  }
  fs.writeFileSync(path.join(OUT, "saar-map.json"), JSON.stringify(mapping, null, 2));
  console.log("Wrote saar-map.json");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
