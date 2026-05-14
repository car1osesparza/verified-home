/**
 * Bumped key so legacy `va_selected_sport` cookies/localStorage are ignored
 * (fresh default = no sport until the user selects again).
 */
export const SELECTED_SPORT_KEY = "va_preferred_sport_v2";
const LEGACY_SELECTED_SPORT_KEY = "va_selected_sport";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

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

export function getSelectedSport(validSports = []) {
  if (typeof window === "undefined") {
    return undefined;
  }

  const cookies = parseCookies();
  const cookieValue = cookies[SELECTED_SPORT_KEY];
  if (cookieValue && validSports.includes(cookieValue)) {
    return cookieValue;
  }

  const localValue = window.localStorage.getItem(SELECTED_SPORT_KEY);
  if (localValue && validSports.includes(localValue)) {
    return localValue;
  }

  return undefined;
}

export function setSelectedSport(value) {
  if (typeof window === "undefined") {
    return;
  }

  if (!value) {
    window.localStorage.removeItem(SELECTED_SPORT_KEY);
    window.localStorage.removeItem(LEGACY_SELECTED_SPORT_KEY);
    document.cookie = `${SELECTED_SPORT_KEY}=; path=/; max-age=0; SameSite=Lax`;
    document.cookie = `${LEGACY_SELECTED_SPORT_KEY}=; path=/; max-age=0; SameSite=Lax`;
    window.dispatchEvent(new CustomEvent("va:selected-sport", { detail: { sport: "" } }));
    return;
  }

  window.localStorage.setItem(SELECTED_SPORT_KEY, value);
  document.cookie = `${SELECTED_SPORT_KEY}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
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
