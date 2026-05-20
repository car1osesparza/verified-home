"use client";

import { Fragment, useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "va_pm_testimonials_layout";

/** @typedef {"carousel" | "expand"} TestimonialsLayoutMode */

export function readStoredTestimonialsLayout() {
  if (typeof window === "undefined") {
    return "carousel";
  }
  return window.sessionStorage.getItem(STORAGE_KEY) === "expand" ? "expand" : "carousel";
}

export function writeStoredTestimonialsLayout(mode) {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(STORAGE_KEY, mode);
}

/**
 * PM review control — toggle testimonials layout A/B on the homepage.
 */
export default function PmTestimonialsDock({ layout, onLayoutChange }) {
  const [open, setOpen] = useState(false);

  const pick = useCallback(
    (mode) => {
      writeStoredTestimonialsLayout(mode);
      onLayoutChange(mode);
      setOpen(false);
    },
    [onLayoutChange]
  );

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <Fragment>
      {open ? (
        <button
          type="button"
          className="pm-alt-dock-backdrop"
          aria-label="Close PM view panel"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <div className={`pm-alt-dock pm-alt-dock--testimonials${open ? " pm-alt-dock--open" : ""}`}>
        <button
          type="button"
          className={`pm-alt-dock-fab${open ? " pm-alt-dock-fab--close" : ""}`}
          aria-expanded={open}
          aria-controls="pm-testimonials-dock-panel"
          aria-label={open ? "Close A/B testimonial view panel" : "Open A/B testimonial view"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "×" : "A/B testimonial view"}
        </button>
        {open ? (
          <div
            id="pm-testimonials-dock-panel"
            className="pm-alt-dock-panel"
            role="region"
            aria-label="Testimonials layout comparison"
          >
            <div className="pm-alt-dock-title">Testimonials layout (A/B)</div>
            <p className="pm-alt-dock-hint">
              Compare carousel navigation vs. progressive “show more”. Saved for this browser tab only.
            </p>
            <div className="pm-alt-dock-options">
              <label
                className={`pm-alt-dock-option${layout === "carousel" ? " is-active" : ""}`}
              >
                <input
                  type="radio"
                  name="pm-testimonials-layout"
                  checked={layout === "carousel"}
                  onChange={() => pick("carousel")}
                />
                <span>
                  <strong>A — Carousel</strong>
                  <span className="pm-alt-dock-sub">
                    Arrows + dots under; paginated groups (1 mobile / 3 desktop) for large catalogs (~30).
                  </span>
                </span>
              </label>
              <label
                className={`pm-alt-dock-option${layout === "expand" ? " is-active" : ""}`}
              >
                <input
                  type="radio"
                  name="pm-testimonials-layout"
                  checked={layout === "expand"}
                  onChange={() => pick("expand")}
                />
                <span>
                  <strong>B — Show more</strong>
                  <span className="pm-alt-dock-sub">
                    4 cards on mobile, 6 on desktop; centered button loads another batch.
                  </span>
                </span>
              </label>
            </div>
          </div>
        ) : null}
      </div>
    </Fragment>
  );
}
