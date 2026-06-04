"use client";

import { useCallback, useSyncExternalStore } from "react";
import { SPORTS } from "./site-data";
import { getSelectedSport, setSelectedSport } from "./sport-preference";

/** In-memory sport (client-only). Synced with cookies/localStorage via sport-preference. */
let preferredSport = undefined;
let hydrated = false;

const listeners = new Set();

function hydrateFromStorage() {
  if (typeof window === "undefined" || hydrated) {
    return;
  }
  hydrated = true;
  preferredSport = getSelectedSport(SPORTS);
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribePreferredSport(listener) {
  hydrateFromStorage();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getPreferredSportSnapshot() {
  hydrateFromStorage();
  return preferredSport;
}

export function getPreferredSportServerSnapshot() {
  return undefined;
}

/**
 * Single write path for sport selection (React + persistence stay in sync).
 * @param {string} value — sport label or "" to clear
 */
export function applyPreferredSport(value) {
  if (typeof window === "undefined") {
    return;
  }

  hydrateFromStorage();

  const next = value ? (SPORTS.includes(value) ? value : undefined) : undefined;
  if (preferredSport === next) {
    return;
  }

  preferredSport = next;
  setSelectedSport(next ?? "");
  emit();
}

if (typeof window !== "undefined") {
  window.addEventListener("va:selected-sport", () => {
    hydrateFromStorage();
    preferredSport = getSelectedSport(SPORTS);
    emit();
  });
}

/** Called from setSelectedSport when persistence changes outside applyPreferredSport. */
export function usePreferredSportSelection() {
  const sport = useSyncExternalStore(
    subscribePreferredSport,
    getPreferredSportSnapshot,
    getPreferredSportServerSnapshot,
  );

  const applySport = useCallback((value) => {
    applyPreferredSport(value ?? "");
  }, []);

  return {
    sport,
    hasSport: Boolean(sport),
    applySport,
  };
}
