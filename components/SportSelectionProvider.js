"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SPORTS } from "../lib/site-data";
import { getSelectedSport, setSelectedSport } from "../lib/sport-preference";

const SportSelectionContext = createContext(undefined);

/**
 * Single source of truth for the selected sport across nav, homepage, pricing, and modals.
 * Persists via `setSelectedSport` / `va:selected-sport` (see `lib/sport-preference.js`).
 */
export function SportSelectionProvider({ children }) {
  const [sport, setSport] = useState(undefined);

  useEffect(() => {
    const stored = getSelectedSport(SPORTS);
    if (stored) {
      setSport(stored);
    }
  }, []);

  useEffect(() => {
    const onSportUpdated = (event) => {
      const nextSport = event.detail?.sport;
      if (nextSport === "" || nextSport == null) {
        setSport(undefined);
        return;
      }
      if (SPORTS.includes(nextSport)) {
        setSport(nextSport);
      }
    };

    window.addEventListener("va:selected-sport", onSportUpdated);
    return () => window.removeEventListener("va:selected-sport", onSportUpdated);
  }, []);

  /** Pass `""` or `undefined` to clear. Updates React state and persisted preference together. */
  const applySport = useCallback((value) => {
    const next = value ?? "";
    setSelectedSport(next);
    if (!next) {
      setSport(undefined);
      return;
    }
    if (SPORTS.includes(next)) {
      setSport(next);
    }
  }, []);

  const value = useMemo(
    () => ({
      sport,
      hasSport: Boolean(sport),
      applySport,
    }),
    [sport, applySport],
  );

  return <SportSelectionContext.Provider value={value}>{children}</SportSelectionContext.Provider>;
}

export function useSportSelection() {
  const ctx = useContext(SportSelectionContext);
  if (ctx === undefined) {
    throw new Error("useSportSelection must be used within SportSelectionProvider");
  }
  return ctx;
}
