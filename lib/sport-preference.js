/**
 * Bumped key so legacy `va_selected_sport` cookies/localStorage are ignored
 * (fresh default = no sport until the user selects again).
 */
export const SELECTED_SPORT_KEY = "va_preferred_sport_v2";
const LEGACY_SELECTED_SPORT_KEY = "va_selected_sport";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/** GitHub Pages project sites (e.g. /verified-home) need cookies scoped to that path. */
function getCookiePath() {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/+$/, "");
  return base || "/";
}

function parseCookies() {
  if (typeof document === "undefined") {
    return {};
  }

  return document.cookie.split(";").reduce((acc, pair) => {
    const [rawKey, ...rawValue] = pair.trim().split("=");
    if (!rawKey) {
      return acc;
    }

    acc[decodeURIComponent(rawKey)] = decodeURIComponent(rawValue.join("=") || "");
    return acc;
  }, {});
}

/** Maps legacy stored values to current sport labels. */
export function normalizeSportPreference(value, validSports = []) {
  if (!value || typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed === "Football") {
    return validSports.includes("College Football") ? "College Football" : undefined;
  }
  return validSports.includes(trimmed) ? trimmed : undefined;
}

export function getSelectedSport(validSports = []) {
  if (typeof window === "undefined") {
    return undefined;
  }

  const cookies = parseCookies();
  const cookieValue = normalizeSportPreference(cookies[SELECTED_SPORT_KEY], validSports);
  if (cookieValue) {
    return cookieValue;
  }

  const localValue = normalizeSportPreference(
    window.localStorage.getItem(SELECTED_SPORT_KEY),
    validSports,
  );
  if (localValue) {
    return localValue;
  }

  return undefined;
}

export function setSelectedSport(value) {
  if (typeof window === "undefined") {
    return;
  }

  const cookiePath = getCookiePath();

  if (!value) {
    window.localStorage.removeItem(SELECTED_SPORT_KEY);
    window.localStorage.removeItem(LEGACY_SELECTED_SPORT_KEY);
    document.cookie = `${SELECTED_SPORT_KEY}=; path=${cookiePath}; max-age=0; SameSite=Lax`;
    document.cookie = `${LEGACY_SELECTED_SPORT_KEY}=; path=${cookiePath}; max-age=0; SameSite=Lax`;
    if (cookiePath !== "/") {
      document.cookie = `${SELECTED_SPORT_KEY}=; path=/; max-age=0; SameSite=Lax`;
      document.cookie = `${LEGACY_SELECTED_SPORT_KEY}=; path=/; max-age=0; SameSite=Lax`;
    }
    window.dispatchEvent(new CustomEvent("va:selected-sport", { detail: { sport: "" } }));
    return;
  }

  window.localStorage.setItem(SELECTED_SPORT_KEY, value);
  document.cookie = `${SELECTED_SPORT_KEY}=${encodeURIComponent(value)}; path=${cookiePath}; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent("va:selected-sport", { detail: { sport: value } }));
}

/** Opens the global "pick a sport" modal (SiteChrome listens for `va:open-sport-modal`). */
export function openSportRequiredModal(redirectUrl) {
  if (typeof window === "undefined") {
    return;
  }
  const detail = redirectUrl ? { redirectUrl: String(redirectUrl) } : {};
  window.dispatchEvent(new CustomEvent("va:open-sport-modal", { detail }));
}
