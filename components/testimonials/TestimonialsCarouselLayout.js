"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TestimonialCard from "./TestimonialCard";

const AUTO_MS = 8000;
const WIDE_BREAKPOINT_PX = 960;

function useWideTestimonialsLayout() {
  const [wide, setWide] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined;
    }
    try {
      const mq = window.matchMedia(`(min-width: ${WIDE_BREAKPOINT_PX}px)`);
      const update = () => setWide(mq.matches);
      update();
      if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
      }
      mq.addListener(update);
      return () => mq.removeListener(update);
    } catch {
      setWide(false);
      return undefined;
    }
  }, []);

  return wide;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined;
    }
    try {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      const update = () => setReduced(mq.matches);
      update();
      if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
      }
      mq.addListener(update);
      return () => mq.removeListener(update);
    } catch {
      setReduced(false);
      return undefined;
    }
  }, []);
  return reduced;
}

export default function TestimonialsCarouselLayout({ items, loading, fetchError, sportKey }) {
  const [pageIndex, setPageIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const pauseRef = useRef(false);
  const regionId = "homepage-testimonials-carousel";
  const isWideLayout = useWideTestimonialsLayout();

  const len = items.length;
  const visibleCount = useMemo(() => {
    if (!len) return 0;
    if (!isWideLayout) return 1;
    return Math.min(3, len);
  }, [len, isWideLayout]);

  const pageCount = useMemo(() => {
    if (!len || !visibleCount) return 0;
    return Math.ceil(len / visibleCount);
  }, [len, visibleCount]);

  useEffect(() => {
    setPageIndex(0);
  }, [sportKey, visibleCount]);

  useEffect(() => {
    if (pageCount <= 0) return;
    setPageIndex((p) => Math.min(p, pageCount - 1));
  }, [pageCount]);

  const start = pageIndex * visibleCount;

  const visibleItems = useMemo(() => {
    if (!len || !visibleCount) return [];
    return items.slice(start, Math.min(start + visibleCount, len));
  }, [items, len, start, visibleCount]);

  const slotCount = visibleItems.length;

  const go = useCallback(
    (delta) => {
      if (!len || pageCount <= 1) return;
      setPageIndex((p) => (p + delta + pageCount) % pageCount);
    },
    [len, pageCount]
  );

  const goPrev = useCallback(() => go(-1), [go]);
  const goNext = useCallback(() => go(1), [go]);

  useEffect(() => {
    if (reducedMotion || pageCount <= 1 || loading) return undefined;
    const id = window.setInterval(() => {
      if (pauseRef.current || document.hidden) return;
      goNext();
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, pageCount, loading, goNext, sportKey]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  return (
    <div
      className="t-carousel"
      onMouseEnter={() => {
        pauseRef.current = true;
      }}
      onMouseLeave={() => {
        pauseRef.current = false;
      }}
      onFocusCapture={() => {
        pauseRef.current = true;
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          pauseRef.current = false;
        }
      }}
    >
      <div className="t-carousel-main">
        <button
          type="button"
          className="t-carousel-nav t-carousel-nav--prev"
          aria-controls={regionId}
          aria-label="Previous testimonial group"
          disabled={!len || pageCount <= 1}
          onClick={goPrev}
        >
          <span aria-hidden="true">‹</span>
        </button>

        <div
          className={`t-carousel-stage${slotCount > 1 ? ` t-carousel-stage--cols-${slotCount}` : ""}`}
          id={regionId}
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
          aria-live="polite"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          {loading && (
            <div
              className={`t-carousel-skeleton-grid${isWideLayout ? " t-carousel-skeleton-grid--wide" : ""}`}
              aria-busy="true"
            >
              {(isWideLayout ? [0, 1, 2] : [0]).map((slot) => (
                <div className="t-card t-carousel-card t-carousel-card--loading" key={slot}>
                  <div className="t-quote t-carousel-skeleton-line" />
                  <div className="t-quote t-carousel-skeleton-line t-carousel-skeleton-line--short" />
                  <div className="t-foot">
                    <div className="t-avatar t-carousel-skeleton-avatar" />
                    <div>
                      <div className="t-carousel-skeleton-line t-carousel-skeleton-line--name" />
                      <div className="t-carousel-skeleton-line t-carousel-skeleton-line--role" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && fetchError && (
            <div className="t-card t-carousel-card">
              <p className="t-quote" style={{ fontStyle: "normal" }}>
                {fetchError}
              </p>
            </div>
          )}

          {!loading &&
            !fetchError &&
            visibleItems.map((item, slot) => (
              <TestimonialCard
                key={`${item.id ?? item.name}-${pageIndex}-${slot}`}
                item={item}
                className="t-carousel-card"
              />
            ))}
        </div>

        <button
          type="button"
          className="t-carousel-nav t-carousel-nav--next"
          aria-controls={regionId}
          aria-label="Next testimonial group"
          disabled={!len || pageCount <= 1}
          onClick={goNext}
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      {pageCount > 1 && !loading && (
        <div className="t-carousel-dots" role="tablist" aria-label="Testimonial pages">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={pageIndex === i}
              aria-current={pageIndex === i ? "true" : undefined}
              aria-label={`Go to testimonial page ${i + 1} of ${pageCount}`}
              className={`t-carousel-dot${pageIndex === i ? " t-carousel-dot--active" : ""}`}
              onClick={() => setPageIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
