"use client";

import { Fragment, useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "va_pm_home_map_layout";

/** @typedef {"split" | "stack" | "hero"} HomeMapLayoutMode */

export function readStoredMapLayout() {
  if (typeof window === "undefined") {
    return "split";
  }
  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (raw === "stack" || raw === "hero") {
    return raw;
  }
  return "split";
}

export function writeStoredMapLayout(mode) {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(STORAGE_KEY, mode);
}

/**
 * PM / design review: floating control to toggle homepage map + dominance copy layout (A/B/C).
 * Expandable; state persists for the tab session only.
 */
export default function PmAlternateViewDock({ layout, onLayoutChange }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pick = useCallback(
    (mode) => {
      writeStoredMapLayout(mode);
      onLayoutChange(mode);
      setOpen(false);
    },
    [onLayoutChange]
  );

  return (
    <Fragment>
      {open ? (
        <button
          type="button"
          className="pm-alt-dock-backdrop"
          aria-label="Close A/B/C comparison panel"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <div className={`pm-alt-dock${open ? " pm-alt-dock--open" : ""}`}>
        <button
          type="button"
          className={`pm-alt-dock-fab${open ? " pm-alt-dock-fab--close" : ""}`}
          aria-expanded={open}
          aria-controls={open ? "pm-alt-dock-panel" : undefined}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close A/B/C comparison panel" : "Open A/B/C comparison panel"}
        >
          {open ? <span aria-hidden="true">×</span> : "A/B/C comparison"}
        </button>
        {open ? (
          <div id="pm-alt-dock-panel" className="pm-alt-dock-panel" role="region" aria-label="A/B/C layout comparison">
            <div className="pm-alt-dock-title">Map + dominance copy</div>
            <p className="pm-alt-dock-hint">Session-only. Refreshes other tabs until you set again.</p>
            <div className="pm-alt-dock-options" role="radiogroup" aria-label="Layout variation">
              <label className={`pm-alt-dock-option${layout === "hero" ? " is-active" : ""}`}>
                <input type="radio" name="pm-map-layout" checked={layout === "hero"} onChange={() => pick("hero")} />
                <span>
                  <strong>A — Map + hero</strong>
                  <span className="pm-alt-dock-sub">
                    Widest screens: map on the right inside the hero; proof copy stays in the red band. Narrower
                    widths: map moves to its own blue band above the red bar.
                  </span>
                </span>
              </label>
              <label className={`pm-alt-dock-option${layout === "split" ? " is-active" : ""}`}>
                <input type="radio" name="pm-map-layout" checked={layout === "split"} onChange={() => pick("split")} />
                <span>
                  <strong>B — Map + proof</strong>
                  <span className="pm-alt-dock-sub">Proof copy in the blue band beside the map.</span>
                </span>
              </label>
              <label className={`pm-alt-dock-option${layout === "stack" ? " is-active" : ""}`}>
                <input type="radio" name="pm-map-layout" checked={layout === "stack"} onChange={() => pick("stack")} />
                <span>
                  <strong>C — Map alone</strong>
                  <span className="pm-alt-dock-sub">Map only in the blue band; same proof copy in the red banner below.</span>
                </span>
              </label>
            </div>
          </div>
        ) : null}
      </div>
    </Fragment>
  );
}
