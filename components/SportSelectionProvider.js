"use client";

import { createContext, useContext, useMemo } from "react";
import { usePreferredSportSelection } from "../lib/preferred-sport";

const SportSelectionContext = createContext(undefined);

/**
 * Single source of truth for the selected sport across nav, homepage, pricing, and modals.
 */
export function SportSelectionProvider({ children }) {
  const selection = usePreferredSportSelection();

  const value = useMemo(
    () => ({
      sport: selection.sport,
      hasSport: selection.hasSport,
      applySport: selection.applySport,
    }),
    [selection.sport, selection.hasSport, selection.applySport],
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
