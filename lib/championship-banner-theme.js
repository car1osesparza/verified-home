import { hexToRgb, paletteFromImageData, rgbToHex } from "./logo-accent";

/** @typedef {{ hex: string; count: number; sat: number; lum: number; neutral: boolean }} LogoColorEntry */

/**
 * @typedef {Object} ChampionshipBannerTheme
 * @property {string} background
 * @property {string} border
 * @property {string} primaryText — “Champion”, division
 * @property {string} accentText — sport, year
 */

export const DEFAULT_CHAMPIONSHIP_BANNER_THEME = {
  background: "#6b0f1a",
  border: "#ffffff",
  primaryText: "#ffffff",
  accentText: "#e8c547",
};

/** @param {number} r @param {number} g @param {number} b */
function relativeLuminance(r, g, b) {
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** @param {string} hex */
function luminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  return relativeLuminance(rgb.r, rgb.g, rgb.b);
}

/** @param {string} fg @param {string} bg */
function contrastRatio(fg, bg) {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** @param {number} r @param {number} g @param {number} b */
function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: h * 360, s, l };
}

/** @param {string} a @param {string} b */
function colorsTooSimilar(a, b) {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  if (!ra || !rb) return a.toLowerCase() === b.toLowerCase();

  const ha = rgbToHsl(ra.r, ra.g, ra.b);
  const hb = rgbToHsl(rb.r, rb.g, rb.b);

  let hueDiff = Math.abs(ha.h - hb.h);
  if (hueDiff > 180) hueDiff = 360 - hueDiff;

  const satAvg = (ha.s + hb.s) / 2;
  const hueWeight = satAvg > 0.12 ? 1 : 0.35;
  const lumDiff = Math.abs(ha.l - hb.l);

  return hueDiff * hueWeight + lumDiff * 120 < 38;
}

/** @param {string} hex @param {number} amount 0–1 toward black */
function darkenHex(hex, amount = 0.2) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const mix = (c) => c * (1 - amount);
  return rgbToHex(mix(rgb.r), mix(rgb.g), mix(rgb.b));
}

/** @param {string} hex @param {number} amount 0–1 toward white */
function lightenHex(hex, amount = 0.18) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const mix = (c) => c + (255 - c) * amount;
  return rgbToHex(mix(rgb.r), mix(rgb.g), mix(rgb.b));
}

/** @param {string} hex */
function normalizeBackground(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return DEFAULT_CHAMPIONSHIP_BANNER_THEME.background;
  const { l, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  if (l > 0.62) return darkenHex(hex, 0.28);
  if (l > 0.48 && s < 0.2) return darkenHex(hex, 0.18);
  return hex;
}

/** @param {LogoColorEntry[]} ranked */
function isSingleColorPalette(ranked) {
  if (!ranked.length) return false;

  const totalCount = ranked.reduce((sum, entry) => sum + entry.count, 0);
  if (totalCount === 0) return false;

  const saturated = ranked.filter((entry) => !entry.neutral && entry.sat >= 0.12);
  if (saturated.length <= 1) return true;

  const topShare = ranked[0].count / totalCount;
  return topShare >= 0.68;
}

/** @param {LogoColorEntry[]} ranked @param {string} hex */
function normalizeBackgroundForPalette(ranked, hex) {
  let bg = normalizeBackground(hex);
  if (isSingleColorPalette(ranked)) {
    bg = darkenHex(bg, 0.34);
  }
  return bg;
}

/** @param {LogoColorEntry} entry */
function backgroundScore(entry) {
  return entry.count * (entry.neutral ? 0.22 : 1) * (1 + entry.sat * 2.4);
}

/**
 * @param {LogoColorEntry[]} ranked
 * @param {string[]} previousBackgrounds — only from other schools (for light de-dupe)
 */
function pickBackground(ranked, previousBackgrounds) {
  const byBgScore = [...ranked].sort((a, b) => backgroundScore(b) - backgroundScore(a));
  const prev = previousBackgrounds.filter(Boolean);
  const candidates = byBgScore.map((c) => normalizeBackgroundForPalette(ranked, c.hex));

  for (const candidate of candidates) {
    if (!prev.length || !prev.some((p) => colorsTooSimilar(candidate, p))) {
      return candidate;
    }
  }

  for (const candidate of candidates) {
    const shifted = darkenHex(candidate, 0.14);
    if (!prev.some((p) => colorsTooSimilar(shifted, p))) {
      return shifted;
    }
  }

  return candidates[0] || DEFAULT_CHAMPIONSHIP_BANNER_THEME.background;
}

/**
 * @param {LogoColorEntry[]} ranked
 * @param {string} background
 */
function pickBorder(ranked, background) {
  const bgLum = luminance(background);
  const neutrals = ranked.filter((c) => c.neutral && contrastRatio(c.hex, background) >= 2.6);

  if (bgLum < 0.42) {
    const darkEdge = neutrals.find((c) => c.lum < 0.42);
    if (darkEdge) return darkEdge.hex;
    const lightEdge = neutrals.find((c) => c.lum > 0.75);
    if (lightEdge) return lightEdge.hex;
    return "#ffffff";
  }

  const lightEdge = neutrals.find((c) => c.lum > 0.7);
  if (lightEdge) return lightEdge.hex;

  const accent = ranked.find(
    (c) => !c.neutral && !colorsTooSimilar(c.hex, background) && contrastRatio(c.hex, background) >= 2.8
  );
  if (accent) return accent.hex;

  return bgLum > 0.55 ? "#1a1a1a" : "#ffffff";
}

/**
 * @param {LogoColorEntry[]} ranked
 * @param {string} background
 */
function pickAccentText(ranked, background) {
  const saturated = ranked.filter(
    (c) =>
      !c.neutral &&
      !colorsTooSimilar(c.hex, background) &&
      contrastRatio(c.hex, background) >= 2.8 &&
      c.sat >= 0.18
  );

  saturated.sort((a, b) => b.sat * Math.sqrt(b.count) - a.sat * Math.sqrt(a.count));
  if (saturated[0]) return saturated[0].hex;

  const anyContrast = ranked.find(
    (c) => !colorsTooSimilar(c.hex, background) && contrastRatio(c.hex, background) >= 3.2
  );
  if (anyContrast) return anyContrast.hex;

  return luminance(background) > 0.5 ? darkenHex(background, 0.45) : lightenHex(background, 0.55);
}

/** @param {string} background */
function pickPrimaryText(background) {
  return luminance(background) > 0.52 ? "#111111" : "#ffffff";
}

/**
 * @param {LogoColorEntry[]} ranked
 * @param {{ fallback?: string; previousBackgrounds?: string[] }} [options]
 * @returns {ChampionshipBannerTheme}
 */
export function buildChampionshipBannerTheme(ranked, options = {}) {
  const { fallback = DEFAULT_CHAMPIONSHIP_BANNER_THEME.background, previousBackgrounds = [] } = options;

  if (!ranked.length) {
    const background = normalizeBackground(fallback);
    return {
      background,
      border: pickPrimaryText(background) === "#ffffff" ? "#ffffff" : "#1a1a1a",
      primaryText: pickPrimaryText(background),
      accentText: lightenHex(fallback, 0.35),
    };
  }

  const background = pickBackground(ranked, previousBackgrounds);
  return {
    background,
    border: pickBorder(ranked, background),
    primaryText: pickPrimaryText(background),
    accentText: pickAccentText(ranked, background),
  };
}

/**
 * @param {string | undefined} logoUrl
 * @param {{ fallback?: string; previousBackgrounds?: string[] }} [options]
 * @returns {Promise<ChampionshipBannerTheme>}
 */
export async function resolveChampionshipBannerTheme(logoUrl, options = {}) {
  if (typeof window === "undefined" || !logoUrl) {
    return buildChampionshipBannerTheme([], options);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    const finish = (ranked) => resolve(buildChampionshipBannerTheme(ranked, options));

    img.onload = () => {
      try {
        const size = 48;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          finish([]);
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        finish(paletteFromImageData(ctx.getImageData(0, 0, size, size)));
      } catch {
        finish([]);
      }
    };

    img.onerror = () => finish([]);
    img.src = logoUrl;
  });
}

/**
 * Stable key so repeat appearances of the same program reuse one theme.
 * @param {{ logoUrl?: string; schoolName?: string; id?: string }} banner
 */
export function championshipBannerThemeKey(banner) {
  return banner.logoUrl || banner.schoolName || banner.id || "";
}

/**
 * Resolve themes in list order. Same logo/school always shares one palette;
 * only the immediately prior *other* school can nudge background if too similar.
 * @param {{ id: string; logoUrl?: string; schoolName?: string; accentColor?: string }[]} banners
 */
export async function resolveChampionshipBannerThemes(banners) {
  /** @type {Record<string, ChampionshipBannerTheme>} */
  const themes = {};
  /** @type {Map<string, ChampionshipBannerTheme>} */
  const themeByProgram = new Map();

  for (let i = 0; i < banners.length; i += 1) {
    const banner = banners[i];
    const programKey = championshipBannerThemeKey(banner);

    if (programKey && themeByProgram.has(programKey)) {
      themes[banner.id] = themeByProgram.get(programKey);
      continue;
    }

    let previousBackgrounds = [];
    for (let j = i - 1; j >= 0; j -= 1) {
      const prevBanner = banners[j];
      if (championshipBannerThemeKey(prevBanner) !== programKey) {
        const prevTheme = themes[prevBanner.id];
        if (prevTheme?.background) {
          previousBackgrounds = [prevTheme.background];
        }
        break;
      }
    }

    const theme = await resolveChampionshipBannerTheme(banner.logoUrl, {
      fallback: banner.accentColor,
      previousBackgrounds,
    });

    themes[banner.id] = theme;
    if (programKey) {
      themeByProgram.set(programKey, theme);
    }
  }

  return themes;
}
