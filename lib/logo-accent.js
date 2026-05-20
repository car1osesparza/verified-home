/** @param {string} hex */
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  if (h.length !== 6) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/** @param {number} r @param {number} g @param {number} b */
function rgbToHex(r, g, b) {
  const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${[r, g, b].map((n) => clamp(n).toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Pick a saturated accent from logo pixels (falls back when CORS blocks sampling).
 * @param {ImageData} imageData
 * @param {string} fallback
 */
export function accentFromImageData(imageData, fallback = "#e8c547") {
  const { data } = imageData;
  const buckets = new Map();

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 48) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lum = (max + min) / 2;
    const sat = max === min ? 0 : (max - min) / max;
    if (lum < 28 || lum > 238 || sat < 0.12) continue;

    const key = `${Math.round(r / 24) * 24},${Math.round(g / 24) * 24},${Math.round(b / 24) * 24}`;
    const prev = buckets.get(key) || { r: 0, g: 0, b: 0, n: 0, sat: 0 };
    prev.r += r;
    prev.g += g;
    prev.b += b;
    prev.n += 1;
    prev.sat += sat;
    buckets.set(key, prev);
  }

  let best = null;
  let bestScore = -1;
  for (const bucket of buckets.values()) {
    if (bucket.n < 4) continue;
    const score = bucket.sat * Math.sqrt(bucket.n);
    if (score > bestScore) {
      bestScore = score;
      best = bucket;
    }
  }

  if (!best) return fallback;

  const r = best.r / best.n;
  const g = best.g / best.n;
  const b = best.b / best.n;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  const boost = 1 + (0.55 - sat) * 0.35;
  return rgbToHex(r * boost, g * boost, b * boost);
}

/**
 * Load a logo URL and extract a brand accent (client-only).
 * @param {string | undefined} logoUrl
 * @param {string} fallback
 * @returns {Promise<string>}
 */
export function extractLogoAccent(logoUrl, fallback = "#e8c547") {
  if (typeof window === "undefined" || !logoUrl) {
    return Promise.resolve(fallback);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    const finish = (color) => resolve(color || fallback);

    img.onload = () => {
      try {
        const size = 40;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          finish(fallback);
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        finish(accentFromImageData(ctx.getImageData(0, 0, size, size), fallback));
      } catch {
        finish(fallback);
      }
    };

    img.onerror = () => finish(fallback);
    img.src = logoUrl;
  });
}

/** @param {string} hex @param {number} amount 0–1 */
export function mixAccentIntoBackground(hex, amount = 0.14) {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#060d18";
  const base = { r: 6, g: 13, b: 24 };
  return rgbToHex(
    base.r + (rgb.r - base.r) * amount,
    base.g + (rgb.g - base.g) * amount,
    base.b + (rgb.b - base.b) * amount
  );
}

