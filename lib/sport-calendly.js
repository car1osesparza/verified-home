import { ATHLETIC_DEPARTMENT, COLLEGE_FOOTBALL } from "./site-data";

/** Calendly booking URLs from https://verifiedathletics.com/ (per sport where available). */
const SPORT_CALENDLY_URLS = {
  [COLLEGE_FOOTBALL]: "https://calendly.com/_verified/30min",
  [ATHLETIC_DEPARTMENT]: "https://calendly.com/sportstransferportal/20min",
  "Women's Basketball": "https://calendly.com/patty_at_verified_athletics/womens_basketball_demo",
  Softball: "https://calendly.com/patty_at_verified_athletics/softball_demo",
  Golf: "https://calendly.com/patty_at_verified_athletics/mens_or_womens_golf_demo",
  Tennis: "https://calendly.com/patty_at_verified_athletics/mens_or_womens_golf_demo",
  Lacrosse: "https://calendly.com/patty_at_verified_athletics/mens-or-womens-lacrosse",
  "Women's Volleyball": "https://calendly.com/patty_at_verified_athletics/volleyball_demo",
  "Track & Field": "https://calendly.com/patty_at_verified_athletics/mens_and_womens_track_and_field_demo",
};

/** Default for men's basketball, baseball, soccer, swimming, wrestling, other, etc. */
const DEFAULT_CALENDLY_URL = "https://calendly.com/sportstransferportal/20min";

export function getCalendlyUrlForSport(sport) {
  if (!sport?.trim()) {
    return undefined;
  }
  return SPORT_CALENDLY_URLS[sport] ?? DEFAULT_CALENDLY_URL;
}

export function openCalendlyForSport(sport) {
  const url = getCalendlyUrlForSport(sport);
  if (!url || typeof window === "undefined") {
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}
