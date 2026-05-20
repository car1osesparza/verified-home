"use client";

import { useEffect, useMemo, useState } from "react";
import TestimonialCard from "./TestimonialCard";

const DESKTOP_BATCH = 6;
const MOBILE_BATCH = 4;
const BATCH_BREAKPOINT_PX = 960;

function useExpandBatchSize() {
  const [batchSize, setBatchSize] = useState(DESKTOP_BATCH);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined;
    }
    try {
      const mq = window.matchMedia(`(min-width: ${BATCH_BREAKPOINT_PX}px)`);
      const update = () => setBatchSize(mq.matches ? DESKTOP_BATCH : MOBILE_BATCH);
      update();
      if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
      }
      mq.addListener(update);
      return () => mq.removeListener(update);
    } catch {
      setBatchSize(DESKTOP_BATCH);
      return undefined;
    }
  }, []);

  return batchSize;
}

export default function TestimonialsExpandLayout({ items, loading, fetchError, sportKey }) {
  const batchSize = useExpandBatchSize();
  const [visibleCount, setVisibleCount] = useState(batchSize);

  useEffect(() => {
    setVisibleCount(batchSize);
  }, [sportKey, batchSize]);

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const hasMore = !loading && !fetchError && visibleCount < items.length;

  const showMore = () => {
    setVisibleCount((n) => Math.min(n + batchSize, items.length));
  };

  const skeletonSlots = batchSize;

  return (
    <div className="t-expand">
      {loading && (
        <div
          className={`t-expand-grid t-expand-skeleton${batchSize >= DESKTOP_BATCH ? " t-expand-grid--wide" : ""}`}
          aria-busy="true"
        >
          {Array.from({ length: skeletonSlots }, (_, i) => (
            <div className="t-card t-carousel-card t-carousel-card--loading" key={i}>
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

      {!loading && !fetchError && (
        <>
          <div
            className={`t-expand-grid${batchSize >= DESKTOP_BATCH ? " t-expand-grid--wide" : ""}`}
            role="list"
            aria-label="Customer testimonials"
          >
            {visibleItems.map((item) => (
              <TestimonialCard key={item.id ?? item.name} item={item} />
            ))}
          </div>

          {hasMore ? (
            <div className="t-expand-actions">
              <button type="button" className="btn light t-expand-more-btn" onClick={showMore}>
                Show more testimonials
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
