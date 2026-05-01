"use client";

export const SELECTED_SPORT_KEY = "va_selected_sport";
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
  if (typeof window === "undefined" || !value) {
    return;
  }

  window.localStorage.setItem(SELECTED_SPORT_KEY, value);
  document.cookie = `${SELECTED_SPORT_KEY}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent("va:selected-sport", { detail: { sport: value } }));
}
